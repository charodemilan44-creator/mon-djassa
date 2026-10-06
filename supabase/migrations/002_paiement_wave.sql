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

-- La vendeuse déclare son paiement Wave (au plus 3 demandes en attente)
create or replace function public.request_payment(p_plan text, p_reference text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_shop_id uuid;
  v_id uuid;
begin
  select id into v_shop_id from public.shops where owner_id = auth.uid();
  if v_shop_id is null then raise exception 'boutique introuvable'; end if;
  if p_plan not in ('monthly', 'yearly') then raise exception 'formule inconnue'; end if;
  if (select count(*) from public.payment_requests where shop_id = v_shop_id and status = 'pending') >= 3 then
    raise exception 'trop de demandes en attente';
  end if;

  insert into public.payment_requests (shop_id, plan, amount, reference)
  values (v_shop_id, p_plan, case p_plan when 'yearly' then 25000 else 5000 end, left(trim(p_reference), 80))
  returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.request_payment(text, text) from public, anon;
grant execute on function public.request_payment(text, text) to authenticated;

-- Le site (côté serveur, clé secrète) valide le paiement depuis la page admin
grant execute on function public.admin_record_payment(text, text, text, text) to service_role;
grant select, update on public.payment_requests to service_role;
