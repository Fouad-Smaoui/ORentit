/*
  Auto-create a profiles row whenever a new auth.users row is inserted.

  Without this, signing up only creates the auth.users record -- there is
  no profiles row to update, so editing your profile after signup silently
  does nothing (UPDATE on a non-existent row affects 0 rows, no error).
  SECURITY DEFINER lets this run regardless of whether the new user has an
  active session yet (e.g. email confirmation pending), since normal RLS
  would otherwise block the insert.

  profiles.username is UNIQUE, and this trigger runs inside the same
  transaction as the auth.users insert -- a naive insert that hits a
  username collision would fail the trigger and roll back signup itself.
  Falls back to a suffixed username on collision instead.
*/

create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
begin
  base_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));

  begin
    insert into public.profiles (id, username, full_name, avatar_url)
    values (new.id, base_username, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  exception when unique_violation then
    insert into public.profiles (id, username, full_name, avatar_url)
    values (new.id, base_username || '_' || substr(new.id::text, 1, 6), new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
    on conflict (id) do nothing;
  end;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
