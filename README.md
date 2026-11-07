# TEDxCIT 2027 Web Application

React and Express application for TEDxCIT 2027 speaker applications.

## Active data flows

The application intentionally uses only three MongoDB collections:

- `anonymousVoices` — Anonymous Voices student applications.
- `speakerNominations` — self-nominations and third-party speaker nominations.
- `registrationsettings` — admin-controlled form visibility and deadlines.

The public application choices and both submission APIs read the saved registration settings. Turning a form off in the admin portal hides it publicly and blocks its API submissions.

## Routes

- `/` — public website.
- `/apply/anonymous-voices` — Anonymous Voices application.
- `/apply/speaker-nomination` — speaker nomination form.
- `/admin` — protected submissions and registration-settings portal.

## API

- `GET /api/health`
- `GET /api/speak/config`
- `POST /api/anonymous-voices`
- `POST /api/speaker-nominations`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/submissions`
- `PATCH /api/admin/submissions/:type/:id/status`
- `PATCH /api/admin/deadlines`

## Configuration

Copy `backend/.env.example` to `backend/.env` for local development. Configure the same server-only variables in Vercel:

- `MONGODB_URI`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CLIENT_URL`

Never expose these values through `VITE_` variables or commit `.env` files.

## Development

```bash
npm run dev:backend
npm run dev:frontend
```

Build the frontend with `npm run build:frontend` and run backend checks with `npm run test:backend`.
