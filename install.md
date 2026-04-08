# Install Loopwise Agent Skills

This guide sets up the Loopwise MCP server connection so your agent can manage Teachify/Loopwise sites.

## Success criteria

Installation is complete when `check_connection` returns your granted scopes and available tools.

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

## Step 1: Configure MCP server

Add the Loopwise MCP server to your agent's MCP configuration.

### Claude Code

Add to `.claude/settings.json` or `~/.claude/settings.json`:

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

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "loopwise": {
      "url": "https://mcp.loopwise.com/mcp"
    }
  }
}
```

### Other agents

Any MCP-compatible agent can connect to `https://mcp.loopwise.com/mcp` using Streamable HTTP transport with OAuth 2.0 authentication.

## Step 2: Authenticate

On first tool call, the MCP server will initiate an OAuth 2.0 authorization flow. Follow the browser prompt to grant access to your Loopwise site.

After authorization, verify the connection:

> Call `check_connection` to verify your token and see available tools.

Expected output includes:
- `server_version` — MCP server version
- `granted_scopes` — OAuth scopes your token has
- `available_tools` — Number of tools accessible with your scopes

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `check_connection` fails | Verify MCP server URL is correct and accessible |
| Missing tools | Your OAuth token may lack required scopes — re-authorize |
| `INSUFFICIENT_SCOPE` errors | Re-authorize to grant the specific scopes listed in the error |
| Rate limited (429) | Wait and retry — default limit is 100 requests per 60 seconds |
