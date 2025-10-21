#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../');
const SRC = path.join(ROOT, 'src');

function globby(dir, exts = ['.ts', '.tsx', '.js', '.jsx']) {
    const results = [];
    const walk = (d) => {
        for (const name of fs.readdirSync(d)) {
            const p = path.join(d, name);
            const stat = fs.statSync(p);
            if (stat.isDirectory()) {
                if (name === 'node_modules' || name === '.git') continue;
                walk(p);
            } else {
                if (exts.includes(path.extname(name))) results.push(p);
            }
        }
    };
    walk(dir);
    return results;
}

function findShims() {
    const candidates = [];
    const files = globby(path.join(SRC, 'components', 'dashboard'));
    const shimRegex = /export\s+(?:\*|\{\s*default\s*\})\s+from\s+(['"])@(\/features\/[^'\"]+)\1/;

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const match = shimRegex.exec(content);
        if (match) {
            const featurePath = match[2]; // e.g. /features/stations/components/...
            // Original shim path to search for (the file itself as an import path)
            const relPath = path.relative(SRC, file).replace(/\\\\/g, '/');
            const importSpecifier = `@/` + relPath.replace(/\.tsx?$/, '');
            candidates.push({ file, importSpecifier, featurePath, content });
        }
    }
    return candidates;
}

function repoSearchLiteral(literal) {
    const files = globby(SRC);
    let count = 0;
    for (const f of files) {
        const txt = fs.readFileSync(f, 'utf8');
        if (txt.includes(literal)) {
            count++;
        }
    }
    return count;
}

function main() {
    const shims = findShims();
    const results = [];
    for (const shim of shims) {
        const occurrences = repoSearchLiteral(shim.importSpecifier);
        // occurrences includes the shim file itself; we'll subtract 1 for that
        const externalRefs = Math.max(0, occurrences - 1);
        results.push({ shimFile: shim.file, importSpecifier: shim.importSpecifier, featurePath: shim.featurePath, externalRefs });
    }

    const unreferenced = results.filter(r => r.externalRefs === 0);
    console.log('Found', results.length, 'shims under src/components/dashboard.');
    console.log('Unreferenced shims (safe-to-remove candidates):', unreferenced.length);
    for (const r of unreferenced) {
        console.log(' -', r.shimFile, '->', r.importSpecifier, '(', r.featurePath, ')');
    }

    // Print a short summary of other shims that still have external refs
    const referenced = results.filter(r => r.externalRefs > 0);
    if (referenced.length) {
        console.log('\nShims with external references (not safe to remove yet):');
        for (const r of referenced) {
            console.log(' -', r.shimFile, 'refs:', r.externalRefs);
        }
    }

    // exit code 0 always; this is only a report when running in CI you may want non-zero
}

if (require.main === module) main();
