# DayPatch verification and security review

Reviewed 5 November 2026. This is an application-level review and regression pass, not an independent penetration-test certification. The application is not fully security-cleared.

## Results

| Check | Result |
| --- | --- |
| Planner regression suite | 12 scenarios passed |
| Security and import regression suite | 30 scenarios passed |
| Reminder timing suite | 10 scenarios passed |
| TypeScript | Passed |
| Production build | Enforced in the publication workflow |
| Production dependency scan | 0 reported vulnerabilities |
| Full dependency scan | 3 findings remain: 1 high, 2 moderate, all marked development dependencies by the package manager |

A production-only dependency scan is not proof that every bundled module is safe. The build uses Vinext from development dependencies. Its affected image-size and Satori dependencies were patched as part of this review, along with React Server Components and the Next package. Build-time dependencies remain part of the supply-chain risk.

## Fixed in this revision

- Backup validation now checks real dates/times, integer effort bounds, remaining effort, required booleans, string/collection limits, unsafe URLs, duplicate/reserved IDs, null entries, and checklist/note/session shapes.
- Invalid saved browser data is preserved instead of being immediately replaced by an empty workspace. Saving stays blocked until an explicit restore or clear. A recovery download is offered.
- Assignment links permit HTTP(S), reject embedded credentials/control characters and executable schemes, and open with noopener/noreferrer.
- Calendar exports escape carriage returns/newlines and encode event IDs to prevent injected iCalendar properties or events. Long UTF-8 lines fold at 75 octets.
- Calendar import rejects malformed timestamps, incompatible zones, all-day/recurring entries and excessive event counts. Imports deduplicate within a file and against existing commitments, use independent IDs, and enforce the workspace capacity without silent truncation.
- AI JSON suggestions have bounded structures/text and do not convert unknown effort into invented estimates. The unavailable live-AI endpoint returns 503 without doing model work.
- Workspace replacement, undo, deletion of the focused task and task completion reset stale focus state. Removing a task also cleans its targets, checks and notes.
- The Worker adds no-sniff, no-referrer, camera/microphone/location restrictions, same-origin framing and HTTPS HSTS headers. Its CSP restricts objects, base URLs, form destinations and framing, and preserves any existing CSP. It does **not** enforce script-src: nonce integration for streamed hydration scripts remains future work. Header construction is regression-tested; live edge header delivery was not independently verified because command-line requests to the public origin were blocked in this environment.
- Updated framework and compatible transitive dependencies; retained the seven-day package-release-age protection. Selected Next 16.4.3, React/React DOM/React Server DOM 19.2.8, Vite 8.3.5 and Zod 4.6.6.
- Fixed Settings overflow at a 320px iframe viewport. Confirmed document scroll width equals client width after the repair.

## Browser evidence from this review

- Public site: opens without login; unsafe assignment URL rejected; HTML-like task title rendered as text with no injected image or alert; checklist survived reload.
- Updated preview at 320px/390px: planner layout, mobile navigation and Settings; test reminder reached inbox; malformed restore left the application usable; valid restore recovered task/check data; focus start/pause locked and released session controls; explicit 5-minute progress confirmation reduced effort from 25 to 20 and added history; quick-action search opened Week; backlog remained visible; reduced motion exposed all four chapters and workflow cards.
- Earlier browser passes covered templates, task edit/delete, recovery, gallery drag/arrows, calendar handoff and notes. These are prior observations, not a claim that every combination was rerun here.

## Remaining dependency findings

All are currently marked development-only in the lockfile audit. They are not dismissed as harmless and must be resolved before a clean security sign-off. Some need upstream/tooling migrations rather than forcing a major-version override into an incompatible consumer.

| Component | Findings | Affected use |
| --- | --- | --- |
| esbuild 0.18.20 | 1 moderate | Legacy drizzle-kit loader tooling |
| Zod 3.25.76 | 1 high | ESLint React Hooks validation tooling |
| minimatch 10.2.5 | 1 moderate | TypeScript/ESLint tooling |

The full audit reports 3 findings total. The direct Zod dependency used by the app is patched; the older nested tooling copy remains.

## Boundaries and unverified behavior

- No independent penetration test, load/abuse test, real-device Safari/Android/iOS pass, or native GPU WebGL performance test was completed.
- Browser/OS notification delivery requires permission and an open app. Quiet-hour and timing logic is tested; operating-system delivery, device suspension and calendar-provider alarm behavior are not guaranteed.
- Live in-app AI, automatic Google Calendar/Classroom account sync, closed-app push, email/SMS and automatic submission are not implemented. Their authentication/authorization flows cannot be marked tested.
- Data is stored in browser localStorage, not encrypted or separated by authenticated local users. Anyone with access to that browser profile can access the saved workspace. Backups contain readable personal task data.
- Backups, calendars and AI responses are untrusted input. Passing these tests does not guarantee that all vulnerabilities have been found.

## Repeat checks

```sh
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types tests/planner.test.ts
node --experimental-strip-types tests/security.test.ts
node --experimental-strip-types tests/reminders.test.ts
pnpm audit --prod
pnpm audit
```

Publish only after the production build passes, with the temporary responsive-QA harness removed.
