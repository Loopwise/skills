# Prompt: members review a course on a Loopwise Page

Fill in the three values and paste the whole block into your agent.
[繁體中文版](course-reviews.zh-TW.md)

```text
Build a Loopwise Page on my site where signed-in members who bought a course can
review it (star rating + comment).

Site domain: <e.g. academy.example.com>
Page path:   <e.g. /reviews>
Course slug: <e.g. my-course>

## 1. Install the Loopwise tools (once)

- Claude Code: run
    claude plugin marketplace add Loopwise/skills
    claude plugin install loopwise@loopwise
  then ask me to restart, open /mcp, select "loopwise" and Authenticate in my browser.
- Other agents (Cursor, Codex, …): run  npx skills add Loopwise/skills
  For MCP, connect to https://mcp.loopwise.com (the root URL, not /mcp).
- CLI for deploying: npm install -g loopwise@latest (0.3.0 or later),
  loopwise auth login (I sign in), then loopwise doctor --json.

Read the loopwise-sdk skill (page code) and the loopwise-cli skill (deploy) and follow
them. If you cannot install skills, follow the rules below.

## 2. Page code rules

- Use @loopwise/sdk pinned to an exact version, 0.1.0-beta.5 or later: older releases
  lack the member features, and a later pre-1.0 beta may change the API.
  Single HTML file:
    import { createClient, LoopwiseError } from 'https://cdn.jsdelivr.net/npm/@loopwise/sdk@0.1.0-beta.5/dist/index.mjs'
  Bundler project: npm install @loopwise/sdk@0.1.0-beta.5
- createClient({}) with no options. The page must be served under my site's domain;
  a *.loopwise.page preview has no member and rejects with AUTH_REQUIRED, so never
  accept the work there.
- Page HTML is CDN-cached: read member state in the browser after load with
  loopwise.courses.reviewState({ slug }) and render by status:
  ratings_off (hide reviews), signed_out (link to the returned loginUrl),
  not_purchased (enroll prompt), can_review (empty form),
  reviewed (form prefilled, plus Delete).
- Submit with loopwise.reviews.submit({ courseId, score, comment }):
  score 0.5–5 in steps of 0.5; always send comment ('' clears it); call it only on an
  explicit Submit click and disable the button while it runs (each submit emails the
  site owner); after submit or
  loopwise.reviews.delete({ courseId, reviewId: state.review.id }), call reviewState again.
- Every error is a LoopwiseError; branch on e.code: NOT_SIGNED_IN → loginUrl,
  NOT_PURCHASED → enroll prompt, RATINGS_OFF → hide reviews, INVALID_SCORE → fix input.
- No hand-written GraphQL, no reading or writing cookies or tokens, no `cache` option on
  member calls.

## 3. Deploy

loopwise pages create <slug> --page-type static_page --path-prefix <page path>
loopwise pages push <dir> --page <slug>
Run every command that changes the site with --dry-run --json first, show me the
result, and wait for my go-ahead.

## 4. Verify on my site's domain and report each

1. Signed out: the page shows a login link, and login returns to the page.
2. Signed in as a member who bought the course: submit a review, reload, and the same
   score and comment are shown.
3. Edit it (e.g. clear the comment): the page updates; delete it: back to the empty form.
4. A course with reviews off, or one the member did not buy, shows its own state.
```
