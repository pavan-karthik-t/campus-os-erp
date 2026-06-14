# CampusOS User Manual

## Sign In

Open [http://localhost:3000/login](http://localhost:3000/login) and use one of the demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Administrator | admin@campusos.local | password123 |
| Faculty | faculty@campusos.local | password123 |
| Student | student@campusos.local | password123 |

## Dashboards

- Administrator: full campus overview, students, attendance, marks, timetable, notices, fees, ReClaim, and audit logs.
- Faculty: teaching-focused access to students, attendance, marks, timetable, and notices.
- Student: read-only academic views plus ReClaim claim/report actions.

## Demo Data

The app uses local fixture data from `src/lib/demo-data.ts`. Changes made through demo server actions are acknowledged but are not persisted.
