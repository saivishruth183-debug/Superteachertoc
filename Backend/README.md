# Backend deployment

## Run locally

Copy `.env.example` to `.env`, fill in the credentials, then run:

```sh
npm install
npm start
```

The backend listens on port `5000` by default.
In non-production environments, CORS allows the Vite frontend at
`http://localhost:5173` as well as the deployed frontend.
Run the backend checks with `npm test`.

## Deploy to Vercel

Create a separate Vercel project from this repository and set its **Root
Directory** to `Backend`. Add these environment variables in the Vercel project
settings for every deployment environment:

- `MONGODB_URI`: the MongoDB connection string. Allow Vercel's deployment
  connections in the MongoDB network access settings.
- `JWT_KEY`: a long, private signing secret.
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT`:
  ImageKit credentials for persistent PDF storage. Vercel function filesystems
  are temporary, so PDF uploads use ImageKit rather than local disk.

PDF uploads are limited to 4 MB to remain within Vercel's function request-body
limit. Existing `/uploads/grades/...` PDFs are still served from the repository;
new Vercel uploads are saved in ImageKit.

For the frontend deployment, set `VITE_BACKEND_URL` to the deployed backend's
origin (for example, `https://your-backend.vercel.app`, with no `/api` suffix),
then redeploy the frontend. Course and grade requests, login, and PDF links use
this setting. See the frontend README for the frontend project setup.

Never commit `.env` files or expose the ImageKit private key in the frontend.
