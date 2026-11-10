# DayPatch

DayPatch is a student planner for the evenings that go off schedule. Give it your tasks, deadlines, fixed commitments and stop time. It lays out the work that fits and tells you how many minutes still need a home.

[Open the live planner](https://daypatch-student-orbit.sathiyalabs2606.chatgpt.site/) · [Read the scheduling engine](lib/planner.ts) · [Browse the tests](tests)

## Try one evening

Open the **Recovery Lab** and select **45m** under *Time lost*. The example starts with a C assignment, maths revision and French slides. Dinner occupies 7–8 pm and the planner reserves a 20-minute buffer before the 10 pm stop.

| Try this | Study time available | What the planner shows |
| --- | ---: | --- |
| Start at 6 pm | 160 min | The 80-minute assignment, 50 minutes of revision and 30 minutes of slides all fit. |
| Start at 6:45 pm | 115 min | Keeping all three targets leaves 45 minutes unscheduled. |
| Select **Approve smaller study targets** | 115 min | The assignment keeps its 80 minutes. Revision gets 20 and slides get 15. The remaining 45 minutes of original work stay visible. |

The lab uses the same planner as the personal workspace. Trying the example leaves your own tasks alone. At the time of this GitHub export, the live demo ran an earlier source revision. The repository includes the subsequent validation and reminder fixes.

## Run locally

Use Node.js 24 and pnpm 11.25.0. The planner works without an account or API key.

```sh
git clone https://github.com/sathiyalabs/daypatch.git
cd daypatch
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed in the terminal. A fresh workspace starts in your browser. Add a task with an effort estimate, reserve a commitment, then open the daily plan.

## How the planner works

The engine takes the free intervals between commitments, reserves the buffer, and considers unfinished tasks in deadline order, using priority to break ties. Splittable work can use several intervals. A task marked unsplittable needs one continuous slot before its deadline. Blocked work and leftover minutes each receive a reason. Approving a smaller daily target preserves the task’s original effort and due date.

| File | Where to look |
| --- | --- |
| [Planner](lib/planner.ts) | Scheduling, overflow reasons, sample tasks and calendar import/export |
| [Recovery Lab](components/recovery-lab.tsx) | Interactive example that calls the scheduling engine |
| [Workspace](lib/workspace.ts) | Backup validation, calendar deduplication and parsing AI suggestions |
| [Reminders](lib/reminders.ts) | Lead times, quiet hours, task starts and approaching deadlines |
| [App](app/page.tsx) | Task editing, focus sessions, weekly view, submission checklist and undo |

## Using your own data

- **Planning and focus.** Add a task or start from one of six student templates. Keep assignment links, notes and submission checks with the task. When a focus timer ends, confirm the minutes worked to update progress.
- **Storage.** Tasks and focus history are saved in the current browser. Export a JSON backup before clearing browser data or moving devices. Restore accepts validated backups up to 5 MB.
- **Calendar and reminders.** Exchange timed, single-day events through calendar files, or review a Google Calendar template before saving it. Imports are limited to 1 MB. Recurring events, all-day events and unsupported time zones are skipped. In-app reminders need the app open. Calendar alarms depend on the receiving calendar’s settings.
- **AI suggestions.** The optional ChatGPT handoff lets you copy a prompt, import the returned JSON and review each suggestion. Supply missing effort before adding a task. The server-side generation endpoint reports that an integration is required.
- **Accessibility.** The landing page offers reduced motion, keyboard navigation, an animation pause control and a software-rendered fallback for the 3D clock.

## Verify a change

The regression checks run directly in Node, even before installing frontend dependencies.

```sh
node --experimental-strip-types --test tests/planner.test.ts tests/reminders.test.ts tests/security.test.ts
```

The three files cover **52 scenarios** across scheduling, reminder timing, backups, calendar parsing and input validation. After installing dependencies, run the type check and production build.

```sh
pnpm exec tsc --noEmit
pnpm build
```

The [security review](SECURITY-REVIEW.md) records the original audit date, browser checks and outstanding dependency findings. The bundled font license is in [public/fonts](public/fonts).
