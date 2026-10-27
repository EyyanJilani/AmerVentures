-- Amer Venture website: client reviews table.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 40),
  rating      smallint not null check (rating between 1 and 5),
  service     text,
  text        text not null check (char_length(text) between 10 and 600),
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
create index if not exists reviews_ip_hash_idx on public.reviews (ip_hash, created_at);

-- Lock the table: only the website's server function (service role key) can read or write.
alter table public.reviews enable row level security;
