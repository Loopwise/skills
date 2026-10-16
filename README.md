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
