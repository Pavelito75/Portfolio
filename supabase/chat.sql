-- Chat du portfolio : exécutez ce script dans le SQL Editor de Supabase
-- Ce script est idempotent : il peut être réexécuté plusieurs fois sans erreur.

create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name       text check (name is null or char_length(name) between 1 and 30),
  country    text check (country is null or country ~ '^[A-Z]{2}$'),
  content    text not null default '',
  gif_url    text check (gif_url is null or gif_url ~ '^https://media[0-9]?\.giphy\.com/'),
  constraint messages_content_check
    check (char_length(content) <= 500 and (char_length(btrim(content)) >= 1 or gif_url is not null))
);

-- Droits d'accès pour les rôles anon et authenticated
grant usage on schema public to anon, authenticated;
grant select, insert on public.messages to anon, authenticated;

-- RLS (Row Level Security) : lecture et écriture publiques (anon)
alter table public.messages enable row level security;

drop policy if exists "messages_read" on public.messages;
create policy "messages_read" on public.messages
  for select to anon, authenticated using (true);

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert to anon, authenticated with check (true);

-- Sécurité anti-spam : maximum 15 messages par minute
create or replace function public.messages_rate_limit()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.messages where created_at > now() - interval '1 minute') >= 15 then
    raise exception 'rate limit';
  end if;
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists messages_rate_limit on public.messages;
create trigger messages_rate_limit before insert on public.messages
  for each row execute function public.messages_rate_limit();

-- Activation du temps réel (Supabase Realtime) uniquement si pas déjà présent
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
      and schemaname = 'public' 
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
