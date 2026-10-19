# quinta.feira.br

A five-second timing game built with Next.js, TypeScript, and the App Router.

Press **Space** to start the clock and press it again to stop as close to **05.00**
seconds as possible. You can also click or tap the button. The seven-segment display
shows seconds and hundredths live. Results include how early or late you stopped,
your closest time, and your last five attempts for the current session.

Timing uses the browser's monotonic clock; results are rounded to the nearest
hundredth of a second. A displayed result of `05.00` wins. Holding Space does not
start extra attempts. The timer stops automatically at `99.99`.

## Development

Use Node.js 24.x and npm. This matches the latest Node.js version
[supported by Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
If you use nvm, run `nvm install` and `nvm use` to select the version in `.nvmrc`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Edit `app/page.tsx` for the page or `app/timing-game.tsx`
for gameplay. Fonts are served locally from `public/fonts`, with their licenses.

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
