# Supabase-native backend

The application database already runs on Supabase. The migration in this folder
moves API authorization into Row Level Security (RLS) and moves transactional
workflows into Postgres RPC functions:

- `create_invite_code` and `redeem_invite_code`
- `create_vaccination_schedule`
- `toggle_vaccination`
- `patient_summary`
- `list_patient_summaries`

The web app calls table queries and these RPC functions through
`@supabase/supabase-js`. Configure `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` for the web deployment before enabling the
cutover. Keep the Nest API deployed until the migration is applied and the
Supabase-backed frontend has been validated.

## Deployment

Do not apply this migration from the Supabase Dashboard. Authenticate and link
the CLI to the existing project, inspect the pending change, then push it:

```sh
supabase login
supabase link
supabase db push --dry-run
supabase db push
```

The RLS policies change the access model for browser clients. Validate with a
non-production Supabase project before applying it to production.
