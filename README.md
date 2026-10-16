# Loopwise Agent Skills

Agent skills and the MCP server for managing [Loopwise](https://loopwise.com) sites.

## Install

**Claude Code** — skills and the MCP server in one step:

```bash
claude plugin marketplace add Loopwise/skills
claude plugin install loopwise@loopwise
```

**Any other agent** (Cursor, Codex, Gemini CLI, Copilot, and [more](https://skills.sh)):

```bash
npx skills add Loopwise/skills
```

then connect the MCP server; see [install.md](install.md).

### Or let your agent install it

Paste this into your agent (Claude Code, Cursor, Codex, …) as is:

```text
Set up the Loopwise agent tools for me, then confirm each step worked.

1. Skills (and, on Claude Code, the MCP server):
   - If you are Claude Code, run:
       claude plugin marketplace add Loopwise/skills
       claude plugin install loopwise@loopwise
     Then tell me to restart Claude Code, open /mcp, select "loopwise" and choose
     Authenticate; I will finish the sign-in in my browser.
   - Otherwise run: npx skills add Loopwise/skills
     and add a remote MCP server named "loopwise" at https://mcp.loopwise.com
     (the root URL, not /mcp; Streamable HTTP, OAuth 2.0) in your MCP settings.
2. CLI (for deploying pages): npm install -g loopwise@latest (0.3.0 or later), then
   loopwise auth login (I will sign in), then loopwise doctor --json.
3. Read the loopwise, loopwise-cli and loopwise-sdk skills and follow them.
   If page code uses @loopwise/sdk, pin 0.1.0-beta.5 or later: member features
   need it, and the SDK is still in beta, so an exact pin keeps the page's API fixed.
4. Verify: call the MCP tool check_connection, and run loopwise doctor --json.
   Report what passed and what needs me.
```

For a ready-made task, see [prompts/](prompts/): for example
[members review a course on a Loopwise Page](prompts/course-reviews.md)
([繁體中文](prompts/course-reviews.zh-TW.md)).

## What's included

| Skill | Use it for | Needs |
|---|---|---|
| **loopwise** | Query and manage courses, members, orders, events, pages, settings | MCP server `https://mcp.loopwise.com` (bundled in the Claude Code plugin) |
| **loopwise-cli** | Deploy Loopwise Pages, query data, CI/CD | `npm install -g loopwise` |
| **loopwise-sdk** | The code inside a Loopwise Page: show courses, read the signed-in member, let members review a course | `@loopwise/sdk@0.1.0-beta.5` or later, page served on the site's domain |

The first two manage the site; `loopwise-sdk` is the code you deploy with them.
Install everything and let your agent pick the right tool.

## Updates

- Claude Code: `claude plugin update loopwise@loopwise`, or turn on auto-update under
  **Marketplaces** in `/plugin`.
- skills.sh: `npx skills update`.
