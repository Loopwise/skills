# Install Loopwise Agent Skills

This package includes three skills: **loopwise** (MCP) and **loopwise-cli** (CLI) manage the site; **loopwise-sdk** is the browser code you put inside a Loopwise Page (see Option C).

## Step 0: Install skills

```bash
npx skills add loopwise/skills
```

For a specific agent:

```bash
npx skills add loopwise/skills -a claude-code
npx skills add loopwise/skills -a cursor
```

For global installation (all projects):

```bash
npx skills add loopwise/skills -g
```

## Option A: MCP (loopwise)

Use this if your agent supports MCP (Claude Code, Cursor, etc.).

### 1. Configure MCP server

**Claude Code** — Add to `.claude/settings.json` or `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "loopwise": {
      "type": "url",
      "url": "https://mcp.loopwise.com/mcp"
    }
  }
}
```

**Cursor** — Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "loopwise": {
      "url": "https://mcp.loopwise.com/mcp"
    }
  }
}
```

**Other agents** — Connect to `https://mcp.loopwise.com/mcp` using Streamable HTTP transport with OAuth 2.0 authentication.

### 2. Authenticate

On first tool call, the MCP server will initiate an OAuth 2.0 authorization flow. Follow the browser prompt to grant access.

### 3. Verify

> Call `check_connection` to verify your token and see available tools.

## Option B: CLI (loopwise-cli)

Use this if your agent can run shell commands.

### 1. Install CLI

```bash
npm install -g loopwise
```

### 2. Authenticate

```bash
loopwise auth login
```

For headless CI/agent environments:

```bash
export LOOPWISE_ACCESS_TOKEN="your_token"
```

### 3. Verify

```bash
loopwise doctor --json
```

## Option C: SDK in a Loopwise Page (loopwise-sdk)

Use this when the page itself should show site data or act for the signed-in member (for example, members reviewing a course).

### 1. Add the SDK (pin 0.1.0-beta.5 or later)

Single HTML file:

```html
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@loopwise/sdk@0.1.0-beta.5/dist/index.mjs';
</script>
```

Bundler project:

```bash
npm install @loopwise/sdk@0.1.0-beta.5
```

An unpinned `npm install @loopwise/sdk` resolves to an older release without the member features.

### 2. Deploy on the site's domain

Deploy with Option A or B under a path prefix, and open it at `https://<site domain>/<path-prefix>/`. Member features need the site's sign-in cookie, which a `*.loopwise.page` preview does not have.

### 3. Verify

Signed out, the page reports `signed_out`; after signing in as an enrolled member, `courses.reviewState()` reports `can_review` or `reviewed`.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `check_connection` fails | Verify MCP server URL is correct and accessible |
| Missing tools | Your OAuth token may lack required scopes — re-authorize |
| `INSUFFICIENT_SCOPE` errors | Re-authorize to grant the specific scopes listed in the error |
| Rate limited (429) | Wait and retry — default limit is 100 requests per 60 seconds |
| `loopwise doctor` fails | Run `loopwise auth login` to re-authenticate |
| `auth` / `reviews` is undefined | The SDK is older than 0.1.0-beta.5 — pin the version |
| SDK rejects with `AUTH_REQUIRED` | The page is off the site's domain (e.g. a `*.loopwise.page` preview) — open it under the site's domain |
