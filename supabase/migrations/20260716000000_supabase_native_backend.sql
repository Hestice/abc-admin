-- Move authorization and transactional clinic workflows into Supabase.
-- This migration is additive: the Nest API can continue to use the same tables
-- during the frontend cutover, while browser clients use RLS and RPCs directly.

create index if not exists patients_managed_by_id_idx
  on public.patients ("managedById");
create index if not exists exposures_patient_id_idx
  on public.exposures ("patientId");
create index if not exists schedules_exposure_id_idx
  on public.schedules ("exposureId");

-- SECURITY DEFINER helpers are deliberately narrow and use the authenticated
-- Supabase user ID rather than mutable user metadata.
create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and "isActive" = true
      and role::text = 'ADMIN'
  );
$$;

create or replace function public.owns_patient(p_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.patients
    where id = p_patient_id
      and "managedById" = auth.uid()
  );
$$;

create or replace function public.owns_exposure(p_exposure_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.exposures e
    join public.patients p on p.id = e."patientId"
    where e.id = p_exposure_id
      and p."managedById" = auth.uid()
  );
$$;

-- The client never chooses the manager of a patient record.
create or replace function public.assign_patient_manager()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if tg_op = 'INSERT' then
    if new."managedById" is null then
      new."managedById" := auth.uid();
    elsif new."managedById" <> auth.uid() then
      raise exception 'Patients can only be assigned to the current user';
    end if;
  elsif new."managedById" is distinct from old."managedById" then
    raise exception 'Changing a patient manager is not allowed';
  end if;

  return new;
end;
$$;

drop trigger if exists set_patient_manager on public.patients;
create trigger set_patient_manager
before insert or update on public.patients
for each row execute function public.assign_patient_manager();

alter table public.users enable row level security;
alter table public.patients enable row level security;
alter table public.exposures enable row level security;
alter table public.schedules enable row level security;
alter table public.invite_codes enable row level security;

drop policy if exists users_admin_read on public.users;
create policy users_admin_read on public.users
for select to authenticated
using (public.is_active_admin());

drop policy if exists patients_owner_read on public.patients;
drop policy if exists patients_owner_insert on public.patients;
drop policy if exists patients_owner_update on public.patients;
drop policy if exists patients_owner_delete on public.patients;
create policy patients_owner_read on public.patients
for select to authenticated
using ("managedById" = auth.uid());
create policy patients_owner_insert on public.patients
for insert to authenticated
with check ("managedById" = auth.uid());
create policy patients_owner_update on public.patients
for update to authenticated
using ("managedById" = auth.uid())
with check ("managedById" = auth.uid());
create policy patients_owner_delete on public.patients
for delete to authenticated
using ("managedById" = auth.uid());

drop policy if exists exposures_owner_read on public.exposures;
drop policy if exists exposures_owner_insert on public.exposures;
drop policy if exists exposures_owner_update on public.exposures;
drop policy if exists exposures_owner_delete on public.exposures;
create policy exposures_owner_read on public.exposures
for select to authenticated
using (public.owns_patient("patientId"));
create policy exposures_owner_insert on public.exposures
for insert to authenticated
with check (public.owns_patient("patientId"));
create policy exposures_owner_update on public.exposures
for update to authenticated
using (public.owns_patient("patientId"))
with check (public.owns_patient("patientId"));
create policy exposures_owner_delete on public.exposures
for delete to authenticated
using (public.owns_patient("patientId"));

drop policy if exists schedules_owner_read on public.schedules;
drop policy if exists schedules_owner_insert on public.schedules;
drop policy if exists schedules_owner_update on public.schedules;
drop policy if exists schedules_owner_delete on public.schedules;
create policy schedules_owner_read on public.schedules
for select to authenticated
using (public.owns_exposure("exposureId"));
create policy schedules_owner_insert on public.schedules
for insert to authenticated
with check (public.owns_exposure("exposureId"));
create policy schedules_owner_update on public.schedules
for update to authenticated
using (public.owns_exposure("exposureId"))
with check (public.owns_exposure("exposureId"));
create policy schedules_owner_delete on public.schedules
for delete to authenticated
using (public.owns_exposure("exposureId"));

drop policy if exists invite_codes_admin_read on public.invite_codes;
create policy invite_codes_admin_read on public.invite_codes
for select to authenticated
using (public.is_active_admin());

-- Invite workflow: only an existing administrator can create an invite, and a
-- signed-in Supabase user becomes a local administrator only by redeeming one.
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

create or replace function public.validate_invite_code(p_code uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.invite_codes
    where code = p_code
      and is_active = true
      and consumed_by is null
  );
$$;

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

-- Schedule creation and vaccination updates remain transactional, but no longer
-- need a separate application server.
create or replace function public.create_vaccination_schedule(
  p_exposure_id uuid,
  p_start_date date default current_date
)
returns public.schedules
language plpgsql
security definer
set search_path = public
as $$
declare
  v_schedule public.schedules;
begin
  if not public.owns_exposure(p_exposure_id) then
    raise exception 'Exposure not found' using errcode = 'P0002';
  end if;

  insert into public.schedules (
    "exposureId", status, "day0Date", "day3Date", "day7Date", "day28Date"
  )
  values (
    p_exposure_id,
    'in_progress'::public.schedules_status_enum,
    p_start_date,
    p_start_date + 3,
    p_start_date + 7,
    p_start_date + 28
  )
  returning * into v_schedule;

  return v_schedule;
end;
$$;

create or replace function public.toggle_vaccination(
  p_schedule_id uuid,
  p_day integer
)
returns public.schedules
language plpgsql
security definer
set search_path = public
as $$
declare
  v_schedule public.schedules;
  v_animal_alive boolean;
begin
  if p_day not in (0, 3, 7, 28) then
    raise exception 'Unsupported vaccination day';
  end if;

  select s.*
  into v_schedule
  from public.schedules s
  join public.exposures e on e.id = s."exposureId"
  join public.patients p on p.id = e."patientId"
  where s.id = p_schedule_id
    and p."managedById" = auth.uid()
  for update of s;

  if not found then
    raise exception 'Schedule not found' using errcode = 'P0002';
  end if;

  select "animalStatus"::text = 'alive'
  into v_animal_alive
  from public.exposures
  where id = v_schedule."exposureId";

  if p_day = 0 then
    v_schedule."day0Completed" := not v_schedule."day0Completed";
    v_schedule."day0CompletedAt" := case when v_schedule."day0Completed" then now() else null end;
  elsif p_day = 3 then
    v_schedule."day3Completed" := not v_schedule."day3Completed";
    v_schedule."day3CompletedAt" := case when v_schedule."day3Completed" then now() else null end;
  elsif p_day = 7 then
    v_schedule."day7Completed" := not v_schedule."day7Completed";
    v_schedule."day7CompletedAt" := case when v_schedule."day7Completed" then now() else null end;
  else
    v_schedule."day28Completed" := not v_schedule."day28Completed";
    v_schedule."day28CompletedAt" := case when v_schedule."day28Completed" then now() else null end;
  end if;

  v_schedule.status := case
    when v_schedule."day0Completed"
      and v_schedule."day3Completed"
      and v_schedule."day7Completed"
      and (v_animal_alive or v_schedule."day28Completed")
      then 'completed'::public.schedules_status_enum
    else 'in_progress'::public.schedules_status_enum
  end;
  v_schedule."updatedAt" := now();

  update public.schedules
  set status = v_schedule.status,
      "day0Completed" = v_schedule."day0Completed",
      "day3Completed" = v_schedule."day3Completed",
      "day7Completed" = v_schedule."day7Completed",
      "day28Completed" = v_schedule."day28Completed",
      "day0CompletedAt" = v_schedule."day0CompletedAt",
      "day3CompletedAt" = v_schedule."day3CompletedAt",
      "day7CompletedAt" = v_schedule."day7CompletedAt",
      "day28CompletedAt" = v_schedule."day28CompletedAt",
      "updatedAt" = v_schedule."updatedAt"
  where id = p_schedule_id
  returning * into v_schedule;

  return v_schedule;
end;
$$;

-- Read models replace the API's N+1 patient/schedule queries.
create or replace function public.patient_summary(p_patient_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', p.id,
    'firstName', p."firstName",
    'middleName', coalesce(p."middleName", ''),
    'lastName', p."lastName",
    'dateOfBirth', p."dateOfBirth",
    'animalStatus', coalesce(e."animalStatus"::text, 'unknown'),
    'antiTetanusGiven', coalesce(e."antiTetanusGiven", false),
    'dateOfAntiTetanus', e."dateOfAntiTetanus",
    'dateRegistered', p."createdAt",
    'scheduleStatus', s.status,
    'nextVaccinationDate', case
      when s."day0Completed" = false then s."day0Date"
      when s."day3Completed" = false then s."day3Date"
      when s."day7Completed" = false then s."day7Date"
      when s."day28Completed" = false then s."day28Date"
      else null
    end,
    'nextVaccinationDay', case
      when s."day0Completed" = false then 'Day 0'
      when s."day3Completed" = false then 'Day 3'
      when s."day7Completed" = false then 'Day 7'
      when s."day28Completed" = false then 'Day 28'
      else 'Completed'
    end
  )
  from public.patients p
  left join lateral (
    select * from public.exposures
    where "patientId" = p.id
    order by "createdAt" desc
    limit 1
  ) e on true
  left join lateral (
    select s.* from public.schedules s
    join public.exposures se on se.id = s."exposureId"
    where se."patientId" = p.id
    order by (s.status::text = 'in_progress') desc, s."createdAt" desc
    limit 1
  ) s on true
  where p.id = p_patient_id
    and p."managedById" = auth.uid();
$$;

create or replace function public.list_patient_summaries(
  p_page integer default 1,
  p_page_size integer default 10
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with owned_patients as (
    select id, "createdAt"
    from public.patients
    where "managedById" = auth.uid()
  ), paged_patients as (
    select id, "createdAt"
    from owned_patients
    order by "createdAt" desc
    limit greatest(p_page_size, 1)
    offset greatest(p_page - 1, 0) * greatest(p_page_size, 1)
  )
  select jsonb_build_object(
    'patients', coalesce(
      jsonb_agg(public.patient_summary(id) order by "createdAt" desc),
      '[]'::jsonb
    ),
    'total', (select count(*) from owned_patients)
  )
  from paged_patients;
$$;

revoke all on function public.is_active_admin() from public;
revoke all on function public.owns_patient(uuid) from public;
revoke all on function public.owns_exposure(uuid) from public;
revoke all on function public.assign_patient_manager() from public;
revoke all on function public.create_invite_code() from public;
revoke all on function public.redeem_invite_code(uuid) from public;
revoke all on function public.create_vaccination_schedule(uuid, date) from public;
revoke all on function public.toggle_vaccination(uuid, integer) from public;
revoke all on function public.patient_summary(uuid) from public;
revoke all on function public.list_patient_summaries(integer, integer) from public;

grant execute on function public.create_invite_code() to authenticated;
grant execute on function public.redeem_invite_code(uuid) to authenticated;
grant execute on function public.create_vaccination_schedule(uuid, date) to authenticated;
grant execute on function public.toggle_vaccination(uuid, integer) to authenticated;
grant execute on function public.patient_summary(uuid) to authenticated;
grant execute on function public.list_patient_summaries(integer, integer) to authenticated;
grant execute on function public.validate_invite_code(uuid) to anon, authenticated;
