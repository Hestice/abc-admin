-- The authenticated request role cannot read auth.users. Supabase includes the
-- verified email in the JWT, so use that claim while redeeming an invite.
create or replace function public.redeem_invite_code(p_code uuid)
returns public.invite_codes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.invite_codes;
  v_email text;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required' using errcode = '28000';
  end if;

  select * into v_invite
  from public.invite_codes
  where code = p_code
  for update;

  if not found then
    raise exception 'Invite code not found' using errcode = 'P0002';
  end if;
  if not v_invite.is_active or v_invite.consumed_by is not null then
    raise exception 'Invite code is no longer valid' using errcode = '23505';
  end if;

  v_email := auth.jwt() ->> 'email';
  if v_email is null then
    raise exception 'Authenticated user has no email address';
  end if;

  insert into public.users (id, email, role, "isActive")
  values (auth.uid(), v_email, 'ADMIN'::public.users_role_enum, true)
  on conflict (id) do nothing;

  update public.invite_codes
  set consumed_by = auth.uid(),
      consumed_at = now(),
      is_active = false
  where id = v_invite.id
  returning * into v_invite;

  return v_invite;
end;
$$;

grant execute on function public.redeem_invite_code(uuid) to authenticated;
