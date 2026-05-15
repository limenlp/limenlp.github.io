# LIME Lab Website

The redesigned LIME Lab site, built with [Astro](https://astro.build) + Tailwind. Static output that deploys to GitHub Pages.

This README is the operating manual: how to add a paper, write a news item, update the wiki, and so on. **You shouldn't need to touch `.astro` template files for routine updates.** Almost everything is driven by YAML data files and Markdown.

> ### ✋ Please update things — that's the whole point
>
> **Feel free to push updates as soon as something happens.** A paper got accepted? Add it to `news.yaml` the same day. New student joined? Add them to `members.yaml`. Got a new media coverage? Drop it in `press.yaml`. Wiki advice is out of date? Edit the markdown.
>
> The site only stays useful if it reflects what we're actually doing. Don't wait for someone else to do it — open a PR, or just commit directly to `main` if it's a small content change. Worst case, the build fails and we revert. **The cost of a stale site is much higher than the cost of a small mistake.**
>
> Specifically, you should feel empowered to (timely) update:
> - **News** ([`src/data/news.yaml`](src/data/news.yaml)) — paper accepts, awards, talks, team milestones
> - **Papers** ([`src/data/papers.yaml`](src/data/papers.yaml)) — your new preprint or camera-ready
> - **Team** ([`src/data/members.yaml`](src/data/members.yaml) / [`alumni.yaml`](src/data/alumni.yaml)) — when people join/leave
> - **Group Wiki** ([`src/content/wiki/`](src/content/wiki/)) — practices, tutorials, anything you wish you'd known
> - **Anything on the home page** — themes blurbs, recruitment text, spotlight paper, all editable in their respective YAML files

---

## Quick start

If you want to **run the site locally** (recommended before pushing any edit, so you can see what you broke):

```bash
# 1. Get the latest version of the repo
git pull

# 2. Install dependencies (first time only, or after package.json changes)
npm install

# 3. Start the dev server
npm run dev
```

Open <http://localhost:4321> in your browser. Changes to YAML / MD / Astro files hot-reload automatically — save the file, see the change immediately.

Other useful commands:

```bash
npm run build     # build static output to dist/ (what GitHub Pages serves)
npm run preview   # serve the built output locally — closer to what production looks like
```

**First-time setup** (you've never cloned this repo before):

```bash
git clone git@github.com:limenlp/limenlp.github.io.git
cd limenlp.github.io
npm install
npm run dev
```

Prerequisites: Node.js 18+ and npm. Check with `node --version`. If you don't have it, install via [nvm](https://github.com/nvm-sh/nvm) or download from [nodejs.org](https://nodejs.org).

---

## Repo layout

```
.
├── src/
│   ├── data/                  ← YAML data (this is where most edits go)
│   │   ├── papers.yaml
│   │   ├── members.yaml
│   │   ├── alumni.yaml
│   │   ├── news.yaml
│   │   ├── awards.yaml
│   │   ├── themes.yaml
│   │   ├── press.yaml
│   │   └── sponsors.yaml
│   ├── content/
│   │   ├── config.ts          ← schemas (don't touch unless adding a field)
│   │   └── wiki/              ← wiki pages (Markdown, with body content)
│   │       ├── research-expectations.md
│   │       ├── paper-writing.md
│   │       └── …
│   ├── pages/                 ← Astro page routes (rarely touched)
│   │   ├── index.astro        ← home page
│   │   ├── papers.astro
│   │   ├── team.astro
│   │   ├── news.astro
│   │   ├── og.png.ts          ← auto-generates the social-share image
│   │   └── wiki/
│   ├── components/            ← reusable cards / nav / etc. (rarely touched)
│   ├── layouts/Base.astro     ← global <head> + nav + footer wrapper
│   ├── styles/global.css      ← Tailwind base + custom utilities
│   ├── assets/                ← Build-optimized images (Astro Image)
│   └── og-fonts/              ← TTF fonts for OG image generation
├── public/                    ← Static files served as-is
│   ├── images/                ← Most photos / logos / paper teasers go here
│   └── CNAME                  ← custom domain for GitHub Pages (limelab.science)
├── scripts/                   ← One-off / maintenance scripts
│   ├── check-new-papers.mjs   ← Diffs ORCID vs site, finds missing papers
│   ├── import-bib.mjs         ← Imports from a Google Scholar .bib file
│   ├── migrate-to-yaml.mjs    ← One-time MD-per-entry → YAML migration (already done)
│   └── jieyu-scholar.bib      ← Scholar export, used by import-bib
├── .github/workflows/deploy.yml  ← Auto-deploys to GitHub Pages on every push to main
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

The **golden rule**: if you're adding *content* (a paper, a news item, a member), you edit a YAML file in `src/data/`. If you're writing *long-form text* (a wiki page with paragraphs), you create a Markdown file in `src/content/wiki/`.

---

## Common edits

### Add a paper

Open [`src/data/papers.yaml`](src/data/papers.yaml). Add a new entry at the top (most recent first is conventional):

```yaml
- id: 2026-my-new-paper           # unique slug, no spaces
  title: "My New Paper: A Cool Subtitle"
  authors: "First Author, Second Author, Jieyu Zhao"
  venue: "EMNLP 2026"             # or "Preprint", "ICLR 2026 Workshop", etc.
  year: 2026
  status: published               # or "preprint"
  tldr: "One-sentence summary in plain English."
  paperUrl: "https://arxiv.org/abs/2603.XXXXX"
  code: "https://github.com/limenlp/repo-name"    # optional
  website: "https://project-page.example/"        # optional
  video: "https://youtube.com/…"                  # optional
  slides: "files/slides.pdf"                      # optional
  poster: "https://drive.google.com/…"            # optional
  podcast: "https://soundcloud.com/…"             # optional
  huggingface: "https://huggingface.co/datasets/…" # optional
  image: /images/papers/my-paper.png              # optional teaser, see "Images" below
  press:                                          # optional
    - name: VentureBeat
      url: https://venturebeat.com/…
  themes: [agents, evaluation]    # which of trustworthiness/agents/alignment/evaluation
  featured: true                  # show in home page "Featured papers" grid
  spotlight: true                 # show as the big hero spotlight (only one paper should be true)
```

**Required**: `id`, `title`, `authors`, `venue`, `year`, `status`, `tldr`. Everything else is optional.

If two papers have `spotlight: true`, the first match wins. To rotate, just move `spotlight: true` from one to another.

### Add a news item

Open [`src/data/news.yaml`](src/data/news.yaml). Add at the top:

```yaml
- id: 2026-06-acl-best-paper       # unique slug
  date: 2026-06                    # YYYY-MM
  title: "Our paper won Best Paper at ACL 2026!"
  tag: award                       # paper | award | talk | media | team | release
  href: "https://2026.aclweb.org/awards/"   # optional link
  person: Jieyu                    # optional — currently not rendered, reserved for future
```

The **home page Latest** section shows the 8 most recent items. The full archive at `/news/` shows everything, grouped by year.

### Add a wiki page

Wiki pages live in [`src/content/wiki/`](src/content/wiki/) as Markdown files. Create a new file, e.g. `src/content/wiki/onboarding.md`:

```markdown
---
title: Onboarding
description: First-week checklist for new lab members.
category: handbook    # handbook | advising | resources
order: 4              # lower = earlier in the sidebar
---

## Week 1

Welcome to LIME! Here's what to do in your first week…

## Slack channels to join

- `#general` — daily group
- `#paper-reading` — weekly reading group
```

The page auto-appears in the sidebar (grouped under its category) and gets a URL at `/wiki/onboarding/`.

### Add or edit an award

Open [`src/data/awards.yaml`](src/data/awards.yaml):

```yaml
- id: 2026-some-award
  title: Best Paper Award
  year: 2026
  paper: "The Paper That Won"          # optional — shown below title in italic
  href: "https://arxiv.org/abs/…"      # optional — links the title and paper
  recipient: Jieyu Zhao                # optional — shown as a pill next to the title
```

### Add or remove a team member

Open [`src/data/members.yaml`](src/data/members.yaml). Each member:

```yaml
- id: phd-new-student
  name: New Student
  role: phd                        # pi | phd | master | undergrad | visiting | affiliated
  period: "2026.8 – Now"
  research: "LLM agents · evaluation"
  photo: /images/members/new-student.jpg   # see "Images" below
  url: "https://newstudent.github.io"      # optional homepage
  order: 14                                # lower = earlier in their role section
  coAdvisor:                               # optional
    name: Emilio Ferrara
    url: "https://viterbi.usc.edu/…"
```

When someone graduates, **don't delete them** — move their entry from `members.yaml` to [`alumni.yaml`](src/data/alumni.yaml):

```yaml
- id: phd-graduated-student
  name: Graduated Student
  track: phd                       # phd | master | undergrad | visiting
  url: "https://their-new-page.example/"
  detail: "USC PhD"
  destination: "Research Scientist @ Some Lab"
  order: 3
```

### Add a press / media mention

Open [`src/data/press.yaml`](src/data/press.yaml):

```yaml
- id: outlet-headline-slug
  outlet: VentureBeat
  href: "https://venturebeat.com/article-url/"
  headline: "Short description of the coverage"
  year: 2026
```

### Add a sponsor

Open [`src/data/sponsors.yaml`](src/data/sponsors.yaml):

```yaml
- id: new-sponsor
  name: New Sponsor
  logo: /images/sponsors/new-sponsor.png
  order: 4
```

Drop the logo PNG into `public/images/sponsors/` first.

### Edit a theme blurb / icon

Open [`src/data/themes.yaml`](src/data/themes.yaml). To change which icon a theme uses, edit the `icon:` field. Supported values today: `shield`, `cursor`, `compass`, `scale`. Adding a new icon means editing [`src/components/ThemeCard.astro`](src/components/ThemeCard.astro) and pasting a Lucide-style SVG path into the `icons` map.

---

## Images

Two places images can live:

### `public/images/` — most photos, logos, paper teasers

This is the **default**. Just drop a file in and reference it by its path from the site root:

```yaml
# papers.yaml
image: /images/papers/coact.png

# members.yaml
photo: /images/members/new-student.jpg
```

Conventions:

| Subfolder | What goes here |
|---|---|
| `public/images/papers/` | Paper teaser images (~1200px wide, 4:3 or 16:9 ideal) |
| `public/images/members/` | Member portraits (~400×400, square-cropped) |
| `public/images/sponsors/` | Sponsor logos (~400px wide, PNG with transparent bg) |
| `public/images/pets/` | The affiliated members 🐶 |
| `public/images/lab/` | Lab brand assets (`lime-slice.png`, etc.) |

**Format tips**:
- Photos → JPG, keep file ≤ 200 KB
- Logos / illustrations → PNG with transparency
- Big teaser images → consider WebP (smaller than JPG at same quality)

### `src/assets/` — only for build-optimized hero images

Used for images we want Astro to auto-convert to WebP, generate responsive sizes for, and lazy-load (`<Image>` component). Currently only:

- `src/assets/g1.png` — the lemon mascot in the home hero
- `src/assets/lime-moments.jpg` — the AI-generated lab portrait in the home hero

If you want to add another image with full optimization, import it inside the `.astro` file:

```astro
---
import { Image } from 'astro:assets';
import myImg from '../assets/my-img.jpg';
---
<Image src={myImg} alt="..." widths={[400, 800]} sizes="400px" format="webp" />
```

For everything else (which is 99% of cases), just drop it in `public/images/`.

---

## The OG image (social-share preview)

The image that shows up when someone shares the site link on Twitter / Slack / Discord is **auto-generated at build time** by [`src/pages/og.png.ts`](src/pages/og.png.ts) using [satori](https://github.com/vercel/satori).

It pulls:
- Lab name + tagline (hardcoded in the `og.png.ts` file)
- The g1 mascot (from `public/images/lab/g1.png`)
- Inter font (bundled in `src/og-fonts/`)

If you change the H1 on the home page, edit `og.png.ts` to keep it in sync. The output is `dist/og.png` after `npm run build`.

---

## Updating Jieyu's PI page news

Jieyu's personal page (`jyzhao.net`) has its own News section, separate from this site. When you want to mirror something from her PI page to the lab site, you currently copy/paste manually into `news.yaml`. **There is no automated sync yet.**

---

## Keeping the papers list in sync with Google Scholar

When you have new papers (yours or a collaborator's) you want to add to the site, the `papers:import` script saves a lot of typing. It takes a BibTeX file, diffs it against `papers.yaml`, and prints ready-to-paste YAML for everything that's missing.

### Anyone can use their own .bib

The script accepts **any** `.bib` file as input — yours, a collaborator's, an arXiv export, whatever. The default is Jieyu's Scholar export at `scripts/jieyu-scholar.bib`, but you can point it at your own:

```bash
# Default — use the bundled Jieyu Scholar export
npm run papers:import

# Use your own bib file
node scripts/import-bib.mjs ~/my-papers.bib

# Only papers from specific years
node scripts/import-bib.mjs ~/my-papers.bib --only-year=2025,2026
```

### Where the output goes

By default the script writes to **two places**:

| Stream | What's there | How to use |
|---|---|---|
| **stderr** (your terminal) | Human-readable summary: bib count, what was skipped, list of missing titles | Just read it to see what's new |
| **stdout** (your terminal) | YAML blocks for each missing paper, ready to copy-paste | Pipe to a file: `npm run papers:import > /tmp/missing.yaml` |

With `--write`, it also writes the YAML blocks to `scripts/missing-papers.yaml`:

```bash
node scripts/import-bib.mjs ~/my-papers.bib --write
```

Then open [`scripts/missing-papers.yaml`](scripts/missing-papers.yaml), review each entry, and **copy the ones you want into [`src/data/papers.yaml`](src/data/papers.yaml)**. The script **never edits papers.yaml directly** — that's a human decision. Each suggested entry has `tldr: "TODO — write a one-sentence summary"` and empty `themes: []` for you to fill in.

### How to get a Scholar bib

1. Go to your [Google Scholar profile](https://scholar.google.com)
2. Tick the papers you want to add (or "select all")
3. Click "Export" → **BibTeX**
4. Save the file (e.g. `~/Downloads/citations.bib`)
5. Pass that path to `papers:import`

The script filters out: workshop-proceedings entries (where you were editor), PhD theses, and pre-2018 systems papers. Same paper appearing under multiple titles in Scholar is deduped by title.

### Alternative: ORCID-based check

`npm run papers:check` hits Jieyu's ORCID record (her authoritative authored-papers list) and prints what's missing without using a bib file. ORCID is more strict than Scholar's auto-attribution but covers fewer papers. Use whichever signal is more current. For collaborators with their own ORCID, edit the `ORCID` constant at the top of [`scripts/check-new-papers.mjs`](scripts/check-new-papers.mjs).

---

## Style conventions

### Colors

Defined in [`tailwind.config.mjs`](tailwind.config.mjs):

- `lime-*` — the LIME brand green family (50 lightest → 950 darkest). `lime-700` for accent links, `lime-50` for soft backgrounds.
- `ink-*` — neutral grays for body text, borders. `ink-950` for headings, `ink-700` for body, `ink-500` for muted.
- `amber-*` — the secondary accent (used sparingly, e.g. the H1 highlight underline).

Don't introduce new color families casually — stick to lime / ink / amber unless there's a real reason.

### Typography

- **Body / nav / cards**: Inter Variable
- **All headings (`.heading-1` / `.heading-2` / `.heading-3`)**: Inter Variable, aggressive weight (800 / 700 / 600) + tight tracking
- **Year tags on `/papers/`**: JetBrains Mono
- **Eyebrows** (small uppercase labels): kept rare — only the hero on home page has one now

### Section structure

Each `<section>` on a page uses `container-prose` for horizontal centering + padding. New section usually starts with `mt-24` (or `mt-12` for tighter stacks). H2 + a horizontal `lime-divider` is the common section header pattern.

---

## Deploying

The site is at <https://limelab.science> (with `limenlp.github.io` auto-redirecting there). Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the Astro site and deploys to GitHub Pages. Typical workflow:

```bash
git add -A
git commit -m "add CoAct-2 paper"
git push
```

Watch the deploy progress under the repo's **Actions** tab. The new content goes live in ~1–2 minutes after the workflow turns green.

To preview the production build locally first (catches things `npm run dev` won't):

```bash
npm run build
npm run preview
```

---

## Help

- Broken build? Most often it's a YAML indentation issue — YAML cares about spaces. Open the file in VS Code and check the indentation guides.
- Image not showing? Check the path. `public/images/foo.png` is referenced as `/images/foo.png` (drop the `public/` prefix).
- Want a new field on papers / news / members? Edit `src/content/config.ts` to add it to the schema, then use it in the matching `.astro` template.

For anything beyond that, ping `lime.imlab@gmail.com` or message the group Slack.
