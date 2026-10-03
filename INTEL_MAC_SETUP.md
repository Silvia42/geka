# Intel Mac Environment Setup & Troubleshooting Guide

This document tracks the specific configuration steps required to get the development environment, package manager (`pnpm`), and code formatter (`Oxc`) working smoothly on an Intel-based MacBook Pro.

---

## ❌ What Was Not Working and Why

### 1. Homebrew Tier 3 Installation Failures

- **The Issue:** Running `brew install node` repeatedly crashed with folder access errors (`Permission denied`) and compilation errors (`Error: node: Cannot link openssl@3`).
- **The Why:** Homebrew officially dropped support for Intel architectures (`x86_64`) on newer macOS versions. Because it no longer builds pre-compiled binaries ("bottles") for Intel systems, it tries to compile packages from raw source code. During compilation, it clashed with legacy system files in `/usr/local/Cellar/` left behind by older versions, causing a total write block.

### 2. Oxc Extension Silent Failures

- **The Issue:** Modifying code in `App.tsx` and saving did not fix code indentations or spacing.
- **The Why:** The Oxc VS Code extension does not bundle its own compiler binaries. It depends on a local machine installation of `node`, `npm`, and `pnpm` to fetch the underlying executable (`oxfmt`). Because Node.js was completely missing from the system path, the extension could not start its background server.

---

## What Successfully Worked

To bypass the system limitations of the Intel Mac processor, we abandoned Homebrew for core runtime installations and manually configured the workspace root.

### Step 1: Clean Node.js Installation via Web Installer

Instead of compiling via the terminal, installing a pre-built binary package directly from the vendor completely avoided the permission blocks.

1. Downloaded the official **macOS Installer (.pkg)** for the stable LTS release from [nodejs.org](https://nodejs.org).
2. Ran the graphic installer package to automatically bind global system paths.
3. Verified the working versions in the terminal:
   ```bash
   node -v # Outputs: v24.21.0
   npm -v  # Outputs: 11.19.0
   ```

### Step 2: Workspace Realignment

VS Code cannot parse nested configuration files for format-on-save actions.

1. Opened the subproject folder **`GEKA`** directly as the absolute root directory in VS Code (`File > Open Folder...`).
2. Placed the `.vscode/settings.json` file explicitly at the top level of this opened space.

### Step 3: Package Manager Hydration

With a stable Node environment active, the target project packages could finally be installed.

1. Installed the global package manager wrapper:
   ```bash
   npm install -g pnpm
   ```
2. Ran the environment installation inside the `GEKA` directory root to link the formatting binaries:
   ```bash
   pnpm install
   ```

### Step 4: Forcing the Format Target

1. Appended `"editor.formatOnSaveMode": "file"` to `.vscode/settings.json` to force full-file compilation processing on save.
2. Restarted the background utility server via the VS Code Command Palette (`Cmd + Shift + P` -> `Oxc: Restart oxfmt Server`).
