# Project Context — Tasks Dashboard

## Project Goal
A personal productivity dashboard hosted on GitHub Pages, accessible from any browser. No login, no server — all data stored locally in the browser (localStorage). Two tabs: a Task Manager and a Fitness/Workout Tracker.

## Live URL
`https://healthfaresupplementsacc.github.io/tasks/standalone.html`
GitHub repo: `healthfaresupplementsacc/tasks` (branch: `main`)

## Architecture
**Single file:** `standalone.html` — everything (HTML, CSS, React, logic) is in one self-contained file. No build step, no Node.js required.

**Stack:**
- React 18 (loaded via unpkg CDN)
- Babel Standalone (JSX compiled in-browser)
- localStorage via `window.storage` polyfill (mirrors Claude artifact API: `get(key)` → `{value}`, `set(key, value)`)
- File System Access API for folder backups (IndexedDB for handle persistence)

**Component tree:**
```
App (root)
  ├── state: tasks, loaded, note, folderName, loadedRef
  ├── Tab bar (📋 Tasks | 💪 Fitness)
  ├── TasksApp (receives tasks/setS/loaded as props)
  │     ├── Sidebar: clock, nav, stats, folder backup, notes
  │     ├── Main: quick-add, task list, advanced form
  │     └── Calendar panel + Daily Briefing modal
  └── WorkoutApp (self-contained)
        ├── Dashboard: stats, start workout, recent workouts
        ├── Log: active workout session, set table, exercise picker
        ├── History: expandable past workouts
        └── Exercises: library + custom exercise form
```

## Constraints
- **No Node.js installed** on user's machine — no npm, no build tools
- **No server** — must work as a static HTML file
- **Single file only** — all code stays in `standalone.html`
- **CDN only** — React, Babel loaded from unpkg
- **Browser only** — no Electron, no native app

## Coding Standards
- Minified/compact JSX style (short variable names, inline styles, everything in one line where possible)
- All styles are inline React style objects using CSS custom properties from `:root`
- No CSS classes, no external stylesheets
- Storage key naming: `tasks_v3`, `tasks_v3_bak`, `fitness_workouts`, `fitness_custom_ex`, `app_note`
- Colors: primary blue `#378ADD`, success green `#63991a`, danger red `#E24B4A`

## Important Architecture Decisions
1. **Tasks state lives in root `App`**, not in `TasksApp` — prevents unmount/remount data loss on tab switch
2. **Dual-key storage**: `tasks_v3` (primary) + `tasks_v3_bak` (backup, never blanked). On load: if primary is empty, auto-recover from backup silently
3. **`loadedRef` guard**: `persist()` blocked until initial load completes — impossible to write empty array over real data
4. **`window.storage` polyfill** must NOT double-serialize — component handles its own JSON.stringify/parse
5. **Tab switching uses conditional rendering** (`{activeTab==="tasks" && <TasksApp .../>}`) — TasksApp does remount on switch but data is safe because it lives in root App

## Backup Systems (3 layers)
1. **`tasks_v3_bak`** — localStorage backup key, auto-recovery on load
2. **Folder backup** — File System Access API, user picks a folder, daily JSON export
3. **GitHub auto-push** — Windows Task Scheduler at 8am + 8pm via `C:\Users\bruno\tasks-backup.ps1` (backs up the HTML file/code, not task data)

## Auto-Push Setup
- **Stop hook**: `.claude/settings.json` → runs `git add -A && git commit && git push` on every Claude session end
- **Scheduled tasks**: `TasksPageBackup-8AM` and `TasksPageBackup-8PM` in Windows Task Scheduler
- **Script**: `C:\Users\bruno\tasks-backup.ps1`

## Known Issues
- **File System Access API** not supported in Firefox or Safari — only works in Chrome/Edge
- **localStorage is browser/device specific** — data does not sync across devices. GitHub Pages only hosts the code, not the data.
- If the user opens the page as a local `file://` URL AND as a GitHub Pages URL, they are different localStorage namespaces (data won't cross over)

## Current Feature Status
### ✅ Tasks Tab
- Quick-add with NLP parsing (detects priority, dates, times, days of week)
- Advanced form (title, priority, due date, reminder, notes, everyday toggle)
- Views: Today, Upcoming, Everyday Tasks, Completed
- Completed view: grouped by date, shows completion time, Undo button
- Drag-to-reorder tasks
- Sidebar stats: overdue, due today, high priority, everyday count
- Daily briefing modal (shows once per day on open)
- Export/Import JSON backup
- Folder backup (📁 section in sidebar)
- Notes textarea (always-visible, auto-saves)
- Mini calendar with task dots

### ✅ Fitness Tab
- Dashboard with streak, weekly sessions, all-time count, today's volume
- 5 workout templates + empty workout start
- Active workout: editable name, live timer, set table (shows previous session weights), add sets, mark sets complete
- Finish/Cancel workout
- History: expandable, "Repeat Workout" button
- Exercise library: 38 built-in + custom exercises, category filter

## What the User Has Asked For (History)
- ✅ Create a hosted tasks page from a React component
- ✅ Auto-push to GitHub on every session end
- ✅ Completed tasks section with date/time grouping
- ✅ Stop auto-seeding "Payroll" and "Dispute" tasks
- ✅ Twice-daily automatic GitHub backup (Task Scheduler)
- ✅ Notes area (small persistent textarea)
- ✅ Tab system (Tasks + Fitness)
- ✅ Premium workout tracker (Fitness tab)
- ✅ Fix data wiping on tab switch
- ✅ Folder backup (local daily JSON export)

## Next Steps / Ideas Not Yet Built
- Sync data across devices (would need a backend or GitHub Gist API)
- Push notifications / reminders for tasks with reminder times
- Workout stats: personal records per exercise, volume over time chart
- Dark mode toggle
- Mobile-responsive layout improvements
- Recurring tasks (weekly/monthly patterns, not just "everyday")

## How to Continue in a New Session
1. Open Claude Code in `C:\Users\bruno\OneDrive\Documents\Claude Projects\tasks-page`
2. Say: **"Read the Memory folder completely and continue where we left off"**
3. All context is in `Memory/PROJECT_CONTEXT.md` and `Memory/SESSION_HANDOFF.md`
4. The working file is always `standalone.html` — make edits there, then `git add standalone.html && git commit -m "..." && git push`
