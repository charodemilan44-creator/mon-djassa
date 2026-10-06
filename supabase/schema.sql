-- =====================================================================
-- MonDjassa : schéma Supabase (à coller dans SQL Editor > New query > Run)
-- Le script peut être relancé : il ne recrée pas ce qui existe déjà.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

-- Une boutique par vendeuse
create table if not exists public.shops (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null unique references auth.users (id) on delete cascade,
  slug                 text not null unique
                         check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 40),
  name                 text not null check (char_length(name) between 2 and 60),
  whatsapp             text not null check (whatsapp ~ '^[0-9]{8,15}$'),
  description          text check (char_length(description) <= 500),
  logo_url             text,
  banner_url           text,
  color                text not null default '#F77F00' check (color ~ '^#[0-9a-fA-F]{6}$'),
  hours                text check (char_length(hours) <= 120),
  accepts_cash         boolean not null default true,
  accepts_wave         boolean not null default true,
  accepts_orange_money boolean not null default true,
  -- Essai gratuit de 30 jours, puis abonnement (paid_until)
  trial_ends_at        timestamptz not null default (now() + interval '30 days'),
  paid_until           timestamptz,
  created_at           timestamptz not null default now()
);

create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  shop_id    uuid not null references public.shops (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 40),
  position   int not null default 0,
  created_at timestamptz not null default now(),
  unique (shop_id, name)
);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references public.shops (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name        text not null check (char_length(name) between 1 and 80),
  description text check (char_length(description) <= 600),
  price       integer not null check (price >= 0),          -- en FCFA
  image_url   text,
  in_stock    boolean not null default true,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists products_shop_idx on public.products (shop_id, created_at desc);

-- Communes livrées et frais de livraison
create table if not exists public.delivery_zones (
  id         uuid primary key default gen_random_uuid(),
  shop_id    uuid not null references public.shops (id) on delete cascade,
  commune    text not null check (char_length(commune) between 1 and 60),
  fee        integer not null default 0 check (fee >= 0),    -- en FCFA
  created_at timestamptz not null default now(),
  unique (shop_id, commune)
);

-- Statistiques simples : visites et clics « Commander »
create table if not exists public.shop_events (
  id         bigint generated always as identity primary key,
  shop_id    uuid not null references public.shops (id) on delete cascade,
  type       text not null check (type in ('visit', 'order_click')),
  created_at timestamptz not null default now()
);
create index if not exists shop_events_shop_idx on public.shop_events (shop_id, type, created_at desc);

-- Historique des paiements d'abonnement (Wave / Orange Money, enregistré par l'équipe pour l'instant)
create table if not exists public.payments (
  id         uuid primary key default gen_random_uuid(),
  shop_id    uuid not null references public.shops (id) on delete cascade,
  plan       text not null check (plan in ('monthly', 'yearly')),
  amount     integer not null check (amount >= 0),
  method     text not null check (method in ('wave', 'orange_money', 'autre')),
  reference  text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Fonctions d'aide
-- ---------------------------------------------------------------------

-- Boutique ouverte = essai en cours ou abonnement payé
create or replace function public.shop_is_open(p_shop_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.shops s
    where s.id = p_shop_id
      and (s.trial_ends_at > now() or coalesce(s.paid_until > now(), false))
  );
$$;

create or replace function public.is_shop_owner(p_shop_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.shops s where s.id = p_shop_id and s.owner_id = auth.uid());
$$;

-- Appelée par la page publique (sans compte) pour compter visites et clics
create or replace function public.log_shop_event(p_shop_id uuid, p_type text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if p_type not in ('visit', 'order_click') then
    raise exception 'type invalide';
  end if;
  if public.shop_is_open(p_shop_id) then
    insert into public.shop_events (shop_id, type) values (p_shop_id, p_type);
  end if;
end;
$$;

-- À lancer par l'équipe dans le SQL Editor quand un paiement Wave/OM est reçu :
--   select public.admin_record_payment('nom-de-la-boutique', 'monthly', 'wave', 'ref-transaction');
create or replace function public.admin_record_payment(p_slug text, p_plan text, p_method text, p_reference text default null)
returns timestamptz
language plpgsql security definer set search_path = public
as $$
declare
  v_shop public.shops;
  v_start timestamptz;
  v_until timestamptz;
begin
  select * into v_shop from public.shops where slug = p_slug;
  if not found then raise exception 'boutique % introuvable', p_slug; end if;

  -- L'abonnement démarre à la fin de l'essai ou de la période déjà payée, si elle n'est pas finie
  v_start := greatest(now(), v_shop.trial_ends_at, coalesce(v_shop.paid_until, now()));
  v_until := v_start + case p_plan when 'yearly' then interval '1 year' else interval '1 month' end;

  insert into public.payments (shop_id, plan, amount, method, reference)
  values (v_shop.id, p_plan, case p_plan when 'yearly' then 25000 else 5000 end, p_method, p_reference);

  update public.shops set paid_until = v_until where id = v_shop.id;
  return v_until;
end;
$$;

revoke all on function public.admin_record_payment(text, text, text, text) from public, anon, authenticated;
revoke all on function public.log_shop_event(uuid, text) from public;
grant execute on function public.log_shop_event(uuid, text) to anon, authenticated;
grant execute on function public.shop_is_open(uuid) to anon, authenticated;
grant execute on function public.is_shop_owner(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Sécurité (Row Level Security)
-- ---------------------------------------------------------------------
alter table public.shops          enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.shop_events    enable row level security;
alter table public.payments       enable row level security;

-- La vendeuse ne peut pas modifier elle-même son essai ni son abonnement
revoke insert, update on public.shops from anon, authenticated;
grant insert (owner_id, slug, name, whatsapp) on public.shops to authenticated;
grant update (slug, name, whatsapp, description, logo_url, banner_url, color, hours,
              accepts_cash, accepts_wave, accepts_orange_money) on public.shops to authenticated;
revoke insert, update, delete on public.shop_events, public.payments from anon, authenticated;

drop policy if exists "shops: lecture" on public.shops;
create policy "shops: lecture" on public.shops for select
  using (owner_id = auth.uid() or trial_ends_at > now() or coalesce(paid_until > now(), false));
drop policy if exists "shops: création" on public.shops;
create policy "shops: création" on public.shops for insert to authenticated
  with check (owner_id = auth.uid());
drop policy if exists "shops: modification" on public.shops;
create policy "shops: modification" on public.shops for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Catégories, produits, zones : lecture publique si la boutique est ouverte, écriture par la propriétaire
do $$
declare t text;
begin
  foreach t in array array['categories', 'products', 'delivery_zones'] loop
    execute format('drop policy if exists "%1$s: lecture" on public.%1$I', t);
    execute format('create policy "%1$s: lecture" on public.%1$I for select using (public.is_shop_owner(shop_id) or public.shop_is_open(shop_id))', t);
    execute format('drop policy if exists "%1$s: écriture" on public.%1$I', t);
    execute format('create policy "%1$s: écriture" on public.%1$I for all to authenticated using (public.is_shop_owner(shop_id)) with check (public.is_shop_owner(shop_id))', t);
  end loop;
end $$;

drop policy if exists "shop_events: lecture" on public.shop_events;
create policy "shop_events: lecture" on public.shop_events for select to authenticated
  using (public.is_shop_owner(shop_id));
drop policy if exists "payments: lecture" on public.payments;
create policy "payments: lecture" on public.payments for select to authenticated
  using (public.is_shop_owner(shop_id));

-- ---------------------------------------------------------------------
-- Stockage des photos (logo, bannière, produits)
-- Chaque vendeuse écrit uniquement dans son dossier : <user_id>/...
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('shop-images', 'shop-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "shop-images: envoi" on storage.objects;
create policy "shop-images: envoi" on storage.objects for insert to authenticated
  with check (bucket_id = 'shop-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "shop-images: remplacement" on storage.objects;
create policy "shop-images: remplacement" on storage.objects for update to authenticated
  using (bucket_id = 'shop-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "shop-images: suppression" on storage.objects;
create policy "shop-images: suppression" on storage.objects for delete to authenticated
  using (bucket_id = 'shop-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------
-- Paiement Wave déclaré par la vendeuse, vérifié par l admin (aussi dans migrations/002)
-- ---------------------------------------------------------------------

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
