---
name: loopwise-cli
description: >
  Deploy and manage pages, query courses, and execute GraphQL on the Loopwise
  platform via CLI. Use when the user wants to deploy a static site or Vite app,
  manage page deployments, list courses, or run ad-hoc GraphQL queries against
  their Loopwise school. Triggers on: "loopwise", "deploy page", "pages push",
  "loopwise pages", "static site deploy".
license: Proprietary
compatibility: Requires the loopwise CLI (npm install -g loopwise)
metadata:
  author: loopwise
  version: "0.0.7"
---

# Loopwise CLI

Authenticate, query, and manage resources on the Loopwise platform via the `loopwise` CLI.

## Setup

```bash
npm install -g loopwise
loopwise auth login
loopwise doctor --json   # verify everything works
```

For headless CI/agent environments:

```bash
export LOOPWISE_ACCESS_TOKEN="your_token"
```

## Rules

- Always use `--json` for machine-readable output.
- Always use `--dry-run` before mutating operations.
- Use `--jq` to limit response size and protect your context window.
- Follow the `next` breadcrumbs in JSON output for suggested next actions.
- Never deploy or mutate without confirming with the user first.

## Pages Workflow

```bash
# 1. Dry run first, then create
loopwise pages create landing --page-type static_page --path-prefix /landing --dry-run --json
loopwise pages create landing --page-type static_page --path-prefix /landing --json

# For Vite/React/Vue apps, use vite_app
loopwise pages create app --page-type vite_app --path-prefix /app --json

# 2. Deploy the build output directory
loopwise pages push ./dist --page landing --dry-run --json
loopwise pages push ./dist --page landing --json

# 3. Manage
loopwise pages list --json --jq .pages.nodes
loopwise pages promote <deployment-id> --json
loopwise pages rollback my-page --json
loopwise pages open my-page
```

## Querying Data

```bash
loopwise courses list --json
loopwise courses list --state published --jq .courses.nodes
loopwise graphql query -q '{ school { name } }' --json
```

## Introspection

```bash
loopwise commands       # full command catalog as JSON
loopwise doctor --json  # health check
```

## Commands

| Command | Mutating | Description |
|---------|----------|-------------|
| `auth login` | No | Authenticate via OAuth2 PKCE |
| `auth logout` | No | Clear stored credentials |
| `auth status` | No | Show current auth state |
| `auth validate` | No | Validate token and scopes |
| `courses list` | No | List courses |
| `graphql query` | Depends | Execute a GraphQL query |
| `pages list` | No | List all pages |
| `pages create <slug>` | Yes | Create a new page |
| `pages push <dir>` | Yes | Upload files to a page |
| `pages promote <id>` | Yes | Promote preview to live |
| `pages rollback <page>` | Yes | Roll back to previous deployment |
| `pages deployments <page>` | No | List deployment history |
| `pages open <page>` | No | Open page in browser |
| `doctor` | No | Check auth, API, school info, version |
| `commands` | No | Dump full command catalog as JSON |

## Constraints

- Page bundle must contain `index.html` at root. Maximum size: 5 MB.
- Page types: `static_page` or `vite_app`.
- Path prefix must start with `/`, use only letters, digits, `_`, or `-`.
- Page slugs must be unique within a school.
- All mutating commands support `--dry-run`.
