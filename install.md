# Install Loopwise Agent Skills

Three skills ship here: **loopwise** (uses the Loopwise MCP server) and **loopwise-cli**
(uses the `loopwise` CLI) manage the site; **loopwise-sdk** is the browser code you put
inside a Loopwise Page. Install all of them; your agent picks per task.

## Claude Code (recommended)

```bash
claude plugin marketplace add Loopwise/skills
claude plugin install loopwise@loopwise
```

This installs the skills **and** adds the Loopwise MCP server. Restart Claude Code, run
`/mcp`, select `loopwise`, and choose **Authenticate** — that opens the Loopwise sign-in
in your browser. Until then the server shows `Needs authentication` and its tools are
not available.

Inside a session, `/plugin marketplace add Loopwise/skills` then
`/plugin install loopwise@loopwise` does the same.

Updates: `claude plugin update loopwise@loopwise`, or enable auto-update for the
`loopwise` marketplace under **Marketplaces** in `/plugin`.

## Other agents (skills.sh)

```bash
npx skills add Loopwise/skills                 # pick agents interactively
npx skills add Loopwise/skills -a cursor -g    # one agent, all projects
```

Then connect the MCP server for the **loopwise** skill:

- **Cursor** — `.cursor/mcp.json`:

  ```json
  { "mcpServers": { "loopwise": { "url": "https://mcp.loopwise.com" } } }
  ```

- **Claude Code without the plugin** —
  `claude mcp add --transport http loopwise https://mcp.loopwise.com`
- **Anything else** — a remote MCP server at `https://mcp.loopwise.com`,
  Streamable HTTP transport, OAuth 2.0.

Updates: `npx skills update`.

## CLI (for loopwise-cli)

```bash
npm install -g loopwise
loopwise auth login               # or, headless: export LOOPWISE_ACCESS_TOKEN=...
loopwise doctor --json
```

## SDK in a Loopwise Page (for loopwise-sdk)

Use this when the page itself should show site data or act for the signed-in member
(for example, members reviewing a course).

1. **Add the SDK, pinned to 0.1.0-beta.5 or later.** Member features need it, and
   the SDK is still in beta, so an exact pin keeps your page's API from changing
   under it.

   Single HTML file:

   ```html
   <script type="module">
     import { createClient } from 'https://cdn.jsdelivr.net/npm/@loopwise/sdk@0.1.0-beta.5/dist/index.mjs';
   </script>
   ```

   Bundler project: `npm install @loopwise/sdk@0.1.0-beta.5`

2. **Deploy on the site's domain** with the CLI under a path prefix, and open it at
   `https://<site domain>/<path-prefix>/`. Member features need the site's sign-in
   cookie, which a `*.loopwise.page` preview does not have.

3. **Verify:** signed out, the page reports `signed_out`; signed in as an enrolled
   member, `courses.reviewState()` reports `can_review` or `reviewed`.

## Verify

- MCP: ask the agent to call `check_connection`.
- CLI: `loopwise doctor --json`.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Loopwise tools missing in Claude Code | `claude mcp list`: `Needs authentication` → `/mcp` → `loopwise` → Authenticate; not listed → install the plugin |
| `check_connection` fails | Re-authenticate from `/mcp` (Claude Code) or your agent's MCP settings |
| `INSUFFICIENT_SCOPE` errors | Re-authorize to grant the scopes listed in the error |
| Rate limited (429) | Wait and retry — default limit is 100 requests per 60 seconds |
| `loopwise doctor` fails | Run `loopwise auth login` to re-authenticate |
| SDK `auth` / `reviews` is undefined | The SDK is older than 0.1.0-beta.5 — pin the version |
| SDK rejects with `AUTH_REQUIRED` | The page is off the site's domain (e.g. a `*.loopwise.page` preview) — open it under the site's domain |
| Plugin install fails to clone over SSH | `export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1` and retry |
