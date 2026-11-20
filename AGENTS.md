# Working in simplelogs-vanilla-example

This repo shows `@simplelogs/browser` in a plain HTML page. The page loads the
SDK from unpkg `<script>` tags in `public/index.html`. There is no bundler and
no build step.

It is one of five standalone examples, one for each of these packages:

| Example | Package | Port |
|---|---|---|
| vanilla (this repo) | `@simplelogs/browser` | 5173 |
| react | `@simplelogs/react` | 5174 |
| next | `@simplelogs/next` | 5175 |
| express | `@simplelogs/express` | 3100 |
| node | `@simplelogs/node` | 3200 |

## How the SDK is loaded

- Both script tags pin the major version only (`@simplelogs/browser@2`), so
  the page picks up every 2.x release without an edit. Only a new major SDK
  release needs a change here. Keep both tags on the same major.
- The first tag, `dist/simplelogs.global.js`, configures itself from its own
  `data-*` attributes. There is no `init()` call. The page sets
  `data-client-key` and `data-environment`. The README also documents
  `data-auto-capture`, `data-debug` and `data-api-endpoint`. Once it loads,
  `window.SimpleLogs` exists.
- Session replay is a second, optional tag,
  `dist/simplelogs.replay.global.js`. It must come after the first tag, which
  configures the key the two share. Loading it starts recording, still subject
  to the dashboard's sample rate and replay setting.
  `data-auto-start="false"` on it loads it without recording, and
  `window.SimpleLogsReplay.start()` starts it later.
- The README's "Using npm instead" section shows the same package through a
  bundler. Keep it in step with the script-tag setup.

## House style

The five examples share one style, so keep it:

- Plain JS. No TypeScript, Tailwind or ESLint.
- `.env.example` documents the one value this page needs,
  `SIMPLELOGS_CLIENT_KEY`. Nothing reads it, because there is no build step.
  It is a note telling you where to paste the key.
- The README covers setup, key handling and the reasoning behind each choice,
  and closes with a cross-link table to the other examples.
- There is no lockfile and no dependencies. `package.json` has a single
  script: `npm start` runs `serve.js`, a dependency-free static server for
  `public/` on http://localhost:5173. The page has to be served over
  `http://`, because a `file://` page has no origin for the key's allowlist to
  match.

## Keys

Only the client key belongs in the page. It is public by design and
origin-locked in the dashboard. The server key is a different value and must
never appear in `public/index.html`, the README or `.env.example`.

## Verifying a change

1. Run `npm start` and open http://localhost:5173 in a real browser. `curl`
   runs no JavaScript, so it cannot show the SDK working.
2. Watch the network tab for the SDK's requests to `/enqueue`.
3. To see what the page sends without a real key, add
   `data-api-endpoint="http://localhost:4319"` to the first script tag and run
   a small `node:http` server on that port that prints every request body.
   The value is a base URL: the SDK appends paths such as `/enqueue` to it.
   The page and the collector are on different origins, so the collector must
   answer `OPTIONS` preflights and send `Access-Control-Allow-Origin`. Remove
   the attribute before you commit.

## Docs style

Docs and comments describe current behavior only. Use US English.
