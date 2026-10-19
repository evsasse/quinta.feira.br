# quinta.feira.br

A fresh Next.js app with TypeScript, the App Router, and a single placeholder home page.

## Development

Use Node.js 24.x and npm. This matches the latest Node.js version
[supported by Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
If you use nvm, run `nvm install` and `nvm use` to select the version in `.nvmrc`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Edit `app/page.tsx` to update the home page.

## Checks and production

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Legacy site

The original site and its complete history are preserved on the
[`legacy/2020-05-05`](https://github.com/evsasse/quinta.feira.br/tree/legacy/2020-05-05)
branch, named after its last commit date.
