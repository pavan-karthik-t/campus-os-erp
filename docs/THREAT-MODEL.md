# Local Demo Threat Model

CampusOS currently runs with local fixture data and a demo cookie session.

## Scope

- Local development on `localhost:3000`
- No external database
- No external storage
- No external email delivery

## Main Risks

| Area | Risk | Local Demo Control |
|------|------|--------------------|
| Auth | Demo credentials are public | Use only for localhost |
| Data | Fixture data is not persistent | Store demo changes in source files |
| Uploads | Malicious files | Type, extension, and size validation |
| Routes | Unauthorized dashboard access | Cookie-backed proxy and page checks |

Before production use, replace demo auth and fixture data with real services and complete a production threat model.
