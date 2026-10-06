-- MonDjassa : paiement de l'abonnement par Wave, validé par l'admin
-- À exécuter une fois dans Supabase > SQL Editor (relançable sans risque).

create table if not exists public.payment_requests (
  id         uuid primary key default gen_random_uuid(),
  shop_id    uuid not null references public.shops (id) on delete cascade,
  plan       text not null check (plan in ('monthly', 'yearly')),
  amount     integer not null check (amount >= 0),
  reference  text not null check (char_length(reference) between 3 and 80),
  status     text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create index if not exists payment_requests_status_idx on public.payment_requests (status, created_at desc);

alter table public.payment_requests enable row level security;
revoke insert, update, delete on public.payment_requests from anon, authenticated;

-- La vendeuse voit ses propres demandes
drop policy if exists "payment_requests: lecture" on public.payment_requests;
create policy "payment_requests: lecture" on public.payment_requests for select to authenticated
  using (public.is_shop_owner(shop_id));

-- La vendeuse déclare son paiement Wave : l'abonnement est activé tout de suite,
-- l'admin vérifie ensuite dans Wave (et retire la période en cas de fraude).
-- Une seule déclaration non vérifiée à la fois.
drop function if exists public.request_payment(text, text);
create or replace function public.request_payment(p_plan text, p_reference text)
returns timestamptz
language plpgsql security definer set search_path = public
as $$
declare
  v_shop public.shops;
  v_until timestamptz;
begin
  select * into v_shop from public.shops where owner_id = auth.uid();
  if not found then raise exception 'boutique introuvable'; end if;
  if p_plan not in ('monthly', 'yearly') then raise exception 'formule inconnue'; end if;
  if exists (select 1 from public.payment_requests where shop_id = v_shop.id and status = 'pending') then
    raise exception 'paiement deja en verification';
  end if;
  if exists (select 1 from public.payment_requests where lower(reference) = lower(trim(p_reference)) and status <> 'rejected') then
    raise exception 'transaction deja utilisee';
  end if;

  v_until := greatest(now(), v_shop.trial_ends_at, coalesce(v_shop.paid_until, now()))
             + case p_plan when 'yearly' then interval '1 year' else interval '1 month' end;

  insert into public.payment_requests (shop_id, plan, amount, reference)
  values (v_shop.id, p_plan, case p_plan when 'yearly' then 25000 else 5000 end, left(trim(p_reference), 80));
  update public.shops set paid_until = v_until where id = v_shop.id;
  return v_until;
end;
$$;
revoke all on function public.request_payment(text, text) from public, anon;
grant execute on function public.request_payment(text, text) to authenticated;

-- Admin : paiement vu dans Wave, on l'inscrit dans l'historique
create or replace function public.admin_approve_payment(p_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_req public.payment_requests;
begin
  update public.payment_requests set status = 'approved', decided_at = now()
  where id = p_id and status = 'pending' returning * into v_req;
  if not found then return; end if;
  insert into public.payments (shop_id, plan, amount, method, reference)
  values (v_req.shop_id, v_req.plan, v_req.amount, 'wave', v_req.reference);
end;
$$;

-- Admin : paiement introuvable dans Wave, on retire la période accordée
create or replace function public.admin_reject_payment(p_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_req public.payment_requests;
begin
  update public.payment_requests set status = 'rejected', decided_at = now()
  where id = p_id and status = 'pending' returning * into v_req;
  if not found then return; end if;
  update public.shops
  set paid_until = paid_until - case v_req.plan when 'yearly' then interval '1 year' else interval '1 month' end
  where id = v_req.shop_id and paid_until is not null;
end;
$$;
revoke all on function public.admin_approve_payment(uuid), public.admin_reject_payment(uuid) from public, anon, authenticated;
grant execute on function public.admin_approve_payment(uuid), public.admin_reject_payment(uuid) to service_role;
grant select on public.payment_requests to service_role;
