# CampusOS ERP

CampusOS ERP is a local-first college ERP demo built with Next.js, TypeScript, and Tailwind CSS. It gives administrators, faculty, and students a role-aware dashboard for day-to-day campus operations without requiring an external database or third-party services.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![Demo Data](https://img.shields.io/badge/Data-local_fixtures-green)

## Highlights

- Role-based dashboards for administrators, faculty, and students.
- Local demo authentication with cookie-backed sessions.
- Student records, attendance, marks, timetable, notices, fee status, and audit views.
- ReClaim lost-and-found workflow for reporting and reviewing found items.
- Server Actions and API routes for demo interactions.
- Jest and Playwright coverage for unit and end-to-end testing.
- Security-oriented docs for setup, threat modeling, privacy, and deployment readiness.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, Tailwind CSS 4, Radix UI, Lucide React, Framer Motion |
| Language | TypeScript |
| Validation | Zod, React Hook Form |
| Charts | Recharts |
| Testing | Jest, Testing Library, Playwright |
| Data | Local TypeScript fixtures in `src/lib/demo-data.ts` |

## Quick Start

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

All demo accounts use the password `password123`.

| Role | Email |
| --- | --- |
| Administrator | `admin@campusos.local` |
| Faculty | `faculty@campusos.local` |
| Student | `student@campusos.local` |

## Available Scripts

```bash
npm run dev           # Start the local development server
npm run build         # Create a production build
npm run start         # Run the production build
npm run lint          # Run ESLint
npm test              # Run Jest tests
npm run test:coverage # Run Jest with coverage
npm run test:e2e      # Run Playwright tests
```

## Project Structure

```text
src/
|-- app/                 # Next.js App Router pages, layouts, and API routes
|   |-- (auth)/          # Login and password flows
|   |-- api/             # Local API endpoints
|   `-- dashboard/       # Protected ERP modules
|-- actions/             # Server Actions
|-- components/          # UI, layout, dashboard, auth, and ReClaim components
|-- lib/                 # Auth, RBAC, demo data, security, and utility modules
`-- types/               # Shared TypeScript types

docs/                   # Setup, API, deployment, security, privacy, and user docs
tests/                  # Jest and Playwright tests
```

## Documentation

- [Setup guide](docs/SETUP.md)
- [User manual](docs/USER-MANUAL.md)
- [API notes](docs/API.md)
- [Database notes](docs/DATABASE.md)
- [Deployment notes](docs/DEPLOYMENT.md)
- [Security checklist](docs/SECURITY-CHECKLIST.md)
- [Threat model](docs/THREAT-MODEL.md)
- [Privacy policy](docs/PRIVACY-POLICY.md)

## Data and Persistence

CampusOS currently uses local fixture data for demonstration. Demo actions are acknowledged by the UI/server flow, but they are not persisted to a database. For production use, replace the local demo data and session modules with a real persistence layer, production authentication, and managed secrets.

## Deployment Notes

The project includes a Vercel configuration and can be built with:

```bash
npm run build
```

Before using CampusOS in production, review the security documentation, configure real environment variables, add persistent storage, and replace the local demo authentication flow.

## License

This repository does not currently declare a license.
