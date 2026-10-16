#!/usr/bin/env node
// Checks that this repo installs cleanly through both channels:
//   - skills.sh (`npx skills add Loopwise/skills`)
//   - Claude Code (`claude plugin install loopwise@loopwise`)
//
//   $ node scripts/check.mjs           all checks
//   $ node scripts/check.mjs --fast    frontmatter only (offline)
//
// Every failure prints the file, the problem, and the fix. Exit code is 1 on
// any failure. No dependencies beyond Node 20.11+ (and npx / claude when present).

import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// The skills.sh CLI version CI installs with. Bump it deliberately, after checking
// `npx skills@latest add . --list` still finds every skill.
const SKILLS_CLI = "1.7.2";

const root = resolve(import.meta.dirname, "..");
const fast = process.argv.includes("--fast");
const failures = [];
const fail = (where, problem, fix) => failures.push({ where, problem, fix });
const ok = (msg) => console.log(`✔ ${msg}`);

// Top-level frontmatter fields Claude Code reads (https://code.claude.com/docs/en/skills).
// Anything else is silently ignored by Claude Code; put custom data under `metadata`.
const FIELDS = new Set([
  "name", "description", "when_to_use", "argument-hint", "arguments",
  "disable-model-invocation", "user-invocable", "allowed-tools", "disallowed-tools",
  "model", "effort", "context", "agent", "background", "hooks", "paths", "shell",
  "metadata", "license", "compatibility",
]);

// 1. Skill frontmatter -------------------------------------------------------
const skillDirs = readdirSync(join(root, "skills"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const names = new Map();
for (const dir of skillDirs) {
  const file = `skills/${dir}/SKILL.md`;
  if (!existsSync(join(root, file))) {
    fail(`skills/${dir}/`, "directory has no SKILL.md", "add SKILL.md or remove the directory");
    continue;
  }
  const text = readFileSync(join(root, file), "utf8").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---(\n|$)/);
  if (!m) {
    fail(file, "no YAML frontmatter", "start the file with ---\\nname: ...\\ndescription: ...\\n---");
    continue;
  }
  const keys = [...m[1].matchAll(/^([A-Za-z_][\w-]*):/gm)].map((k) => k[1]);
  for (const key of keys) {
    if (!FIELDS.has(key)) {
      fail(file, `unknown top-level field \`${key}\` (Claude Code ignores it)`, `move it under \`metadata:\``);
    }
  }
  const name = m[1].match(/^name:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, "");
  if (name !== dir) {
    fail(file, `name is \`${name}\`, directory is \`${dir}\``,
      "set `name:` to the directory name; skills.sh installs by name, so a mismatch or duplicate silently drops a skill");
  }
  if (names.has(name)) fail(file, `duplicate skill name \`${name}\` (also ${names.get(name)})`, "give each skill a unique name");
  names.set(name, file);
  if (!/^description:\s*\S/m.test(m[1])) fail(file, "missing description", "add a description that says what the skill does and when to use it");
  // skills.sh copies only the skill directory, so links must not leave it.
  for (const link of text.matchAll(/\]\((\.\.\/[^)]*)\)/g)) {
    fail(file, `relative link \`${link[1]}\` leaves the skill directory`, "use an absolute https://github.com/Loopwise/skills/... URL");
  }
}
if (existsSync(join(root, "SKILL.md"))) {
  fail("SKILL.md", "a root SKILL.md shadows every skill under skills/ in skills.sh", "remove it");
}
ok(`frontmatter: ${skillDirs.length} skills (${skillDirs.join(", ")})`);

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });
const has = (cmd) => { try { run("sh", ["-c", `command -v ${cmd}`]); return true; } catch { return false; } };

if (!fast) {
  // 2. Claude Code plugin manifest ------------------------------------------
  if (has("claude")) {
    try {
      run("claude", ["plugin", "validate", root, "--strict"]);
      ok("claude plugin validate --strict");
    } catch (e) {
      fail(".claude-plugin/marketplace.json", `claude plugin validate failed:\n${e.stdout}${e.stderr}`, "fix the reported fields");
    }
  } else {
    console.log("… skipped claude plugin validate (install: npm i -g @anthropic-ai/claude-code)");
  }

  // 3. The bundled MCP server answers like an MCP endpoint ------------------
  // An unauthenticated MCP request must get 401 + WWW-Authenticate (which starts
  // the OAuth flow), not 404: a wrong path looks fine until a user connects.
  const manifest = JSON.parse(readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"));
  for (const plugin of manifest.plugins) {
    for (const [name, server] of Object.entries(plugin.mcpServers ?? {})) {
      try {
        const res = await fetch(server.url, {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "loopwise-skills-check", version: "0" } } }),
          signal: AbortSignal.timeout(15_000),
        });
        if (res.status === 401 && res.headers.get("www-authenticate")) ok(`MCP ${name}: ${server.url} asks for OAuth`);
        else fail(".claude-plugin/marketplace.json", `MCP ${name} at ${server.url} answered ${res.status} (want 401 + WWW-Authenticate)`, "point url at the server's MCP endpoint; mcp.loopwise.com serves it at the root, not /mcp");
      } catch (e) {
        fail(".claude-plugin/marketplace.json", `MCP ${name} at ${server.url} unreachable: ${e.message}`, "check the URL and network");
      }
    }
  }

  // 4. skills.sh: install every skill into a scratch project and compare ----
  const tmp = mkdtempSync(join(tmpdir(), "skills-check-"));
  try {
    const out = run("npx", ["-y", `skills@${SKILLS_CLI}`, "add", root, "--skill", "*", "-a", "claude-code", "-y", "--copy", "--json"], { cwd: tmp });
    const installed = JSON.parse(out).filter((r) => r.status === "installed").map((r) => r.name).sort();
    if (installed.join() === skillDirs.join()) ok(`npx skills add: installed ${installed.length}/${skillDirs.length}`);
    else fail("skills/", `npx skills add installed [${installed}] but the repo has [${skillDirs}]`, "check names and frontmatter above");
  } catch (e) {
    fail("skills/", `npx skills add failed: ${e.message}\n${e.stderr ?? ""}`, "run the command by hand to see the error");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

for (const f of failures) console.error(`✘ ${f.where}: ${f.problem}\n  fix: ${f.fix}`);
if (failures.length) process.exit(1);
console.log("All checks passed.");
