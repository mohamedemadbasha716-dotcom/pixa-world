# English adventure integration boundary

Additive `/english-adventure`, existing English/German/Spanish routes untouched.
First map: hello, numbers, family, colours, body with ten-item review inside lesson five.

## Implemented locally, not yet deployed

- Confirmed nonanonymous existing Supabase auth via server getUser(token).
- Registered-account entry, sequential unlock, separately verified owner preview.
- HTTP-only same-site feature cookie; API writes require same host Origin and JSON.
- Protected game, original assets/audio and lesson payloads, no public answer-key module.
- Server answer grading, attempt ownership, expected-revision concurrency, atomic successful progress save.
- Namespaced new tables with own-user read-only RLS, server-only attempts/RPC.
- Explicit failed-save state; no unlock from localStorage or client-supplied scores.

Deployment requires approved additive migration, server-only service-role credential and shared pixa_is_owner() trusted owner RPC with shared-account repair. No role grants or shared policy changes in this feature. Draft SQL: supabase/proposals/english-adventure.sql. Exact coordination: english-boundary.md.

## Verification completed

Production build/typecheck; isolated auth/storage full50-activity integrated playthrough, widths320/390/1280; anonymous, sequence, cross-account attempt and CSRF denials; persisted completion on reload. Screenshots inspected. Isolated PostgreSQL/PGlite migration/RLS/RPC rehearsal passes own-user reads, all direct client-write/attempt/RPC denials, atomic save, revision replay and wrong-account rejection. These are local tests, not Supabase/deployed acceptance.

Local QA entry scripts: qa/english-adventure/. Integration test starts Next plus a fake provider on loopback only. Database test uses an ephemeral PGlite dependency outside application dependencies. Do not run tests with production credentials. Protected resources bundled in server-only root JSON and imported only through a server-only module. Original UI/art/audio bytes retained in resource bundle.

Outstanding acceptance: shared-owner source handshake; deployed config/migration; real test-account sessions and persistence; production packaged resources, logout/account-switch and actual audio; user-ready first-map access link. Do not call complete before those pass.
