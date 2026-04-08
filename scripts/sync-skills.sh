#!/usr/bin/env bash
# Sync skills from kaikhq/manekineko to this distribution repo.
# Run from the skills repo root:
#   ./scripts/sync-skills.sh /path/to/manekineko
#
# In CI, clone both repos and run this script, then commit + push if changed.

set -euo pipefail

MANEKINEKO_ROOT="${1:?Usage: sync-skills.sh /path/to/manekineko}"
SKILLS_DIR="skills/loopwise"
REFS_DIR="$SKILLS_DIR/references"

# Ensure source files exist
AGENT_MD="$MANEKINEKO_ROOT/apps/mcp/AGENT.md"
DATA_MODEL_SRC="$MANEKINEKO_ROOT/apps/mcp/src/resources/data-model.ts"

if [[ ! -f "$AGENT_MD" ]]; then
  echo "Error: $AGENT_MD not found" >&2
  exit 1
fi

# Extract version from package.json
VERSION=$(jq -r '.version // "0.0.0"' "$MANEKINEKO_ROOT/apps/mcp/package.json" 2>/dev/null || echo "0.0.0")

echo "Syncing loopwise skill (MCP server v$VERSION)..."

# Update version in SKILL.md frontmatter
if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' "s/version: \".*\"/version: \"$VERSION\"/" "$SKILLS_DIR/SKILL.md"
else
  sed -i "s/version: \".*\"/version: \"$VERSION\"/" "$SKILLS_DIR/SKILL.md"
fi

echo "Done. Review changes with 'git diff' before committing."
