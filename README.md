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
- **loopwise-sdk** — Write the code inside a Loopwise Page with `@loopwise/sdk`: show courses, read the signed-in member, and let members review a course from your own UI.

## Which one should I use?

| | loopwise (MCP) | loopwise-cli | loopwise-sdk |
|---|---|---|---|
| Interface | MCP (Model Context Protocol) | Shell commands | Browser JavaScript |
| Setup | Add MCP server URL to your agent | `npm install -g loopwise` | `npm install @loopwise/sdk@0.1.0-beta.5`, or load it from a CDN |
| Best for | Data queries, site management | Page deployment, CI/CD | What a page does for its visitors |
| Requires | MCP-compatible agent | Agent with shell access | A page served on the site's domain |

The first two manage the site; `loopwise-sdk` is the code you deploy with them. Install the full skill set and let your agent pick the right tool.

## Compatibility

Works with any agent that supports the [Agent Skills](https://agentskills.io) standard:

- Claude Code
- Cursor
- OpenAI Codex
- Gemini CLI
- VS Code / GitHub Copilot
- And [many more](https://agentskills.io)
