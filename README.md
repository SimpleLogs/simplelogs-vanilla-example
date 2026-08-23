# SimpleLogs + plain JavaScript

The smallest possible SimpleLogs integration: **one `<script>` tag** in an HTML
page. No bundler, no npm install, no build step.

Uses [`@simplelogs/browser`](https://www.npmjs.com/package/@simplelogs/browser).

## Setup

You need a **client key** — SimpleLogs dashboard → **Settings → API Keys**.

1. Paste the key into `public/index.html`, replacing `ck_replace_me`:

   ```html
   <script
     src="https://unpkg.com/@simplelogs/browser@1/dist/simplelogs.global.js"
     data-client-key="ck_your_key_here"
     data-environment="development"
   ></script>
   ```

2. Add `http://localhost:5173` to the key's allowed origins, in the same
   Settings → API Keys screen. Client keys are origin-locked, so the page is
   silently ignored until you do.

3. Run it:

   ```bash
   npm start
   ```

   Then open <http://localhost:5173>.

`npm start` runs `serve.js`, a ~30-line dependency-free static server. There is
nothing to `npm install`. You only need it because the page has to be served
over `http://` rather than opened as a `file://` URL — an origin allowlist has
nothing to match against a `file://` page.

## The integration

That script tag is the entire setup. It configures itself from its own `data-`
attributes, so there is no `init()` call to place and nothing to import.

| Attribute | Purpose |
|---|---|
| `data-client-key` | **Required.** Settings → API Keys |
| `data-environment` | Splits data by environment (`development`, `production`, …) |
| `data-auto-capture` | `false` turns off automatic page view and Web Vitals capture |
| `data-debug` | `true` logs the SDK's own activity to the console |
| `data-api-endpoint` | Self-hosted collectors only |

## What you get without writing any logging code

As soon as the tag loads:

- **Page views**, including soft navigations (`pushState` / `popstate`), so
  single-page routers work with no adapter
- **Web Vitals** — FCP, LCP, TTFB, CLS
- **Uncaught errors** and unhandled promise rejections

## What this page adds on top

Four buttons in [`public/index.html`](public/index.html), each a few lines:

| Button | API | Shows |
|---|---|---|
| Send a log | `SimpleLogs.log()` | A named event at a level, with metadata |
| Time an operation | `SimpleLogs.start()` / `.end()` | A timing; the `key` keeps overlapping operations apart |
| Identify the user | `SimpleLogs.identify()` | Attaching a user, retroactively |
| Log an error | `SimpleLogs.log({ level: "error" })` | Reporting a caught error with its stack |

The last line of the page flushes on `pagehide` — entries are batched, and a
page closed mid-batch would otherwise drop them.

## Session replay

The second script tag. It is separate because it carries rrweb, which would
multiply the size of a tag most pages add for logging alone:

```html
<script src=".../simplelogs.global.js" data-client-key="ck_..."></script>
<script src=".../simplelogs.replay.global.js"></script>
```

Order matters — the first tag configures the key both of them share. Loading
the second tag *is* the opt-in, so recording starts on its own, still subject
to the sample decision and the switch under Settings → Session Replay. Add
`data-auto-start="false"` to load it inert and start it yourself with
`window.SimpleLogsReplay.start()`.

Delete the tag entirely if you do not want replay.

## Is it safe to put the client key in HTML?

Yes — that is what it is for. It is public by design and only works from the
origins you list under Settings → API Keys.

The **server key** is a different value. It must never appear in a page.

## Using npm instead

Same package, if you do have a bundler:

```bash
npm install @simplelogs/browser
```

```js
import { SimpleLogs } from "@simplelogs/browser";

SimpleLogs.init({ clientKey: "ck_..." });
```

## Other examples

| Your app | Example | Package |
|---|---|---|
| Plain HTML / any framework | **this repo** | `@simplelogs/browser` |
| React (Vite, CRA, Remix, React Router) | [simplelogs-react-example](https://github.com/SimpleLogs/simplelogs-react-example) | `@simplelogs/react` |
| Next.js | [simplelogs-next-example](https://github.com/SimpleLogs/simplelogs-next-example) | `@simplelogs/next` |
| Express | [simplelogs-express-example](https://github.com/SimpleLogs/simplelogs-express-example) | `@simplelogs/express` |
| Node, any other server | [simplelogs-node-example](https://github.com/SimpleLogs/simplelogs-node-example) | `@simplelogs/node` |

Frontend and backend packages are complementary, not alternatives — a React app
with an Express API installs `@simplelogs/react` in the client and
`@simplelogs/express` in the server, and the two correlate automatically.
