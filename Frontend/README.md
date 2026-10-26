# Superteacher frontend

## Run locally

```sh
npm install
copy .env.example .env
npm run dev
```

Set `VITE_BACKEND_URL` in `.env` to the backend origin, without `/api`. The
example file points to the local backend at `http://localhost:5000`.

## Deploy to Vercel

Create a Vercel project from this repository and set its **Root Directory** to
`Frontend`. Vercel builds the Vite app with `npm run build` and serves `dist`.
The rewrite in `vercel.json` supports direct navigation to React Router pages.

Set `VITE_BACKEND_URL` in the Vercel project's Environment Variables to the
deployed backend origin (for example, `https://your-backend.vercel.app`, with
no `/api` suffix), then redeploy. This variable is used at build time.

Run `npm run lint` and `npm run build` before deploying.
