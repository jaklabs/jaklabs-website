# jaklabs-website

**jaklabs.io** — the JAK Labs marketing site, plus `rank.jaklabs.io` served from the same
app.

Next.js 14 (App Router), Tailwind, deployed on AWS Amplify from `main`.

## Two sites, one app

| Host | Route | What it is |
|---|---|---|
| `jaklabs.io` | `/` and the service pages | the agency site — sells systems to business owners |
| `rank.jaklabs.io` | `/rank` | [Aura](https://github.com/jaklabs/aura-rank), a free developer-rank tool |

`src/middleware.ts` rewrites by `Host` header, so the subdomain shares this app and
branch instead of needing its own deployment. `SiteChrome` suppresses the agency navbar
and footer on `/rank`, because the two have deliberately different audiences — developers
bounce off agency marketing.

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build
npm run lint
```

Visit `localhost:3000/rank` for the Aura page.

## Deploying

Push to `main`. Amplify builds per `amplify.yml`.

⚠️ **Push workflow files over SSH.** The OAuth token lacks `workflow` scope, so an HTTPS
push touching `.github/workflows/*` is rejected.

## Notes

- `infrastructure/` is CDK for the API, auth, database and storage stacks. The Amplify
  app and domain are managed in the console, not here.
- The domain association lists **apex, `www` and `rank`**. `update-domain-association`
  replaces the whole list — omit one and you take the site down.
- Blog content is in `src/lib/blog-data.ts`; the sitemap regenerates on a 300s revalidate.
