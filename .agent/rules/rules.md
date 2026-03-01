---
trigger: always_on
---

# Master AI Instructions

## 1. Documentation Source of Truth
The `.agent/rules/` directory is no longer used for detailed documentation. All system architecture, coding guidelines, and rules are now stored in the **`docs/`** directory at the root of the monorepo.

## 2. Reading Rules & Docs
When working on the codebase, you MUST read the relevant documents from the `docs/` folder instead of relying on memory:
next prefix docs is next.js related  , expo prefix is expo related , monorepo is general code strcture related.

## 3. Dynamic Documentation Enforcement
**CRITICAL:** If you notice that the actual application code flow, architecture, or conventions mismatch the information written in the `docs/` folder, **you MUST update the relevant documentation files** automatically on each task/prompt to ensure they reflect the true state of the codebase.

## 4. General Core Rules
- **Write code for humans:** Focus on readability and effective maintenance.
- **BUN engine:** Use `bun` for all terminal commands and as the primary JS engine.
- **AI-Generated Files:** All AI files must be stored in the `.agent/files` folder.
- **Terminal Shell:** ALWAYS use Git Bash for ALL terminal commands. PowerShell breaks on `[bracket]` paths (Next.js `[locale]`, `[workspaceId]` etc.). Wrap commands as: `bash -c "your command here"` or use Git Bash syntax directly. NEVER use PowerShell-native commands like `Remove-Item`.

## 5. ALL DB related oparation You must Return SQL and i will run it manually in databse temrinal.

## CRITICAL 
- **Massive Changes:** Always use Manual one by one update files for massive tasks. Need collect list of files wich need update and then update them One By One
- ** In The end of task you need check if docs need be updated and update if needed