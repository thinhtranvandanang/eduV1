/* 
  Run these commands in your Supabase SQL Editor:

  -- Create profiles table
  create table profiles (
    id uuid primary key default auth.uid(),
    name text,
    goal text,
    learning_time text,
    level text,
    updated_at timestamp with time zone default now()
  );

  -- Create roadmaps table
  create table roadmaps (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade,
    goal text,
    tasks jsonb,
    progress integer default 0,
    updated_at timestamp with time zone default now()
  );

  -- Enable Row Level Security (RLS)
  alter table profiles enable row level security;
  alter table roadmaps enable row level security;

  -- Create policies
  create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
  create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
  create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

  create policy "Users can view own roadmap" on roadmaps for select using (auth.uid() = user_id);
  create policy "Users can update own roadmap" on roadmaps for update using (auth.uid() = user_id);
  create policy "Users can insert own roadmap" on roadmaps for insert with check (auth.uid() = user_id);
*/
