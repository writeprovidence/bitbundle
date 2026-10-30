-- Bitbundle — Initial Schema
-- Run this in the Supabase SQL editor or via `supabase db push`

-- ─────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────
-- Users table
-- Stores wallet-connected users created via SIWE.
-- ─────────────────────────────────────────────────────────
create table if not exists public.users (
  id              uuid primary key default gen_random_uuid(),
  wallet_address  text not null unique,
  email           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.users enable row level security;

-- Users can only read their own row
create policy "users_select_own" on public.users
  for select using (true);  -- service role reads all; anon gets nothing

-- ─────────────────────────────────────────────────────────
-- Orders table
-- One row per airtime purchase, linked to a user.
-- ─────────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  network         text not null check (network in ('mtn', 'airtel', 'glo', '9mobile')),
  phone_number    text not null,
  amount_ngn      numeric(12, 2) not null check (amount_ngn > 0),
  amount_usdt     numeric(18, 6) not null check (amount_usdt > 0),
  tx_hash         text not null unique,
  status          text not null default 'pending'
                    check (status in ('pending', 'processing', 'completed', 'failed')),
  supplier_ref    text,
  failure_reason  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Users can only see their own orders (used if you ever use anon key on client)
create policy "orders_select_own" on public.orders
  for select using (
    user_id = (
      select id from public.users
      where wallet_address = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- ─────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────
create index if not exists orders_user_id_idx         on public.orders(user_id);
create index if not exists orders_status_idx          on public.orders(status);
create index if not exists orders_created_at_idx      on public.orders(created_at desc);
create index if not exists users_wallet_address_idx   on public.users(wallet_address);

-- ─────────────────────────────────────────────────────────
-- updated_at trigger
-- ─────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
