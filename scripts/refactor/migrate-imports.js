#!/usr/bin/env node
/*
  Generic codemod to migrate alias imports (starting with @/) to new feature-based
  paths. This script only replaces module specifiers that appear inside string
  literals (e.g. import '...'; import x from '...'; export ... from '...'; require('...'); import('...')).

  Usage:
    # dry run (default) — shows changes but does not write files
    node ./scripts/refactor/migrate-imports.js

    # apply changes and create .bak backups
    node ./scripts/refactor/migrate-imports.js --apply

    # apply without backups
    node ./scripts/refactor/migrate-imports.js --apply --no-backup

  Notes:
  - The mapping table below contains common patterns for features already migrated
    (stations, users). Add or adjust entries for additional features before running
    the script with --apply.
  - The script is intentionally conservative and only touches string literals
    beginning with "@/" to avoid accidental replacements in comments or arbitrary
    runtime strings that do not represent module specifiers.
*/

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../");
const SRC = path.join(ROOT, "src");

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const BACKUP = !args.includes("--no-backup");
const VERBOSE = args.includes("--verbose");

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

// Mapping table — extend this list for more features. Keys are RegExp patterns
// that will be tested against a module specifier string (e.g. "@/components/...").
// If a mapping matches, the pattern's replacement will be applied to the specifier
// using String.prototype.replace(from, to).
const mappings = [
    // Stations feature
    { feature: "stations", from: /@\/components\/dashboard\/stations\//g, to: "@/features/stations/components/" },
    { feature: "stations", from: /@\/actions\/stations-actions/g, to: "@/features/stations/services/stations" },
    { feature: "stations", from: /@\/contexts\/charger-update-context/g, to: "@/features/stations/contexts/charger-update-context" },

    // Users feature
    { feature: "users", from: /@\/components\/dashboard\/admin\/users\//g, to: "@/features/users/components/" },
    { feature: "users", from: /@\/actions\/user-actions/g, to: "@/features/users/services/users" },
    { feature: "users", from: /@\/contexts\/user-context/g, to: "@/features/users/contexts/user-context" },

    // Wallet (example mapping — add the feature folder before applying)
    { feature: "wallet", from: /@\/components\/dashboard\/wallet\//g, to: "@/features/wallet/components/" },
    { feature: "wallet", from: /@\/actions\/wallet-actions/g, to: "@/features/wallet/services/wallet" },
    // Admin / staff dashboard admin-component mappings
    { feature: "stations", from: /@\/components\/dashboard\/admin\/stations\//g, to: "@/features/stations/components/" },
    { feature: "stations", from: /@\/components\/dashboard\/staff\/station\//g, to: "@/features/stations/components/" },
    { feature: "vehicle-models", from: /@\/components\/dashboard\/admin\/vehicle-models\//g, to: "@/features/vehicle-models/components/" },
    { feature: "subscriptions", from: /@\/components\/dashboard\/admin\/subscriptions\//g, to: "@/features/subscriptions/components/" },
    { feature: "connector-type", from: /@\/components\/dashboard\/admin\/connector-type\//g, to: "@/features/connector-type/components/" },
    { feature: "users", from: /@\/components\/dashboard\/admin\/users\//g, to: "@/features/users/components/" },
    { feature: "reservations", from: /@\/components\/dashboard\/reservation\//g, to: "@/features/reservations/components/" },
];

function applyMappingsToSpecifier(spec) {
    let out = spec;
    for (const m of mappings) {
        if (m.from.test(spec)) {
            out = out.replace(m.from, m.to);
        }
    }
    return out;
}

// Parse optional --features=comma,separated list to limit which mappings are applied
const featuresArg = args.find((a) => a.startsWith("--features="));
const selectedFeatures = featuresArg ? featuresArg.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean) : null;

if (selectedFeatures) {
    console.log(`Running mappings for features: ${selectedFeatures.join(", ")}`);
}

const files = globby(SRC);
let changedFiles = 0;
let totalReplacements = 0;

for (const file of files) {
    const original = fs.readFileSync(file, "utf8");
    // Only change specifiers inside string literals that start with @/
    const specifierRegex = /(['"])(@\/[^'\"]+?)\1/g;
    let replacementsInFile = 0;

    // Only apply mappings that match the selected features (if provided)
    const applyMappingsToSpecifierWithFilter = (spec) => {
        let out = spec;
        for (const m of mappings) {
            if (selectedFeatures && !selectedFeatures.includes(m.feature)) continue;
            if (m.from.test(spec)) {
                out = out.replace(m.from, m.to);
            }
        }
        return out;
    };

    const updated = original.replace(specifierRegex, (full, quote, spec) => {
        const mapped = applyMappingsToSpecifierWithFilter(spec);
        if (mapped !== spec) {
            replacementsInFile++;
            if (VERBOSE) {
                console.log(`  [map] ${file}: ${spec} -> ${mapped}`);
            }
            return quote + mapped + quote;
        }
        return full;
    });

    if (replacementsInFile > 0 && updated !== original) {
        if (APPLY) {
            if (BACKUP) {
                fs.writeFileSync(`${file}.bak`, original, "utf8");
            }
            fs.writeFileSync(file, updated, "utf8");
            console.log(`Updated ${file} (${replacementsInFile} replacement(s))`);
        } else {
            console.log(`Would update ${file} (${replacementsInFile} replacement(s))`);
        }
        changedFiles++;
        totalReplacements += replacementsInFile;
    }
}

console.log(`\nSummary: ${changedFiles} file(s) would be updated, ${totalReplacements} replacement(s) found.`);
if (APPLY) {
    console.log(`Backups are stored next to modified files with the .bak extension (unless --no-backup).`);
    console.log("Review changes, run tests/build, and then remove backup files if everything is OK.");
} else {
    console.log("Dry-run complete. Rerun with --apply to make the changes.");
}
