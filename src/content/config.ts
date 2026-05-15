// ============================================================
// ⛔ DO NOT EDIT for routine content updates.
//
// This file defines the SHAPES (schemas) of all YAML data files in src/data/.
// Edit only when ADDING A NEW FIELD to papers / news / members / etc.
// Editing the schema without updating the corresponding .astro renderer
// will break the build or silently drop data.
//
// To add a new field:
//   1. Add it here under the relevant collection's z.object({ ... })
//   2. Use it in the matching .astro template (e.g., src/components/PaperCard.astro)
//   3. Test with `npm run dev`
//
// For ADDING CONTENT (new paper / news / member), edit YAML files in src/data/.
// ============================================================

import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const papers = defineCollection({
  loader: file('src/data/papers.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    date: z.string().optional(),
    status: z.enum(['preprint', 'published']).default('published'),
    tldr: z.string(),
    image: z.string().optional(),
    paperUrl: z.string().optional(),
    code: z.string().optional(),
    website: z.string().optional(),
    video: z.string().optional(),
    slides: z.string().optional(),
    poster: z.string().optional(),
    podcast: z.string().optional(),
    huggingface: z.string().optional(),
    press: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .default([]),
    themes: z.array(z.string()).default([]),
    award: z.string().optional(),
    featured: z.boolean().default(false),
    spotlight: z.boolean().default(false),
  }),
});

const members = defineCollection({
  loader: file('src/data/members.yaml'),
  schema: z.object({
    name: z.string(),
    role: z.enum(['pi', 'phd', 'master', 'undergrad', 'visiting', 'affiliated']),
    period: z.string().optional(),
    research: z.string().optional(),
    work: z.string().optional(),
    photo: z.string().optional(),
    url: z.string().optional(),
    coAdvisor: z
      .object({ name: z.string(), url: z.string().optional() })
      .optional(),
    note: z.string().optional(),
    order: z.number().default(100),
    social: z
      .object({
        scholar: z.string().optional(),
        twitter: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        email: z.string().optional(),
        orcid: z.string().optional(),
      })
      .optional(),
  }),
});

const alumni = defineCollection({
  loader: file('src/data/alumni.yaml'),
  schema: z.object({
    name: z.string(),
    track: z.enum(['phd', 'master', 'undergrad', 'visiting']),
    url: z.string().optional(),
    detail: z.string().optional(),
    destination: z.string().optional(),
    work: z.string().optional(),
    order: z.number().default(100),
  }),
});

const news = defineCollection({
  loader: file('src/data/news.yaml'),
  schema: z.object({
    date: z.string(),
    title: z.string(),
    href: z.string().optional(),
    tag: z.enum(['paper', 'award', 'talk', 'media', 'team', 'release']).default('paper'),
    person: z.string().optional(),
  }),
});

const awards = defineCollection({
  loader: file('src/data/awards.yaml'),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    venue: z.string().optional(),
    paper: z.string().optional(),
    href: z.string().optional(),
    recipient: z.string().optional(),
  }),
});

const themes = defineCollection({
  loader: file('src/data/themes.yaml'),
  schema: z.object({
    name: z.string(),
    icon: z.string().optional(),
    blurb: z.string(),
    order: z.number().default(100),
  }),
});

const press = defineCollection({
  loader: file('src/data/press.yaml'),
  schema: z.object({
    outlet: z.string(),
    logo: z.string().optional(),
    href: z.string(),
    headline: z.string().optional(),
    year: z.number().optional(),
  }),
});

const sponsors = defineCollection({
  loader: file('src/data/sponsors.yaml'),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    href: z.string().optional(),
    order: z.number().default(100),
  }),
});

const wiki = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.enum(['handbook', 'resources']).default('handbook'),
    order: z.number().default(100),
  }),
});

export const collections = { papers, members, alumni, news, awards, themes, press, sponsors, wiki };
