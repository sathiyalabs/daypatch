# DayPatch

A cinematic student planner that makes the rest of today work. The public introduction and functional workspace share a calm forest-green, pale-lime and warm-metal identity.

## Start

1. Install project dependencies with the supplied Sites installer or `pnpm install`.
2. Run `pnpm dev` and open the provided URL.
3. Add a commitment, use a student template, or explicitly load the fictional evening.

## Motion and identity

- Original clock-and-task brand mark and matching favicon.
- Locally hosted Manrope variable font, with its license in `public/fonts`.
- A procedural 3D time core: reflective clock face, independently rotating orbital rings and task tiles that gather into an organised arrangement as the visitor scrolls.
- The clock hands follow local time. The displayed tile commitments are illustrative, not the visitor's private tasks.
- Four scroll-directed camera chapters with damped pointer parallax, typography transitions and spring-following call-to-action controls.
- A 3D workflow gallery supporting scroll rotation, horizontal pointer dragging, momentum, arrow buttons, and Left/Right keys. Visible shortcut buttons provide keyboard access to every destination.
- Ambient-motion pause and a reduced-motion reading layout containing all four chapters and all workflow cards.
- Three.js native WebGL when supported, with a software renderer using the same mesh geometry and transforms when unavailable. The preview browser used the software path; native WebGL remains unverified in this environment. Rendering pauses offscreen and while the document is hidden. WebGL context loss switches to software rendering.

## A working product demonstration

The Recovery Lab uses `makePlan`, the same feasibility engine as the workspace. In the fictional evening, 160 work minutes fit around protected dinner and a 20-minute buffer. Losing 45 minutes leaves 115 work minutes and a 45-minute shortfall. Explicitly approving 20 minutes of revision and 15 minutes of presentation work makes the targets fit, while 45 minutes of original work remain outside those targets. Nothing is marked complete or written to the real workspace.

## Workspace features

- Create, edit, search and complete tasks with remaining effort, subject, deadline, priority, splittability, dependency blocking and original assignment URL.
- Deadline-aware scheduling around fixed commitments and reserved buffer time, with overlap checks, invalid-window checks and explanations for work that does not fit.
- Recovery previews, user-approved daily targets, preserved original effort/deadlines, change explanations and session Undo.
- Weekly deadlines and backlog, confirmed focus-session history and cumulative confirmed effort.
- Focus timer with pause/reset and explicit progress logging. A timer ending never completes a task by itself.
- Six editable student task templates, with user-confirmed effort and deadlines.
- Per-task submission checks and notes. Submission confirmation is self-reported; the website never submits files or verifies a school portal.
- Searchable quick actions and tasks through Ctrl K / Command K or the header menu.
- A current-time planning prompt when today's work window starts in the past.
- Configurable reminder lead time, quiet hours, optional sound, in-app inbox and browser notification permission. The app must be open; device suspension may delay alerts.
- Versioned browser-local persistence, validated JSON backups and explicit confirmation before restore/clear. Optional notes/checks/history remain compatible with older version-1 backups. Backup files up to 5 MB can be restored.

## Calendar and AI status

Calendar file import/export and Google Calendar template links work. Exports include reminder alarms, subject to the receiving calendar's notification settings. Timed single-day import supports local floating times, UTC times and a named zone only when it resolves to this device's zone. Recurring and all-day events are not expanded; other named zones are skipped. Verify imported times. Calendar imports are capped at 1 MB and deduplicated by title, date and time.

The visitor reviews and saves Google Calendar template events in Google Calendar. Automatic account sync and Classroom OAuth are not enabled. Existing Google Classroom assignment links can be attached to tasks and opened for actual submission.

AI currently uses a working ChatGPT handoff: copy a structured request, use ChatGPT, import its JSON response, review suggestions and supply unknown effort before adding tasks. No server-side model key has been provisioned or approved. `/api/ai` accurately reports `available:false` and returns a setup-needed error to generation requests. No fake model responses or simulated account connections are presented.

## Storage and limits

Tasks, settings, notes, checklist ticks and confirmed focus history are saved on the current browser and origin. No account sync, cross-device cloud backup, email/SMS delivery, closed-app push or guaranteed on-time submission is claimed. Export a backup before clearing browser data. Use imported calendar alarms for closed-app reminders.

## Verification

- `node node_modules/typescript/bin/tsc --noEmit`
- `node --experimental-strip-types tests/planner.test.ts`
- `node --experimental-strip-types tests/security.test.ts`
- `node --experimental-strip-types tests/reminders.test.ts`
- Production build through the Sites build helper.
- Browser checks of the software-rendered motion journey, chapter navigation, horizontal gallery drag, arrow controls, Recovery Lab calculations, task templates, checklist/note persistence, command search, focus history and reduced-motion mode.

The planner tests cover capacity, time-loss overflow, approved recovery, task immutability, protected commitments/buffer, invalid windows, expired deadlines, unsplittable tasks, blocked/completed work, overlapping fixed commitments, deadline cutoff and calendar round-trips.

## Security review

See [SECURITY-REVIEW.md](SECURITY-REVIEW.md) for fixes, 52 automated scenarios, browser evidence and unresolved dependency findings. This is not a complete security sign-off. Invalid stored data is preserved for recovery; restores and calendar imports enforce bounded, validated structures. The current CSP restricts objects, base URLs, form destinations and framing but does not enforce script-src.
