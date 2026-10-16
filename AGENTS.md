# Loopwise Skills Repo

Distribution repo for Loopwise agent skills. One repo, two install channels:

- **skills.sh** — `npx skills add Loopwise/skills` discovers every `skills/*/SKILL.md`.
- **Claude Code plugin** — `.claude-plugin/marketplace.json` publishes one plugin,
  `loopwise@loopwise`, whose root is this repo. It loads every skill under `skills/`
  and connects the Loopwise MCP server.

## Layout

```
.claude-plugin/marketplace.json  # marketplace "loopwise", plugin "loopwise" (source "./")
skills/
  loopwise/        # MCP skill: site management via mcp.loopwise.com
    references/data-model.md
  loopwise-cli/    # CLI skill (bot-synced, see below)
  loopwise-sdk/    # SDK skill: browser code inside a Loopwise Page (@loopwise/sdk)
  <new-skill>/     # any new directory is picked up by both channels
scripts/check.mjs  # the gate CI runs; run it before pushing
install.md         # human setup guide, linked from SKILL.md files by absolute URL
```

## Rules

- `name:` in a SKILL.md must equal its directory name and be unique. skills.sh installs
  by name, so a duplicate silently drops a skill.
- Top-level frontmatter is limited to fields Claude Code reads (see `FIELDS` in
  `scripts/check.mjs`); put anything else under `metadata:`.
- Links in a SKILL.md must not leave its own directory (`../`); skills.sh copies only
  that directory. Use `https://github.com/Loopwise/skills/blob/main/...`.
- Never add a root `SKILL.md`: skills.sh would stop looking under `skills/`.
- Don't add `version` to `marketplace.json`: without it, Claude Code users receive
  every commit on `main` when they update.
- Don't list skills in `marketplace.json`; the plugin auto-discovers `skills/`.

## skills/loopwise-cli is generated

`skills/loopwise-cli/SKILL.md` is copied from `packages/cli/SKILL.md` in
`kaikhq/manekineko` by the `sync-skills` job of `publish-loopwise-cli.yml` on each CLI
release. Edit it there; an edit here is overwritten on the next release.

## Verify

```bash
node scripts/check.mjs          # frontmatter + claude plugin validate + npx skills add
node scripts/check.mjs --fast   # frontmatter only, offline
claude --plugin-dir .           # try the plugin in a session without installing
```
