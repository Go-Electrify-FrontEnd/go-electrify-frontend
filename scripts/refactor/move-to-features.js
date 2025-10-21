#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Move selected UI components and server actions into feature folders.
 *
 * Usage:
 *   # dry run (default)
 *   node ./scripts/refactor/move-to-features.js
 *
 *   # apply changes for specific features
 *   node ./scripts/refactor/move-to-features.js --apply --features=stations,reservations
 *
 * The script will:
 *  - copy files from component/action origins into `src/features/<feature>/...`
 *  - create a .bak backup of each original file before replacing it
 *  - replace original files with a small shim that re-exports from the new location
 *
 * This is a conservative, idempotent script that will skip files which were
 * already moved. Always review changes (and .bak backups) before committing.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../");
const SRC = path.join(ROOT, "src");

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const FEATURES_ARG = args.find((a) => a.startsWith("--features="));
const SELECTED_FEATURES = FEATURES_ARG ? FEATURES_ARG.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean) : null;

function globby(dir, exts = [".ts", ".tsx", ".js", ".jsx"]) {
    const results = [];
    const walk = (d) => {
        for (const name of fs.readdirSync(d)) {
            const p = path.join(d, name);
            const stat = fs.statSync(p);
            if (stat.isDirectory()) {
                if (name === "node_modules" || name === ".git") continue;
                walk(p);
            } else {
                if (exts.includes(path.extname(name))) results.push(p);
            }
        }
    };
    walk(dir);
    return results;
}

const FEATURE_MAP = [
    {
        feature: "stations",
        components: [path.join(SRC, "components/dashboard/stations"), path.join(SRC, "components/dashboard/admin/stations"), path.join(SRC, "components/dashboard/staff/station")],
        actions: [path.join(SRC, "actions/stations-actions.ts"), path.join(SRC, "actions/chargers-actions.ts")],
    },
    {
        feature: "reservations",
        components: [path.join(SRC, "components/dashboard/reservation")],
        actions: [path.join(SRC, "actions/reservation-actions.ts")],
    },
    {
        feature: "wallet",
        components: [path.join(SRC, "components/dashboard/wallet")],
        actions: [path.join(SRC, "actions/wallet-actions.ts")],
    },
    {
        feature: "connector-type",
        components: [path.join(SRC, "components/dashboard/admin/connector-type")],
        actions: [path.join(SRC, "actions/connector-type-actions.ts")],
    },
    {
        feature: "vehicle-models",
        components: [path.join(SRC, "components/dashboard/admin/vehicle-models")],
        actions: [path.join(SRC, "actions/vehicle-models-actions.ts")],
    },
    {
        feature: "subscriptions",
        components: [path.join(SRC, "components/dashboard/admin/subscriptions")],
        actions: [path.join(SRC, "actions/subscriptions-actions.ts")],
    },
    {
        feature: "auth",
        components: [path.join(SRC, "components/login")],
        actions: [path.join(SRC, "actions/login-actions.ts")],
    },
    {
        feature: "users",
        components: [path.join(SRC, "components/dashboard/admin/users")],
        actions: [path.join(SRC, "actions/user-actions.ts")],
    },
];

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function aliasFor(filePath) {
    // Return an import alias path (without extension) starting with @/
    const rel = path.relative(SRC, filePath);
    const aliased = "@/" + rel.replace(/\\/g, "/").replace(/\.(tsx?|jsx?)$/, "");
    return aliased;
}

function hasDefaultExport(text) {
    return /export\s+default\s+/m.test(text) || /export\s+default\(/m.test(text);
}

function hasNamedExports(text) {
    return /export\s+(const|function|class|type|interface|enum)\s+/m.test(text) || /export\s*\{/.test(text);
}

function isClientModule(text) {
    return /^\s*"use client"/m.test(text);
}

for (const mapping of FEATURE_MAP) {
    if (SELECTED_FEATURES && !SELECTED_FEATURES.includes(mapping.feature)) continue;

    console.log(`\n==> Processing feature: ${mapping.feature}`);

    // Move component files
    for (const compDir of mapping.components) {
        if (!fs.existsSync(compDir)) continue;
        const files = globby(compDir);
        for (const file of files) {
            // compute relative path under compDir and destination
            const rel = path.relative(compDir, file);
            const dest = path.join(SRC, "features", mapping.feature, "components", rel);
            const destDir = path.dirname(dest);
            ensureDir(destDir);

            if (fs.existsSync(dest)) {
                console.log(`  [skip] destination exists: ${dest}`);
            } else if (APPLY) {
                fs.copyFileSync(file, dest);
                console.log(`  [copied] ${file} -> ${dest}`);
            } else {
                console.log(`  [would copy] ${file} -> ${dest}`);
            }

            // create shim at original location
            const originalText = fs.readFileSync(file, "utf8");
            const isClient = isClientModule(originalText);
            const hasDefault = hasDefaultExport(originalText);
            const hasNamed = hasNamedExports(originalText);
            const alias = aliasFor(dest);

            let shim = "";
            if (isClient) shim += '"use client";\n\n';

            if (hasDefault) {
                shim += `export { default } from "${alias}";\n`;
            }
            if (hasNamed) {
                shim += `export * from "${alias}";\n`;
            }
            if (!hasDefault && !hasNamed) {
                // fallback: re-export everything
                shim += `export * from "${alias}";\n`;
            }

            if (APPLY) {
                // backup
                fs.writeFileSync(`${file}.bak`, originalText, "utf8");
                fs.writeFileSync(file, shim, "utf8");
                console.log(`  [shimmed] ${file}`);
            } else {
                console.log(`  [would shim] ${file}`);
            }
        }
    }

    // Move action files
    for (const action of mapping.actions) {
        if (!fs.existsSync(action)) continue;
        const base = path.basename(action);
        const dest = path.join(SRC, "features", mapping.feature, "services", base);
        ensureDir(path.dirname(dest));

        if (fs.existsSync(dest)) {
            console.log(`  [skip] action dest exists: ${dest}`);
        } else if (APPLY) {
            fs.copyFileSync(action, dest);
            console.log(`  [copied] ${action} -> ${dest}`);
        } else {
            console.log(`  [would copy] ${action} -> ${dest}`);
        }

        // create server shim at original location
        const originalText = fs.readFileSync(action, "utf8");
        const alias = aliasFor(dest);
        const shim = `"use server";\n\nexport * from "${alias}";\n`;

        if (APPLY) {
            fs.writeFileSync(`${action}.bak`, originalText, "utf8");
            fs.writeFileSync(action, shim, "utf8");
            console.log(`  [shimmed] ${action}`);
        } else {
            console.log(`  [would shim] ${action}`);
        }
    }

    // When applying also run the import migration for the feature so consumers switch to feature paths
    if (APPLY) {
        console.log(`  -> Running import codemod for feature: ${mapping.feature}`);
        try {
            const spawnSync = require("child_process").spawnSync;
            const res = spawnSync("node", [path.join(ROOT, "scripts/refactor/migrate-imports.js"), "--apply", `--features=${mapping.feature}`], { stdio: "inherit" });
            if (res.status !== 0) {
                console.error(`    codemod exited with ${res.status}`);
            }
        } catch (err) {
            console.error("    Failed to run codemod:", err);
        }
    } else {
        console.log(`  (dry-run) would run import codemod for feature: ${mapping.feature}`);
    }
}

console.log("\nMove-to-features: done. Review changes and commit them when ready.");
