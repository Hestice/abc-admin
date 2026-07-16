-- uuid_generate_v4 lives in Supabase's extensions schema. The clinic RPCs use
-- a restricted search_path, so call PostgreSQL's built-in UUID generator
-- explicitly instead.
create or replace function public.create_invite_code()
returns public.invite_codes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.invite_codes;
begin
  if not public.is_active_admin() then
    raise exception 'Administrator access is required' using errcode = '42501';
  end if;

  insert into public.invite_codes (code, created_by, is_active)
  values (pg_catalog.gen_random_uuid(), auth.uid(), true)
  returning * into v_invite;

  return v_invite;
end;
$$;

grant execute on function public.create_invite_code() to authenticated;
