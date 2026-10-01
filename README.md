# SignalUS AI News Studio

Vite/React frontend with a small Node backend for an RSS-to-video-to-Instagram
pipeline. The frontend is unchanged.

## Backend setup

Prerequisites:

- Node.js 18+ (the backend uses the built-in `fetch`)
- `ffmpeg` on `PATH` for video generation, or set `FFMPEG_PATH`
- An Instagram professional account, an Instagram Graph API access token, and
  the permissions required by Meta for Reels publishing
- A public HTTPS host for publishing generated videos (`PUBLIC_BASE_URL`)

```powershell
Copy-Item .env.example .env
# Edit .env; never commit or expose it
npm run server
```

Environment variables:

- `INSTAGRAM_ACCESS_TOKEN`: server-side token; it is never returned by an API.
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`: optional; if omitted, the backend resolves
  the account with `/me`.
- `INSTAGRAM_API_VERSION`: Graph API version (defaults to `v24.0`).
- `PUBLIC_BASE_URL`: public base URL that serves `/generated/*.mp4`.
- `FFMPEG_PATH` and `PORT` are optional.
- `AUTO_PUBLISH=true` enables the scheduler. It requires `PUBLIC_BASE_URL` to
  be a public HTTPS URL; the minimum interval is 15 minutes.

## Public deployment

The repository includes `Dockerfile` and `render.yaml` for a persistent Render
deployment. Create a Render Web Service from this repository, set
`INSTAGRAM_ACCESS_TOKEN` as a secret, set `PUBLIC_BASE_URL` to the HTTPS URL
assigned by Render, and deploy. Do not put the token in the repository.

## API

- `GET /api/news` fetches two public RSS feeds and returns lightweight parsed
  items. Individual feed failures are tolerated; all-feed failure is an error.
- `POST /api/pipeline/run` selects the first RSS item and creates a 30-second
  1080x1920 MP4 with ffmpeg. It returns `mediaUrl` and the selected news item.
  Without ffmpeg it returns a clear error instead of pretending to generate a
  file.
- `POST /api/instagram/publish` accepts JSON
  `{ "mediaUrl": "https://...", "caption": "..." }`. Only HTTPS URLs are
  accepted. The server creates a `REELS` container and publishes it through the
  Instagram Graph API; the token stays server-side.
- `GET /api/instagram/status` checks the configured connection.

## Limits

The XML parser intentionally handles common RSS `<item>` fields only; it is
not a full XML parser. RSS availability, Meta permissions, account eligibility,
video hosting, and ffmpeg codecs are external requirements. Generated files are
stored locally in `generated/` and are not automatically deleted. This backend
has no authentication or rate limiting and should not be exposed directly to
the public internet without a protecting service.
