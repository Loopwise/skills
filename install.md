# Install Loopwise Agent Skills

This package includes two skills: **loopwise** (MCP) and **loopwise-cli** (CLI). You can use either or both.

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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `check_connection` fails | Verify MCP server URL is correct and accessible |
| Missing tools | Your OAuth token may lack required scopes — re-authorize |
| `INSUFFICIENT_SCOPE` errors | Re-authorize to grant the specific scopes listed in the error |
| Rate limited (429) | Wait and retry — default limit is 100 requests per 60 seconds |
| `loopwise doctor` fails | Run `loopwise auth login` to re-authenticate |
