#!/usr/bin/env node
/*
  Simple codemod to migrate imports for the `stations` feature to the
  new feature-based paths.

  Usage:
    node ./scripts/refactor/migrate-station-imports.js

  This script performs safe textual replacements for import/export specifiers
  and writes files in-place. It creates a backup copy of each modified file
  at <file>.bak before changing it.
*/

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../");
const SRC = path.join(ROOT, "src");

const globby = (dir, exts = [".ts", ".tsx", ".js", ".jsx"]) => {
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
};

const mappings = [
    {
        // components under the old path -> feature components path
        from: /@\/components\/dashboard\/stations\//g,
        to: "@/features/stations/components/",
    },
    {
        // actions shim -> feature services
        from: /@\/actions\/stations-actions/g,
        to: "@/features/stations/services/stations",
    },
    {
        // charger update context
        from: /@\/contexts\/charger-update-context/g,
        to: "@/features/stations/contexts/charger-update-context",
    },
];

const files = globby(SRC);
let changedFiles = 0;
let totalReplacements = 0;

for (const file of files) {
    let text = fs.readFileSync(file, "utf8");
    let original = text;
    let replaced = 0;
    for (const map of mappings) {
        text = text.replace(map.from, (m) => {
            replaced++;
            return map.to;
        });
    }
    if (replaced > 0 && text !== original) {
        // create a backup
        fs.writeFileSync(`${file}.bak`, original, "utf8");
        fs.writeFileSync(file, text, "utf8");
        changedFiles++;
        totalReplacements += replaced;
        console.log(`Updated ${file} (${replaced} replacement(s))`);
    }
}

console.log(`\nSummary: ${changedFiles} file(s) updated, ${totalReplacements} replacement(s) applied.`);
console.log("Backups are stored with the .bak extension next to each modified file.");
console.log("Review changes, run tests/build, and then remove backup files if everything is OK.");
