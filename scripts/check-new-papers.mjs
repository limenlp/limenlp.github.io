#!/usr/bin/env node
/**
 * Fetch all works from Jieyu Zhao's ORCID record and diff against
 * the papers in src/content/papers/. Print papers that are on ORCID
 * but not yet captured in the site.
 *
 *   node scripts/check-new-papers.mjs            # list diffs
 *   node scripts/check-new-papers.mjs --write    # also write stub MD files
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ORCID = '0009-0003-9956-5481';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAPERS_DIR = path.resolve(HERE, '..', 'src', 'content', 'papers');
const WRITE = process.argv.includes('--write');

function normTitle(s) {
  return (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function extractArxivId(s) {
  if (!s) return null;
  const m = String(s).match(/(?:arxiv[:/]|arxiv\.org\/(?:abs|pdf)\/|preprint\s*arxiv:?\s*)([0-9]{4}\.[0-9]{4,6})/i);
  return m ? m[1] : null;
}

async function fetchOrcidWorks() {
  const url = `https://pub.orcid.org/v3.0/${ORCID}/works`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`ORCID returned ${res.status}`);
  const data = await res.json();
  return (data.group ?? []).map((g) => {
    const w = g['work-summary']?.[0] ?? {};
    const title = w.title?.title?.value ?? '';
    const year = Number(w['publication-date']?.year?.value) || null;
    const journal = w['journal-title']?.value ?? '';
    const extIds = (w['external-ids']?.['external-id'] ?? []).map((e) => ({
      type: e['external-id-type'],
      value: e['external-id-value'],
    }));
    const doi = extIds.find((e) => e.type === 'doi')?.value ?? null;
    const arxivFromIds = extIds.find((e) => e.type === 'arxiv')?.value ?? null;
    const arxivId = extractArxivId(arxivFromIds) ?? extractArxivId(journal) ?? extractArxivId(title);
    return { title, year, venue: journal, doi, arxivId };
  });
}

async function readLocalPapers() {
  const files = await readdir(PAPERS_DIR);
  const out = [];
  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const txt = await readFile(path.join(PAPERS_DIR, f), 'utf8');
    const m = txt.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = Object.fromEntries(
      m[1].split('\n').map((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) return [null, null];
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim().replace(/^"|"$/g, '')];
      }).filter(([k]) => k)
    );
    out.push({ file: f, title: fm.title ?? '', paperUrl: fm.paperUrl ?? '', arxivId: extractArxivId(fm.paperUrl) });
  }
  return out;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function stubMd(work) {
  const year = work.year ?? new Date().getFullYear();
  const arxivUrl = work.arxivId ? `https://arxiv.org/abs/${work.arxivId}` : '';
  return `---
title: ${JSON.stringify(work.title)}
authors: "TODO — fill in"
venue: ${JSON.stringify(work.venue || 'Preprint')}
year: ${year}
status: preprint
tldr: "TODO — one-sentence summary"
${arxivUrl ? `paperUrl: ${arxivUrl}` : ''}
themes: []
---
`;
}

async function main() {
  console.log(`Fetching ORCID works for ${ORCID}…`);
  const orcid = await fetchOrcidWorks();
  console.log(`  found ${orcid.length} works\n`);

  const local = await readLocalPapers();
  console.log(`Local papers: ${local.length}`);

  const localArxiv = new Set(local.map((p) => p.arxivId).filter(Boolean));
  const localTitles = new Set(local.map((p) => normTitle(p.title)));

  const missing = orcid.filter((w) => {
    if (w.arxivId && localArxiv.has(w.arxivId)) return false;
    if (localTitles.has(normTitle(w.title))) return false;
    return true;
  });

  console.log(`\nMissing from site: ${missing.length}\n`);
  missing.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  for (const w of missing) {
    const arx = w.arxivId ? ` · arXiv:${w.arxivId}` : '';
    console.log(`  [${w.year ?? '????'}] ${w.title}${arx}`);
  }

  if (WRITE && missing.length) {
    console.log(`\nWriting stub MD files (you'll need to fill TL;DR + authors)…`);
    for (const w of missing) {
      const slug = `${w.year ?? 'xxxx'}-${slugify(w.title)}`;
      const file = path.join(PAPERS_DIR, `${slug}.md`);
      await writeFile(file, stubMd(w));
      console.log(`  wrote ${slug}.md`);
    }
  } else if (missing.length) {
    console.log(`\nRun with --write to generate stub MD files.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
