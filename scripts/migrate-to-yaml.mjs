#!/usr/bin/env node
/**
 * One-shot migration: convert per-entry MD files in src/content/<collection>/
 * to a single YAML data file at src/data/<collection>.yaml.
 *
 * Run once:  node scripts/migrate-to-yaml.mjs
 *
 * Wiki stays as MD (it has real body content).
 */
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const DATA_DIR = path.join(ROOT, 'src', 'data');

const COLLECTIONS = ['papers', 'members', 'alumni', 'news', 'awards', 'themes', 'press', 'sponsors'];

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\s*([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2].trim() };
}

function toYaml(value, indent = 0) {
  const pad = '  '.repeat(indent);
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    // Quote strings containing special chars, newlines, or starting w/ special yaml chars
    if (
      value === '' ||
      /[":#&*!|>'%@`,\[\]{}]/.test(value) ||
      /[\n]/.test(value) ||
      /^[-?]/.test(value) ||
      /^(true|false|null|yes|no|on|off)$/i.test(value) ||
      /^\s|\s$/.test(value) ||
      /^[0-9]+(\.[0-9]+)?$/.test(value)
    ) {
      // Use double quotes, escape \\ and "
      const esc = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `"${esc}"`;
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Inline short arrays of strings/numbers
    if (value.every((v) => typeof v === 'string' || typeof v === 'number') && value.length <= 6) {
      return `[${value.map((v) => toYaml(v, 0)).join(', ')}]`;
    }
    return value
      .map((v) => {
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          const inner = Object.entries(v)
            .map(([k, vv], i) => (i === 0 ? `- ${k}: ${toYaml(vv, indent + 2)}` : `${pad}  ${k}: ${toYaml(vv, indent + 2)}`))
            .join('\n');
          return `${pad}${inner}`;
        }
        return `${pad}- ${toYaml(v, indent)}`;
      })
      .join('\n');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    return entries
      .map(([k, v]) => {
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return `${pad}${k}:\n${toYaml(v, indent + 1)}`;
        }
        if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') {
          return `${pad}${k}:\n${toYaml(v, indent + 1)}`;
        }
        return `${pad}${k}: ${toYaml(v, indent)}`;
      })
      .join('\n');
  }
  return String(value);
}

// Manual YAML-ish parser for our flat frontmatter (no need for full YAML lib)
function parseFmBlock(fmText) {
  const out = {};
  const lines = fmText.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('#')) { i++; continue; }
    const indent = line.length - line.trimStart().length;
    if (indent > 0) { i++; continue; } // nested handled below
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) { i++; continue; }
    const key = line.slice(0, colonIdx).trim();
    let raw = line.slice(colonIdx + 1).trim();
    if (raw === '' || raw === '|' || raw === '>') {
      // multi-line — collect indented following lines as nested object/array
      const nested = [];
      i++;
      while (i < lines.length) {
        const nl = lines[i];
        if (!nl.trim()) { nested.push(''); i++; continue; }
        const nlIndent = nl.length - nl.trimStart().length;
        if (nlIndent === 0) break;
        nested.push(nl);
        i++;
      }
      // Try to parse as array of objects: each entry starts with "  - key: value"
      if (nested.some((n) => /^\s*-\s/.test(n))) {
        out[key] = parseNestedArray(nested);
      } else {
        // nested key:val map
        out[key] = parseNestedObject(nested);
      }
      continue;
    }
    // inline value
    if (raw.startsWith('[') && raw.endsWith(']')) {
      const inner = raw.slice(1, -1).trim();
      if (!inner) { out[key] = []; }
      else {
        out[key] = inner.split(',').map((s) => stripQuotes(s.trim()));
      }
    } else if (raw === 'true') out[key] = true;
    else if (raw === 'false') out[key] = false;
    else if (/^-?[0-9]+$/.test(raw)) out[key] = Number(raw);
    else out[key] = stripQuotes(raw);
    i++;
  }
  return out;
}

function stripQuotes(s) {
  if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  return s;
}

function parseNestedArray(lines) {
  const items = [];
  let current = null;
  for (const line of lines) {
    const t = line.trimStart();
    if (t.startsWith('- ')) {
      if (current) items.push(current);
      current = {};
      const rest = t.slice(2);
      const ci = rest.indexOf(':');
      if (ci !== -1) {
        const k = rest.slice(0, ci).trim();
        current[k] = stripQuotes(rest.slice(ci + 1).trim());
      }
    } else if (current && t.includes(':')) {
      const ci = t.indexOf(':');
      const k = t.slice(0, ci).trim();
      current[k] = stripQuotes(t.slice(ci + 1).trim());
    }
  }
  if (current) items.push(current);
  return items;
}

function parseNestedObject(lines) {
  const out = {};
  for (const line of lines) {
    const t = line.trim();
    if (!t || !t.includes(':')) continue;
    const ci = t.indexOf(':');
    const k = t.slice(0, ci).trim();
    out[k] = stripQuotes(t.slice(ci + 1).trim());
  }
  return out;
}

async function migrate(collection) {
  const dir = path.join(CONTENT_DIR, collection);
  let files;
  try {
    files = await readdir(dir);
  } catch {
    console.log(`  ${collection}: no directory, skip`);
    return;
  }
  const entries = [];
  for (const f of files.sort()) {
    if (!f.endsWith('.md')) continue;
    const text = await readFile(path.join(dir, f), 'utf8');
    const parsed = parseFrontmatter(text);
    if (!parsed) continue;
    const id = f.replace(/\.md$/, '');
    const data = parseFmBlock(parsed.fm);
    entries.push({ id, ...data });
  }
  if (entries.length === 0) {
    console.log(`  ${collection}: no entries`);
    return;
  }
  const yaml = entries.map((e) => '- ' + toYaml(e, 1).trimStart()).join('\n\n');
  const outPath = path.join(DATA_DIR, `${collection}.yaml`);
  await writeFile(outPath, yaml + '\n');
  console.log(`  ${collection}: wrote ${entries.length} entries → src/data/${collection}.yaml`);
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  console.log('Migrating MD → YAML…');
  for (const c of COLLECTIONS) {
    await migrate(c);
  }
  console.log('\nDone. Old MD directories are intact — delete manually after verifying:');
  for (const c of COLLECTIONS) {
    console.log(`  rm -rf src/content/${c}/`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
