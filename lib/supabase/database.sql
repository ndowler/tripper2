-- Tripper Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
-- We'll use auth.users for authentication and this for additional profile data
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  default_currency text default 'USD',
  timezone text default 'UTC',
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'team')),
  subscription_status text default 'active' check (subscription_status in ('active', 'cancelled', 'past_due', 'trialing')),
  subscription_period_end timestamp with time zone,
  stripe_customer_id text unique,
  has_completed_onboarding boolean default false not null,
  onboarding_completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trips table
create table public.trips (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  destination text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  travelers integer default 1,
  currency text default 'USD',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Days table
create table public.days (
  id text primary key,
  trip_id text references public.trips on delete cascade not null,
  name text not null,
  date timestamp with time zone,
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Cards table
create table public.cards (
  id text primary key,
  trip_id text references public.trips on delete cascade not null,
  day_id text references public.days on delete cascade,
  type text not null check (type in ('activity', 'meal', 'restaurant', 'transit', 'flight', 'hotel', 'shopping', 'entertainment', 'note')),
  title text not null,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  location jsonb,
  cost jsonb,
  status text default 'todo' check (status in ('todo', 'tentative', 'confirmed')),
  tags text[] default array[]::text[],
  links text[] default array[]::text[],
  notes text,
  "order" integer not null,
  booking_status text check (booking_status in ('not_needed', 'pending', 'booked', 'confirmed')),
  booking_platform text,
  booking_reference text,
  booking_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User preferences table
create table public.user_preferences (
  user_id uuid references auth.users on delete cascade primary key,
  vibes jsonb,
  view_preferences jsonb,
  notification_preferences jsonb default '{"email": true, "push": false}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index trips_user_id_idx on public.trips(user_id);
create index trips_updated_at_idx on public.trips(updated_at desc);
create index days_trip_id_idx on public.days(trip_id);
create index days_order_idx on public.days("order");
create index cards_trip_id_idx on public.cards(trip_id);
create index cards_day_id_idx on public.cards(day_id);
create index cards_order_idx on public.cards("order");

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.user_profiles enable row level security;
alter table public.trips enable row level security;
alter table public.days enable row level security;
alter table public.cards enable row level security;
alter table public.user_preferences enable row level security;

-- User Profiles policies
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Trips policies
create policy "Users can view own trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "Users can insert own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update own trips"
  on public.trips for update
  using (auth.uid() = user_id);

create policy "Users can delete own trips"
  on public.trips for delete
  using (auth.uid() = user_id);

-- Days policies (access via trip ownership)
create policy "Users can view days of own trips"
  on public.days for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = days.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can insert days to own trips"
  on public.days for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = days.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can update days of own trips"
  on public.days for update
  using (
    exists (
      select 1 from public.trips
      where trips.id = days.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can delete days from own trips"
  on public.days for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = days.trip_id
      and trips.user_id = auth.uid()
    )
  );

-- Cards policies (access via trip ownership)
create policy "Users can view cards of own trips"
  on public.cards for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = cards.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can insert cards to own trips"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = cards.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can update cards of own trips"
  on public.cards for update
  using (
    exists (
      select 1 from public.trips
      where trips.id = cards.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can delete cards from own trips"
  on public.cards for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = cards.trip_id
      and trips.user_id = auth.uid()
    )
  );

-- User Preferences policies
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

-- Functions to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger on_user_profiles_updated
  before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_trips_updated
  before update on public.trips
  for each row execute procedure public.handle_updated_at();

create trigger on_days_updated
  before update on public.days
  for each row execute procedure public.handle_updated_at();

create trigger on_cards_updated
  before update on public.cards
  for each row execute procedure public.handle_updated_at();

create trigger on_user_preferences_updated
  before update on public.user_preferences
  for each row execute procedure public.handle_updated_at();

-- Function to automatically create user_profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  insert into public.user_preferences (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to delete user account and all associated data
create or replace function public.delete_user()
returns void as $$
begin
  -- Delete from auth.users (this will cascade to all other tables via RLS)
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.user_profiles to anon, authenticated;
grant all on public.trips to anon, authenticated;
grant all on public.days to anon, authenticated;
grant all on public.cards to anon, authenticated;
grant all on public.user_preferences to anon, authenticated;

