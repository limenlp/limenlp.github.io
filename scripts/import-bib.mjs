#!/usr/bin/env node
/**
 * Parse a BibTeX file (e.g. exported from Google Scholar) and diff against
 * the current src/data/papers.yaml. For entries that aren't on the site yet,
 * print ready-to-paste YAML blocks (and optionally write them to a staging
 * file at scripts/missing-papers.yaml).
 *
 *   node scripts/import-bib.mjs scripts/jieyu-scholar.bib
 *   node scripts/import-bib.mjs my-papers.bib
 *   node scripts/import-bib.mjs my-papers.bib --write
 *   node scripts/import-bib.mjs my-papers.bib --only-year=2024,2025
 *
 * `--write` puts the suggested YAML in `scripts/missing-papers.yaml` so you
 *  can review and copy-paste into `src/data/papers.yaml`. The script never
 *  edits papers.yaml directly — that's a human decision.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PAPERS_YAML = path.join(ROOT, 'src', 'data', 'papers.yaml');
const STAGING_FILE = path.join(ROOT, 'scripts', 'missing-papers.yaml');

const args = process.argv.slice(2);
const bibPath = args.find((a) => !a.startsWith('--')) ?? 'scripts/jieyu-scholar.bib';
const WRITE = args.includes('--write');
const yearArg = args.find((a) => a.startsWith('--only-year='));
const onlyYears = yearArg ? new Set(yearArg.split('=')[1].split(',').map(Number)) : null;

function normTitle(s) {
  return (s ?? '').toLowerCase().replace(/[{}\\$]/g, '').replace(/texttt|backslash/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function shortTitle(s) {
  return normTitle((s ?? '').split(':')[0]);
}

function extractArxiv(s) {
  if (!s) return null;
  const m = String(s).match(/(\d{4}\.\d{4,6})/);
  return m ? m[1] : null;
}

function slugify(s) {
  return s.toLowerCase().replace(/[{}\\]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function stripBraces(s) {
  return s.replace(/^\{|\}$/g, '').replace(/[{}]/g, '').trim();
}

function parseAuthors(raw) {
  const parts = raw.split(/\s+and\s+/);
  return parts
    .map((p) => {
      p = p.trim();
      if (p.includes(',')) {
        const [last, first] = p.split(',', 2).map((s) => s.trim());
        return `${first} ${last}`;
      }
      return p;
    })
    .join(', ');
}

function parseBib(text) {
  const entries = [];
  const re = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const [, type, key] = m;
    const start = m.index + m[0].length;
    let depth = 1, i = start;
    while (i < text.length && depth > 0) {
      const c = text[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      i++;
    }
    const body = text.slice(start, i - 1);
    const fields = {};
    const fieldRe = /(\w+)\s*=\s*(\{(?:[^{}]|\{[^{}]*\})*\}|"[^"]*"|[^,\n]+)\s*,?/g;
    let fm;
    while ((fm = fieldRe.exec(body)) !== null) {
      const name = fm[1].toLowerCase();
      let val = fm[2].trim();
      val = stripBraces(val).replace(/\s+/g, ' ').trim();
      fields[name] = val;
    }
    entries.push({ type: type.toLowerCase(), key, ...fields });
  }
  return entries;
}

// Read papers.yaml and extract existing titles + arxiv IDs for diffing.
async function readLocalPapers() {
  const txt = await readFile(PAPERS_YAML, 'utf8');
  const titles = [];
  const arxivIds = [];
  const titleRe = /^\s+title:\s*(.+)$/gm;
  const paperUrlRe = /^\s+paperUrl:\s*(.+)$/gm;
  let m;
  while ((m = titleRe.exec(txt)) !== null) {
    titles.push(m[1].replace(/^"|"$/g, '').trim());
  }
  while ((m = paperUrlRe.exec(txt)) !== null) {
    const id = extractArxiv(m[1]);
    if (id) arxivIds.push(id);
  }
  return { titles, arxivIds };
}

function shouldSkip(entry) {
  const title = entry.title ?? '';
  const year = Number(entry.year) || 0;
  if (/^proceedings of (the )?/i.test(title)) return 'editor/proceedings';
  if (entry.type === 'phdthesis') return 'phd thesis';
  if (/^peer reviewed publications$/i.test(title)) return 'metadata stub';
  if (year > 0 && year < 2018) return `old paper (${year})`;
  return null;
}

function escapeYamlString(s) {
  // Always quote — safer when title has colons/quotes/etc.
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function stubYaml(entry) {
  const title = entry.title ?? 'Untitled';
  const authors = entry.author ? parseAuthors(entry.author) : 'TODO — fill in';
  const venue = entry.booktitle || entry.journal || 'Preprint';
  const venueClean = venue.replace(/^Proceedings of (the )?/i, '').trim();
  const year = Number(entry.year) || new Date().getFullYear();
  const status = /preprint|arxiv|e.prints/i.test(venue) ? 'preprint' : 'published';
  const arxivId = extractArxiv(venue) || extractArxiv(entry.eprint || '') || extractArxiv(entry.url || '');
  const id = `${year}-${slugify(title)}`;
  const lines = [
    `- id: ${id}`,
    `  title: ${escapeYamlString(title)}`,
    `  authors: ${escapeYamlString(authors)}`,
    `  venue: ${escapeYamlString(venueClean || venue)}`,
    `  year: ${year}`,
    `  status: ${status}`,
    `  tldr: "TODO — write a one-sentence summary"`,
  ];
  if (arxivId) lines.push(`  paperUrl: "https://arxiv.org/abs/${arxivId}"`);
  lines.push(`  themes: []`);
  return lines.join('\n');
}

async function main() {
  const absBib = path.isAbsolute(bibPath) ? bibPath : path.resolve(ROOT, bibPath);
  console.error(`Reading ${absBib}`);
  const bibText = await readFile(absBib, 'utf8');
  const entries = parseBib(bibText);
  console.error(`  parsed ${entries.length} bib entries`);

  const { titles: localTitles, arxivIds: localArxiv } = await readLocalPapers();
  const localTitleSet = new Set(localTitles.map(normTitle));
  const localShortSet = new Set(localTitles.map(shortTitle));
  const localArxivSet = new Set(localArxiv);
  console.error(`Existing papers in src/data/papers.yaml: ${localTitles.length}\n`);

  let candidates = entries;
  if (onlyYears) {
    candidates = candidates.filter((e) => onlyYears.has(Number(e.year)));
    console.error(`Filtering to years ${[...onlyYears].join(',')}: ${candidates.length} entries`);
  }

  const skipped = [];
  candidates = candidates.filter((e) => {
    const reason = shouldSkip(e);
    if (reason) { skipped.push({ e, reason }); return false; }
    return true;
  });

  const matchesLocal = (e) => {
    if (localTitleSet.has(normTitle(e.title))) return true;
    if (localShortSet.has(shortTitle(e.title))) return true;
    const venueArxiv = extractArxiv(e.booktitle || e.journal || e.url || e.eprint || '');
    if (venueArxiv && localArxivSet.has(venueArxiv)) return true;
    return false;
  };

  const seenShort = new Set();
  const dedupedBib = [];
  for (const e of candidates) {
    const st = shortTitle(e.title);
    if (seenShort.has(st)) continue;
    seenShort.add(st);
    dedupedBib.push(e);
  }

  const missing = dedupedBib.filter((e) => !matchesLocal(e));

  if (skipped.length) {
    console.error(`Skipped ${skipped.length} entries:`);
    for (const { e, reason } of skipped) {
      console.error(`  [${e.year ?? '????'}] ${e.title}  — ${reason}`);
    }
    console.error('');
  }

  console.error(`Missing from site: ${missing.length}`);
  missing.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

  if (missing.length === 0) {
    console.error('You\'re all caught up — papers.yaml has everything from this bib.');
    return;
  }

  // Plain list to stderr for human scanning
  console.error('');
  for (const e of missing) {
    const venue = e.booktitle || e.journal || '';
    console.error(`  [${e.year ?? '????'}] ${e.title}  · ${venue}`);
  }
  console.error('');

  // YAML blocks: stdout (so pipe-to-file works) + optional staging file
  const yamlBlocks = missing.map(stubYaml).join('\n\n') + '\n';

  if (WRITE) {
    await writeFile(STAGING_FILE, yamlBlocks);
    console.error(`Wrote staging YAML to scripts/missing-papers.yaml`);
    console.error(`Review it, then copy entries into src/data/papers.yaml.`);
    console.error(`(The script never edits papers.yaml directly — you do.)`);
  } else {
    console.error('Suggested YAML (also redirect to a file with --write):\n');
    console.log(yamlBlocks);
    console.error('\nRun with --write to save the above into scripts/missing-papers.yaml.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
