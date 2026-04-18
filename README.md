# Loopwise Agent Skills

Agent skills for managing [Loopwise](https://loopwise.com) sites.

## Install

```bash
npx skills add loopwise/skills
```

See [install.md](install.md) for full setup instructions.

## What's included

- **loopwise** — Manage your site via MCP: courses, members, orders, events, pages, settings, and more.
- **loopwise-cli** — Deploy pages and query data via the `loopwise` CLI.

## Which one should I use?

| | loopwise (MCP) | loopwise-cli |
|---|---|---|
| Interface | MCP (Model Context Protocol) | Shell commands |
| Setup | Add MCP server URL to your agent | `npm install -g loopwise` |
| Best for | Data queries, site management | Page deployment, CI/CD |
| Requires | MCP-compatible agent | Agent with shell access |

Most agents support both. Install the full skill set and let your agent pick the right tool.

## Compatibility

Works with any agent that supports the [Agent Skills](https://agentskills.io) standard:

- Claude Code
- Cursor
- OpenAI Codex
- Gemini CLI
- VS Code / GitHub Copilot
- And [many more](https://agentskills.io)
