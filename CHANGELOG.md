# Changelog

All notable changes to the Workout App are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [0.2.0] - 2026-03-21

### Added
- **Supabase integration**: Dual-backend data layer with Supabase (when configured) and localStorage fallback
- **Async data hooks**: `useTemplates()`, `useSchedule()`, `useSessions()`, `useTemplate(id)`, `useSession(id)` in `src/hooks/use-data.ts`
- **Supabase client**: Singleton client in `src/lib/supabase.ts` (null when env vars missing)
- **Database schema**: 3 tables (`workout_templates`, `scheduled_workouts`, `workout_sessions`) with RLS policies and seed data
- **Coach Dashboard** at `/admin` with quick stats and navigation
- **Template CRUD**: Create, edit, delete workout templates with inline exercise editor (`/admin/templates`)
- **Schedule Manager**: Week-by-week grid with template assignment, status badges, and "Copy to Next Week" (`/admin/schedule`)
- **Session Review**: Review-by-exception dashboard highlighting skipped exercises, unusual feedback, weight changes, and notes (`/admin/review`)
- **Session Detail View**: Exercise-by-exercise breakdown with weight change highlighting (`/admin/review/[sessionId]`)
- Coach link in Profile tab for easy access to admin

### Changed
- Migrated all existing pages from direct `storage.*` calls to async data hooks
- `workout-session-context.tsx` now uses async write functions (`writeSaveSession`, `writeUpdateScheduledWorkout`)
- `next-workout-card.tsx` uses async write functions instead of direct storage calls
- Added admin storage functions to `storage.ts`: `saveTemplate`, `deleteTemplate`, `addScheduledWorkout`, `deleteScheduledWorkout`, `saveFullSchedule`

## [0.1.0] - Initial Release

### Added
- Home page with next workout card and weekly schedule
- Guided workout flow with set tracking, weight adjustment, and exercise navigation
- Workout completion screen with overall feeling and notes
- Progress page with workout history
- Profile page with stats
- localStorage-based persistence
- PWA support (manifest, apple-web-app meta tags)
- Three seed workout templates: Upper Body, Lower Body, Full Body
