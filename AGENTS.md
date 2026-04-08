# Loopwise Skills Repo

Distribution repo for Loopwise agent skills. Skills are synced from
[kaikhq/manekineko](https://github.com/kaikhq/manekineko) `apps/mcp/AGENT.md`
on each MCP server release.

For installation, see [install.md](install.md).

## Key constraints

- **Do not edit skills here directly.** Edit in `kaikhq/manekineko apps/mcp/`
  and let the sync publish them. Manual edits will be overwritten on the next release.
- `.managed-skills` tracks which skill directories are owned by the sync script.
  Don't edit it manually.
- Non-skill files (README, AGENTS.md, install.md) are safe to edit directly —
  the sync only touches `skills/` and `.managed-skills`.

## Repo structure

```
skills/
  loopwise/
    SKILL.md                # Synced from manekineko apps/mcp/
    references/
      data-model.md         # Entity relationships
.managed-skills             # Auto-generated manifest
install.md                  # MCP setup instructions
```
