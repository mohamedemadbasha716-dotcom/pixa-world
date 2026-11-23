# English source map

Existing routes and language files are preserved. No cosmetic relocation was applied.

| Location | Purpose |
| --- | --- |
| `src/app/page.tsx` | Existing language-book shelf; verified owner English target only |
| `src/app/english-adventure/page.tsx` | Owner session bootstrap, temporary hero/name setup and game iframe |
| `src/app/login/page.tsx` | Existing login, fixed English-preview return option |
| `src/app/api/english-adventure/owner/route.ts` | Read-only server verification for owner shelf entry |
| `src/app/api/english-adventure/bootstrap/route.ts` | Authenticated HttpOnly session cookie; owner no-save branch |
| `src/app/api/english-adventure/[resource]/route.ts` | Private lesson/UI resources; five-map routing |
| `src/app/api/english-adventure/assets/[...file]/route.ts` | Authenticated bundled image/audio delivery |
| `src/lib/englishAdventure/curriculum.server.js` | First-map original language content |
| `src/lib/englishAdventure/alphabet.draft.server.js` | Alphabet chapters inside lesson one |
| `src/lib/englishAdventure/map-two.draft.server.js` | Second-map original content |
| `src/lib/englishAdventure/map-three.draft.server.js` | Garden content |
| `src/lib/englishAdventure/map-four.draft.server.js` | Town content |
| `src/lib/englishAdventure/map-five.draft.server.js` | Festival content |
| `src/lib/englishAdventure/mapOne.server.ts`, `mapTwo.server.ts`, `advanced.server.ts` | Content/UI assembly, preserving existing interaction modules |
| `src/lib/englishAdventure/practice.server.ts` | Owner-only in-memory attempts, no progress/reward writes |
| `src/lib/englishAdventure/navigation.server.ts` | Map arrows/dropdown and reversible temporary lesson-stage navigation |
| `src/lib/englishAdventure/mapTwo/*.client.js` | Interaction, audio and optional speech lifecycle logic |
| `1-english-adventure-resources.json` | Base UI and bundled base resources |
| `2-english-adventure-mechanics.json` | Packaged interaction source |
| `3-english-adventure-art.json` | Shared illustrated image bytes |
| `4-english-adventure-audio.json` | Exact bundled recording map, carriers and bytes |
| `5-2-*`, `6-2-*`, `7-2-*` JSON | Split second-map resource bundle, all required |
| `docs/english-audio/` | Recording provenance, licenses and final manifest |
| `supabase/proposals/` | Parked proposed migrations, not applied by this content update |

Do not manually move or delete numbered bundles without updating their imports. A future packaging cleanup can be reviewed separately. No student database changes are part of this update. New French/Italian work remains separate and unfinished.
