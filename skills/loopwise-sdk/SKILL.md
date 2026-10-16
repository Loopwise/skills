---
name: loopwise-sdk
description: >
  Build Loopwise Pages that read site data and act for the signed-in member with
  @loopwise/sdk: course lists, the member's login state, and course reviews
  (rating + comment) from your own UI. Use when writing HTML/JS or a Vite app for
  a Loopwise Page that shows courses or lets members review a course. Triggers on:
  "@loopwise/sdk", "Loopwise Page", "review", "rating", "評價", "signed-in member",
  "logged-in student", "custom UI".
license: Proprietary
compatibility: Browser code served from the Loopwise site's own domain. Node/SSR gets public data only.
metadata:
  author: loopwise
  version: "1.0"
  sdk-version: "0.1.0-beta.5"
---

# Loopwise SDK

`@loopwise/sdk` is the browser client for a Loopwise site's storefront API. On a
Loopwise Page it needs no configuration: it calls the site that serves the page.

## Install (pin the version)

Member features (`auth`, `courses.reviewState`, `reviews`) need **0.1.0-beta.5 or
later**. `npm install @loopwise/sdk` without a version still resolves to an older
release, so always pin.

Single HTML file, no build step:

```html
<script type="module">
  import { createClient, LoopwiseError } from 'https://cdn.jsdelivr.net/npm/@loopwise/sdk@0.1.0-beta.5/dist/index.mjs';
</script>
```

Project with a bundler (Vite, Astro, Next.js):

```bash
npm install @loopwise/sdk@0.1.0-beta.5
```

```ts
import { createClient, LoopwiseError } from '@loopwise/sdk';
```

The package has no dependencies.

## The one rule: same origin

The member is known only from the site's sign-in cookie, which the browser sends
only to the page's own origin. So member features work only when the page is
opened **on the site's domain** (`https://acme.myteachify.com/reviews`,
`https://academy.example.com/reviews`), i.e. a Loopwise Page with a path prefix.

- A preview at `*.loopwise.page`, server code, SSR and Node have no member. There
  every member method rejects with `LoopwiseError` code `AUTH_REQUIRED` and sends
  nothing. Public reads (`courses.list`, `posts.list`) still work there with
  `createClient({ site: 'acme' })`.
- Page HTML is cached at the CDN and shared by every visitor. Never render member
  state into the HTML; render a neutral shell and fill it in the browser after load.

## Member reviews: the whole flow

```ts
const loopwise = createClient({});

const me = await loopwise.auth.getMe(); // { id, name } or null

let state = await loopwise.courses.reviewState({ slug: 'my-course' });
render(state);

const refresh = async () => {
  state = await loopwise.courses.reviewState({ slug: 'my-course' });
  render(state);
};

const onError = (e) => {
  if (e instanceof LoopwiseError && e.code === 'NOT_SIGNED_IN') {
    location.href = state.loginUrl; // returns to this page after login
  } else {
    showError(e);
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  try {
    await loopwise.reviews.submit({
      courseId: state.courseId,
      score: Number(form.score.value), // 0.5, 1, 1.5 … 5
      comment: form.comment.value,     // required; '' clears it
    });
    await refresh();
  } catch (e) {
    onError(e);
  } finally {
    submitButton.disabled = false;
  }
});

deleteButton.addEventListener('click', async () => {
  if (!state.review) return;
  deleteButton.disabled = true;
  try {
    await loopwise.reviews.delete({ courseId: state.courseId, reviewId: state.review.id });
    await refresh();
  } catch (e) {
    onError(e);
  } finally {
    deleteButton.disabled = false;
  }
});
```

`reviewState` returns `{ status, courseId, review, rating, loginUrl }` in one
request. Render by `status`, checked in this order:

| status | Meaning | Show |
|---|---|---|
| `ratings_off` | The site turned reviews off for this course | Nothing; hide the review UI |
| `signed_out` | No member signed in to this site | A link to `loginUrl` |
| `reviewed` | The member has a review (`review` holds it) | The form prefilled, plus Delete |
| `not_purchased` | Signed in but not enrolled | "Enroll to review" |
| `can_review` | Enrolled, no review yet | An empty form |

`rating` is `{ average, total }`, or `null` when reviews are off.

## Rules

- **Pin `0.1.0-beta.5` or later.** Older versions have no member methods.
- **Score is 0.5 to 5 in half steps.** Anything else rejects with `INVALID_SCORE`
  before sending; the server enforces the same rule.
- **Always send `comment`.** Each submit replaces the stored text; pass the existing
  text to keep it, `''` to clear it. Leaving it out rejects with `CONFIG`.
- **Submit only on an explicit click, and disable the button while it runs.** Each
  submit emails the site owner. Never autosave or submit on every star change.
- **One review per member per course.** The first submit creates it; later ones
  replace it.
- **Re-read `reviewState` after every write** so the page and the next click see
  the current review.
- **Never pass `{ cache }` to member calls.** Member methods take no options and
  always `POST` with the cookie; a cached call is an anonymous `GET`.

## Errors

Every failure is a `LoopwiseError`; branch on `e.code`.

| code | Meaning | Do |
|---|---|---|
| `NOT_SIGNED_IN` | No member signed in | Send them to `state.loginUrl` |
| `NOT_PURCHASED` | Signed in, not enrolled | Show an enroll prompt |
| `RATINGS_OFF` | Reviews are off for the course | Hide the review UI |
| `INVALID_SCORE` | Score not in 0.5–5 half steps | Fix the input |
| `AUTH_REQUIRED` | Ran off-origin, server-side, or in a `*.loopwise.page` preview | Open the page on the site's domain |
| `CONFIG` | A required argument is missing (`slug`, `courseId`, `reviewId`, `comment`) | Fix the call |
| `GRAPHQL` | Other server error, e.g. an unknown course slug; details in `e.graphqlErrors` | Show a generic error |
| `NETWORK`, `AUTH`, `RATE_LIMIT` | Transport failures | Retry later |

## Other reads

```ts
const { items } = await loopwise.courses.list({ limit: 20 });
const course = await loopwise.courses.get({ slug: 'my-course' });
const posts = await loopwise.posts.list({ limit: 10 });
const data = await loopwise.query(`query { __typename }`); // raw GraphQL
```

Public reads may pass `{ cache: 60 }` as the last argument to use the CDN cache.

## Deploy and verify

Deploy the page with the `loopwise-cli` skill (`loopwise pages create … --path-prefix /reviews`,
then `loopwise pages push`) or the `loopwise` MCP skill (`create_page`,
`deploy_static_page`). Then check it where members will use it:

1. Open `https://<site domain>/<path-prefix>/` (not the `*.loopwise.page` preview).
2. Signed out: the page shows `signed_out` and the login link returns to the page.
3. Sign in as a member enrolled in the course: `can_review`; submit; the page shows
   `reviewed` with the stored score and comment.
4. A course with reviews off shows `ratings_off`; one the member did not buy shows
   `not_purchased`.

## Reference

Full API: the package README (`node_modules/@loopwise/sdk/README.md`) and its
type declarations (`dist/index.d.mts`). With the `loopwise` MCP connected, read
`loopwise://sdk/api-reference` and `loopwise://sdk/quickstart`.
