# Local Demo API

CampusOS runs locally with demo data. API routes do not require external services.

## Health

`GET /api/health`

Returns:

```json
{ "status": "healthy" }
```

## CSRF Token

`GET /api/auth/csrf`

Returns a token used by forms or local upload calls.

## Upload

`POST /api/upload`

Accepts a validated file and returns a demo path. Files are not persisted in local demo mode.
