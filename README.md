# LIME Lab Website

The LIME Lab site, built with [Astro](https://astro.build) + Tailwind. Static output that deploys to GitHub Pages.

This README is the operating manual: how to add a paper, write a news item, update the wiki. **You shouldn't need to touch `.astro` template files for routine updates.** Almost everything is driven by YAML data files and Markdown.

> ### ✋ Please update things — that's the whole point
>
> **Push updates the moment something happens.** Paper accepted? Add to `news.yaml` the same day. New student joined? Add them to `members.yaml`. Got media coverage? Drop it in `press.yaml`. Wiki advice out of date? Edit the Markdown.
>
> The site only stays useful if it reflects what we're actually doing. Don't wait for someone else to do it — open a PR, or commit directly to `main` if it's a small content change. Worst case the build fails and we revert. **The cost of a stale site is much higher than the cost of a small mistake.**
>
> You should feel empowered to update:
> - **News** ([`src/data/news.yaml`](src/data/news.yaml)) — paper accepts, awards, talks, team milestones
> - **Papers** ([`src/data/papers.yaml`](src/data/papers.yaml)) — your new preprint or camera-ready
> - **Team** ([`src/data/members.yaml`](src/data/members.yaml) / [`src/data/alumni.yaml`](src/data/alumni.yaml)) — when people join/leave
> - **Group Wiki** ([`src/content/wiki/`](src/content/wiki/)) — handbook + curated resources for new and returning members
> - **Anything on the home page** — theme blurbs, awards, press mentions, spotlight papers (all editable via YAML)

> ### 📍 Editable-or-not markers inside each file
>
> Every file in this repo has a header comment telling you whether you're allowed to edit it:
>
> - **`✏️ EDITABLE`** → YAML / Markdown content files. Inline template included — copy, paste, fill in.
> - **`⛔ DO NOT EDIT for content updates`** → Astro templates, components, configs. Edit only for design changes (and coordinate via PR review).
>
> If you're not sure, **scroll to the top of the file first** before changing anything.

---

## Quick start

If you want to **run the site locally** before pushing any edit (recommended — you'll see what you broke):

```bash
# 1. Get the latest version of the repo
git pull

# 2. Install dependencies (first time only, or after package.json changes)
npm install

# 3. Start the dev server
npm run dev
```

Open <http://localhost:4321> in your browser. Changes to YAML / MD / Astro files **hot-reload automatically** — save the file, see the change immediately.

Other useful commands:

```bash
npm run build     # Build static output to dist/ (what GitHub Pages serves)
npm run preview   # Serve the built output locally — closer to production
```

**First-time setup** (you've never cloned this repo before):

```bash
git clone git@github.com:limenlp/limenlp.github.io.git
cd limenlp.github.io
npm install
npm run dev
```

**Prerequisites:** Node.js 18+ and npm. Check with `node --version`. If you don't have it, install via [nvm](https://github.com/nvm-sh/nvm) or download from [nodejs.org](https://nodejs.org).

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
│   │   ├── config.ts          ← schemas (don't touch unless adding a new field)
│   │   └── wiki/              ← wiki pages (Markdown with frontmatter + body)
│   ├── pages/                 ← Astro page routes (rarely touched)
│   │   ├── index.astro        ← home page
│   │   ├── papers.astro
│   │   ├── people.astro
│   │   ├── news.astro
│   │   ├── og.png.ts          ← auto-generates the social-share image
│   │   └── wiki/
│   ├── components/            ← reusable cards / nav / footer (rarely touched)
│   ├── layouts/Base.astro     ← global <head> + nav + footer wrapper
│   ├── styles/global.css      ← Tailwind base + custom utilities
│   ├── assets/                ← Build-optimized images (Astro <Image>)
│   └── og-fonts/              ← TTF fonts for OG image generation
├── public/                    ← Static files served as-is
│   ├── images/                ← Most photos / logos / paper teasers go here
│   └── CNAME                  ← custom domain (limelab.science)
├── scripts/                   ← One-off / maintenance scripts
│   ├── check-new-papers.mjs   ← Diffs ORCID vs site, finds missing papers
│   ├── import-bib.mjs         ← Imports from a BibTeX file
│   ├── migrate-to-yaml.mjs    ← One-time MD→YAML migration (already done)
│   └── jieyu-scholar.bib      ← Scholar export, used by import-bib
├── .github/workflows/deploy.yml  ← Auto-deploys to GitHub Pages on push to main
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

The **golden rule**: if you're adding *content* (a paper, a news item, a member), edit a YAML file in `src/data/`. If you're writing *long-form text* (a wiki page with paragraphs), create a Markdown file in `src/content/wiki/`.

---

## Common edits

Each data file has an inline `TEMPLATE` at the top — copy it, paste at the top of the entry list, fill it in. Below is a reference for what each template captures.

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
  code: "https://github.com/limenlp/repo-name"     # optional
  website: "https://project-page.example/"         # optional
  video: "https://youtube.com/…"                   # optional
  slides: "files/slides.pdf"                       # optional
  poster: "https://drive.google.com/…"             # optional
  podcast: "https://soundcloud.com/…"              # optional
  huggingface: "https://huggingface.co/datasets/…" # optional
  image: /images/papers/my-paper.png               # optional teaser, see "Images" below
  press:                                           # optional
    - name: VentureBeat
      url: https://venturebeat.com/…
  themes: [agents, evaluation]    # one or more theme ids from themes.yaml
  award: "🏆 Best Paper"          # optional, renders as a yellow pill
  featured: true                  # show in home Spotlight carousel
  spotlight: true                 # higher priority slot in the carousel
```

**Required**: `id`, `title`, `authors`, `venue`, `year`, `tldr`. Everything else is optional. `status` defaults to `published`.

**Card click behavior**: the **whole paper card** is clickable and links to `paperUrl` (falls back to `website`, then to `#`). The action pills in the bottom row (Paper / Code / HF / Video / Press / …) stay individually clickable. If neither `paperUrl` nor `website` is set, clicking the card does nothing — so always set at least one.

**Home Spotlight** is a carousel that shows **up to 5 papers**: papers with `spotlight: true` come first (sorted by year, newest first), then papers with `featured: true` fill the remaining slots. Visitors can click ← → arrows or dot indicators to switch between cards (it loops). To rotate the spotlight: flip `spotlight: true` / `featured: true` flags on different papers.

### Add a news item

**Anything you do that's lab-related is worth a news entry.** Gave a talk? Add it. Paper got accepted (preprint, conference, journal, workshop, findings — all count)? Add it. Won an award? Got media coverage? Released code or a dataset? Joined a panel? Mentored someone? Co-organized a workshop? **All of it counts.** Don't filter yourself — the bar for news is "did this happen and is it lab-related". Push it.

Open [`src/data/news.yaml`](src/data/news.yaml). Add at the top:

```yaml
- id: 2026-06-acl-best-paper                                     # unique slug
  date: 2026-06                                                  # YYYY-MM
  title: "[Our Paper](https://arxiv.org/abs/…) won Best Paper at ACL 2026!"
  tag: award                                                     # paper | award | talk | media | team | release
  person: Jieyu                                                  # optional, not rendered yet
```

**Link convention**: write `[text](https://url)` directly inside the `title` field — **only that text becomes clickable**. Don't try to make the whole title a link: the renderer ignores the legacy `href:` field. This keeps news lines readable and lets you link multiple things per line (e.g., paper + code).

The home page **Latest** section shows the 10 most recent items. The full archive at `/news/` groups by year.

### Add a wiki page

Wiki pages live in [`src/content/wiki/`](src/content/wiki/) as Markdown files with frontmatter. Create a new file, e.g. `src/content/wiki/onboarding.md`:

```markdown
---
title: Onboarding
description: First-week checklist for new lab members.
category: handbook    # handbook | resources
order: 4              # lower = earlier in the sidebar
---

## Week 1

Welcome to LIME! Here's what to do in your first week…

## Slack channels to join

- `#general` — daily group
- `#paper-reading` — weekly reading group
```

The page auto-appears in the sidebar under its category and gets a URL at `/wiki/onboarding/`.

**Highlight a Rule No. 1 / featured principle** — wrap the content in this HTML block (Tailwind classes work inside `.md`):

```html
<div class="not-prose my-10 overflow-hidden rounded-2xl border border-lemon-300 bg-lemon-50 shadow-sm">
  <div class="flex items-center gap-2 bg-lemon-300 px-6 py-2.5">
    <span class="text-base leading-none" aria-hidden="true">★</span>
    <span class="text-xs font-bold uppercase tracking-[0.2em] text-lime-900">Rule No. 1</span>
  </div>
  <div class="space-y-3 px-6 py-5">
    <h2 class="text-xl font-semibold text-ink-950">Short title</h2>
    <p class="leading-relaxed text-ink-800">The rule body — one or more paragraphs.</p>
  </div>
</div>
```

**Warning callout** — same shape as Rule No. 1, persimmon instead of lemon:

```html
<div class="not-prose my-10 overflow-hidden rounded-2xl border border-persimmon-300 bg-persimmon-50 shadow-sm">
  <div class="flex items-center gap-2 bg-persimmon-300 px-6 py-2.5">
    <span class="text-base leading-none" aria-hidden="true">⚠️</span>
    <span class="text-xs font-bold uppercase tracking-[0.2em] text-persimmon-900">Warning</span>
  </div>
  <div class="space-y-3 px-6 py-5">
    <p class="leading-relaxed text-ink-800">The body of the warning.</p>
  </div>
</div>
```

Both are reusable — copy and adjust the text. Working examples live in [`research-expectations.md`](src/content/wiki/research-expectations.md), [`writing-and-speaking.md`](src/content/wiki/writing-and-speaking.md), and [`tools.md`](src/content/wiki/tools.md).

### Add or edit an award

Open [`src/data/awards.yaml`](src/data/awards.yaml):

```yaml
- id: 2026-some-award
  title: Best Paper Award
  year: 2026
  venue: "ACL 2026"                    # optional — shown after the title
  paper: "The Paper That Won"          # optional — italic subtitle beneath the title
  href: "https://arxiv.org/abs/…"      # optional — wraps the title (+ paper) in a link
  recipient: "Jieyu Zhao"              # optional — shown as a pill next to the title
```

### Update the Team page

The [`/people/`](https://limelab.science/people/) page auto-renders from two YAML files:

| File | Who | Rendered section |
|---|---|---|
| [`src/data/members.yaml`](src/data/members.yaml) | Active members | PI → PhDs → Masters → Undergrads → Visiting & Interns → Affiliated |
| [`src/data/alumni.yaml`](src/data/alumni.yaml) | Past members | Alumni section (split into "PhD & Visiting" / "Master, Undergrad & Summer Program") |

**You don't touch [`src/pages/people.astro`](src/pages/people.astro)** — that's just the template. All content lives in the YAML files above.

**Card click behavior**: each member card is a clickable tile that goes to their `url` (personal homepage). The `work:` field links and Co-advisor link stay individually clickable. If `url` is omitted, the card is non-clickable (which signals "no homepage yet").

#### Common tasks

| Task | What to do |
|---|---|
| New student joins | Add to `members.yaml` with `role: phd` / `master` / `undergrad` |
| New intern arrives | Add to `members.yaml` with `role: visiting` + `note: "from XX"` |
| Student graduates / intern leaves | **Move** entry from `members.yaml` → `alumni.yaml` (don't delete) |
| Update someone's photo | Drop image in `public/images/members/`, set `photo: /images/members/...` |
| Reorder cards within a section | Lower `order:` value = earlier in the section |
| Update what someone worked on | Edit their `work:` field (or add it) |

#### Member entry (members.yaml)

```yaml
- id: phd-new-student
  name: New Student
  role: phd                              # pi | phd | master | undergrad | visiting | affiliated
  period: "2026.8 – Now"
  research: "LLM agents · evaluation"
  work: "Built [WildFeedback](https://arxiv.org/...); led the eval pipeline."   # optional — what they've contributed; markdown [text](url) supported
  photo: /images/members/new-student.jpg # optional — if missing, shows initials in a lime circle
  url: "https://newstudent.github.io"    # optional homepage
  note: "Co-advised with X"              # optional, italic note
  order: 14                              # lower = earlier within their role section
  coAdvisor:                             # optional
    name: Emilio Ferrara
    url: "https://viterbi.usc.edu/…"
  social:                                # optional — any subset
    scholar: "https://scholar.google.com/…"
    twitter: "https://twitter.com/…"
    github: "https://github.com/…"
    linkedin: "https://linkedin.com/in/…"
    email: "name@usc.edu"
    orcid: "https://orcid.org/…"
```

**When someone graduates, don't delete them** — move their entry from `members.yaml` to [`alumni.yaml`](src/data/alumni.yaml):

```yaml
- id: phd-graduated-student
  name: Graduated Student
  track: phd                       # phd | master | undergrad | visiting
  url: "https://their-new-page.example/"
  detail: "USC PhD"
  destination: "Research Scientist @ Some Lab"
  work: "Co-led [Safer-Instruct](https://...) (NAACL 2024); RLHF for code generation."   # optional — what they did here; markdown links supported
  order: 3
```

#### Interns / visiting students

Use `role: visiting` for **anyone short-term** (summer intern, semester visitor, external collaborator). The `phd` / `master` / `undergrad` roles are reserved for **USC students whose primary advisor is Jieyu**.

```yaml
- id: visiting-jane-smith
  name: Jane Smith
  role: visiting                          # ← use "visiting" for ALL interns
  period: "Summer 2025"                   # short-term format
  # or: "2025.9 – 2026.5" for a year-long visit
  research: "RLHF · reward modeling"
  photo: /images/members/jane-smith.jpg
  url: "https://janesmith.github.io"
  note: "Visiting from MIT"               # ← write the affiliation here
  order: 20                               # ≥ 20 keeps visitors below regular grad students
```

**Conventions:**
- **Period format** — keep consistent: `"Summer 2025"`, `"Spring 2026"`, `"Fall 2025"` for single-term visits; `"2025.9 – 2026.5"` for multi-term.
- **`note` is the institutional affiliation** — `"Visiting from Tsinghua"`, `"Microsoft Research intern"`, etc. Don't skip this; otherwise visitors look indistinguishable from group members.
- **When intern leaves**, move to `alumni.yaml` with `track: visiting` (not `master`/`phd`).
- **Don't add new role types** for "intern" or "summer intern" — `visiting` is the catch-all.

### Add a press / media mention

Open [`src/data/press.yaml`](src/data/press.yaml):

```yaml
- id: outlet-headline-slug
  outlet: VentureBeat
  href: "https://venturebeat.com/article-url/"
  headline: "Short description of the coverage"     # optional
  year: 2026                                        # optional
```

### Add a sponsor

Open [`src/data/sponsors.yaml`](src/data/sponsors.yaml):

```yaml
- id: new-sponsor
  name: New Sponsor
  logo: /images/sponsors/new-sponsor.png
  href: "https://sponsor.example/"           # optional
  order: 4
```

Drop the logo PNG into `public/images/sponsors/` first.

### Edit a theme blurb / icon

Open [`src/data/themes.yaml`](src/data/themes.yaml). To change which icon a theme uses, edit the `icon:` field. To add a brand-new icon you'd have to edit [`src/components/ThemeCard.astro`](src/components/ThemeCard.astro) and paste a Lucide-style SVG path — only Jieyu / admins should do that.

---

## Images

> **Compress before you commit.** Every image you add — member photo, paper teaser, logo — must be resized and compressed **before** pushing. Large images slow the site for everyone and bloat the repo permanently (git stores every version forever). Quick rule of thumb:
>
> | Type | Target size | How |
> |---|---|---|
> | Member photo | ≤ 50 KB, ~400×400 px | `sips -Z 400 -s formatOptions 80 yourphoto.jpg` |
> | Paper teaser | ≤ 200 KB | `sips -Z 800 teaser.png` (or save as WebP) |
> | Logo / icon | ≤ 50 KB | Already small if exported correctly |
>
> **Check file size before committing:** `ls -lh public/images/members/yourphoto.jpg`. If it's over the target, compress it.

Two places images can live:

### `public/images/` — most photos, logos, paper teasers

This is the **default**. Just drop a file in and reference it by its path from the site root:

```yaml
# papers.yaml
image: /images/papers/coact.png        # NOT /public/images/coact.png

# members.yaml
photo: /images/members/new-student.jpg
```

Conventions:

| Subfolder | What goes here |
|---|---|
| `public/images/papers/` | Paper teasers (~1200px wide, 4:3 or 16:9 ideal) |
| `public/images/members/` | Member portraits (~400×400, square-cropped) |
| `public/images/sponsors/` | Sponsor logos (~400px wide, transparent PNG) |
| `public/images/pets/` | The affiliated members 🐶 |
| `public/images/lab/` | Lab brand assets (`lime-slice.png`, `g1.png`, etc.) |

**Format tips:**
- Photos → JPG, keep file ≤ 200 KB
- Logos / illustrations → PNG with alpha
- Big teaser images → WebP (smaller than JPG at same quality)

**Member photos:** save your portrait to `public/images/members/` and set `photo: /images/members/yourname.jpg` in `members.yaml`. Requirements:
- **Local files only** — do not link to external URLs (your personal site, GitHub Pages, etc.). External images add DNS lookups, slow down page load, and break when the source goes down.
- **≤ 200 KB** — resize to ~400×400 px and compress before committing. On macOS: `sips --resampleHeightWidthMax 400 -s formatOptions 80 yourphoto.jpg`.
- **Square crop preferred** — the photo renders as a circle; non-square images will be clipped.

### `src/assets/` — only for build-optimized hero images

Used for images we want Astro to auto-convert to WebP, generate responsive sizes for, and lazy-load via the `<Image>` component. Currently only:

- `src/assets/g1.png` — the lemon mascot in the home hero
- `src/assets/lime-moments.jpg` — the AI-generated lab portrait

To add another optimized image, import inside the `.astro` file:

```astro
---
import { Image } from 'astro:assets';
import myImg from '../assets/my-img.jpg';
---
<Image src={myImg} alt="…" widths={[400, 800]} sizes="400px" format="webp" />
```

For everything else (99% of cases), just drop the file in `public/images/`.

---

## Auto-generated OG image (social-share preview)

The image that shows up when someone shares the site link on Twitter / Slack / Discord is **generated at build time** by [`src/pages/og.png.ts`](src/pages/og.png.ts) using [satori](https://github.com/vercel/satori).

It pulls:
- Lab name + tagline (hardcoded in `og.png.ts` — keep in sync with the H1 on `index.astro`)
- The g1 mascot (from `public/images/lab/g1.png`)
- Inter font (bundled in `src/og-fonts/`)

After `npm run build`, the output sits at `dist/og.png`. If you change the home H1, also edit `og.png.ts` so the social preview matches.

---

## Updating Jieyu's PI page news

Jieyu's personal page (<https://jieyuzhao.github.io>) is a **separate repo** with its own News section. There is no automated sync between the two — when something should appear on both, copy/paste manually into each `news.yaml`.

---

## Keeping the papers list in sync with Google Scholar

When you have new papers (yours or a collaborator's) to add, the `papers:import` script saves a lot of typing. It takes a BibTeX file, diffs it against `papers.yaml`, and prints ready-to-paste YAML for everything that's missing.

### Anyone can use their own .bib

The script accepts **any** `.bib` file — yours, a collaborator's, an arXiv export, whatever. The default is Jieyu's Scholar export at `scripts/jieyu-scholar.bib`, but you can point it at your own:

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
| **stderr** | Human-readable summary: bib count, skipped entries, missing titles | Just read it |
| **stdout** | YAML blocks for each missing paper, ready to copy-paste | Pipe: `npm run papers:import > /tmp/missing.yaml` |

With `--write`, it also writes the YAML blocks to `scripts/missing-papers.yaml`:

```bash
node scripts/import-bib.mjs ~/my-papers.bib --write
```

Then open [`scripts/missing-papers.yaml`](scripts/missing-papers.yaml), review each entry, and **copy the ones you want into [`src/data/papers.yaml`](src/data/papers.yaml)**. The script **never edits papers.yaml directly** — that's a human decision. Each suggested entry has `tldr: "TODO — write a one-sentence summary"` and empty `themes: []` for you to fill in.

### How to get a Scholar bib

1. Open your [Google Scholar profile](https://scholar.google.com)
2. Tick the papers you want to add (or "select all")
3. Click "Export" → **BibTeX**
4. Save the file (e.g., `~/Downloads/citations.bib`)
5. Pass that path to `papers:import`

The script filters out: workshop-proceedings entries (where you were editor), PhD theses, and pre-2018 systems papers. Duplicate titles in Scholar are deduped automatically.

### Alternative: ORCID-based check

```bash
npm run papers:check   # diff against Jieyu's ORCID record
```

ORCID is stricter than Scholar (no auto-attribution noise) but covers fewer papers. Use whichever signal is more current. For a different ORCID, edit the `ORCID` constant in [`scripts/check-new-papers.mjs`](scripts/check-new-papers.mjs).

---

## Style conventions

### Colors (defined in [`tailwind.config.mjs`](tailwind.config.mjs))

The palette is **金桔柠檬茶 (lime) + 柠檬黄 (lemon) + 柿红 (persimmon) + 荔枝白 (lychee) + ink**:

| Family | Hex (main shade) | Used for |
|---|---|---|
| **`lime-*`** | `#33AD37` (lime-500) | Primary brand. `lime-700` for link text. `lime-50` for soft fills. Markers, eyebrow text, divider gradients. |
| **`lemon-*`** | `#F8DF09` (lemon-500) | Bright accent, used sparingly: "actually check." highlight underline, active theme-chip on `/papers/`, "We're hiring" hero button, hero eyebrow underline, text selection (`::selection`). |
| **`persimmon-*`** | `#E44821` (default) | Warm hover accent — **all link hover states**. |
| **`lychee`** | `#FEFFEF` (single) | Soft warm white. Reserved (not currently used as page bg). |
| **`ink-*`** | grayscale | Body text + borders. `ink-950` for headings, `ink-700`/`ink-800` for body, `ink-500` for muted. |

**Don't introduce new color families casually** — stick to lime / lemon / persimmon / ink.

### Typography

- **Body / nav / cards / headings** — all use **Inter Variable**. Headings just use heavier weights + tighter tracking via the `.heading-1` / `.heading-2` / `.heading-3` utilities in `global.css`.
- **No `font-mono` anywhere** — dates, years, course codes all use Inter for visual consistency.
- **Eyebrows** (small uppercase labels) — kept rare; only the home hero has one (and it picks up a subtle lemon underline).

### Links

Two utility classes in `global.css`:

- **`.link-accent`** — colored + persistent underline at rest. Use in prose / where a link should clearly stand out.
- **`.link-subtle`** — colored only at rest, underline appears on hover. Use inside card titles, lists, dense link zones.
- In Markdown body content (wiki, news titles), inline `[text](url)` is the standard — it inherits the link styles automatically.

All link hovers swap text to `persimmon` (warm orange-red) + show/recolor the underline.

### Section structure

Each page section uses `<section class="container-prose …">` for max-width + horizontal padding. New sections typically start with `mt-24` (or `mt-12` for tighter stacks). On the home page, `News + Spotlight` is a 40/60 split (`lg:grid-cols-[2fr_3fr]`).

---

## Deploying

Site is at <https://limelab.science> (`limenlp.github.io` auto-redirects). Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the Astro site and deploys to GitHub Pages. Typical workflow:

```bash
git add -A
git commit -m "add CoAct-2 paper"
git push
```

Watch the deploy progress under the repo's **Actions** tab. Content goes live in ~1–2 minutes after the workflow turns green.

To preview the production build locally first (catches things `npm run dev` won't):

```bash
npm run build
npm run preview
```

---

## Help

- **Broken build?** 90% of the time it's a YAML indentation issue — YAML cares about spaces. Open the file in VS Code; the indentation guides will reveal the misalignment.
- **Image not showing?** Check the path — `public/images/foo.png` is referenced as `/images/foo.png` (drop the `public/` prefix).
- **Want a new field on papers / news / members?** Edit [`src/content/config.ts`](src/content/config.ts) to add it to the schema, then use it in the matching `.astro` template.
- **Not sure if a file is editable?** Check the comment at the top of the file. `✏️ EDITABLE` = go ahead. `⛔ DO NOT EDIT` = ask first.

For anything beyond that, ping `lime.imlab@gmail.com` or the group Slack.
