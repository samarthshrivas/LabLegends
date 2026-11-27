# Security, Privacy and Student Safety

The platform is intended for school-age learners. Build privacy and safety into the MVP.

- Collect only the minimum data needed for accounts, learning progress and classroom assignments.
- Use pseudonymous display names in leaderboards and classroom views.
- Do not collect phone numbers, home addresses, precise location, personal email or birth date unless a separately reviewed requirement makes it essential.
- Do not include inventor personal data from the disclosure in source code, seeds, screenshots or demo accounts.
- Enforce role and class boundaries with Supabase RLS and server-side authorization.
- Store secrets only in server environment variables.
- Validate and rate-limit authentication, join-code and submission endpoints.
- Avoid public student profiles, direct messaging and user-generated public content in the MVP.
- Provide teacher-controlled assignment and visibility.
- Use HTTPS in deployment and review data retention/deletion requirements before a real pilot.
- Add a clear privacy notice and guardian/school consent workflow before onboarding real minors.
- Do not describe legal compliance as guaranteed; obtain institutional/legal review for the actual deployment jurisdiction.

## Current status — 2026-11-27
- [x] Synthetic demo users and data only; no inventor personal data in code, seeds or docs.
- [x] `.env.example` contains placeholders only; no secrets are present in client code.
- [x] Private student/teacher/lab/results/API routes are excluded from the service-worker cache.
- [x] Demo login display name and Supabase environment config are validated with Zod.
- [x] Supabase RLS, column-level write grants and append-only XP ledger schema are implemented.
- [x] Browser code uses only the Supabase publishable key; no service-role secret is shipped to the client.
- [x] Deployed test environment uses HTTPS on a dedicated Vercel project with Vercel Authentication enabled; no other Vercel projects were touched.
- [ ] Auth screens/session-aware routing, endpoint rate limiting, class-join RPC, privacy notice, guardian/school consent workflow and formal HTTPS deployment review are not implemented yet.
- [ ] Automated RLS authorization tests and a formal security review are still pending.
