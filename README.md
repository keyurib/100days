# 100 Days

Home page for my 100 Days series: one small experimental web project shipped every day.

**Live: https://100days.keyurib.workers.dev**

## How it works

A plain static site (HTML, CSS, a little JavaScript) served by Cloudflare Workers.
Every project lives in `public/projects.json`, which drives both the 100-day board and the project cards.
Thumbnails go in `public/thumbs/`.

The page links only to live projects, never to GitHub. (Each project's GitHub repo links back to its live site instead.)

## Add a project

Add an entry to `public/projects.json`:

```json
{
  "day": 2,
  "slug": "my-project",
  "title": "My Project",
  "tagline": "One line about it",
  "description": "A couple of sentences.",
  "date": "2026-11-24",
  "tags": ["Next.js"],
  "accent": "#3fd0ff",
  "thumb": "thumbs/my-project.jpg",
  "url": "https://my-project.keyurib.workers.dev"
}
```

## Preview and deploy

```bash
npx wrangler dev      # local preview
npx wrangler deploy   # publish
```

## Projects

| Day | Project | Live |
| --- | --- | --- |
| 1 | Life Quest | https://life-quest.keyurib.workers.dev |
| 2 | SkyFall | https://skyfall.keyurib.workers.dev |
