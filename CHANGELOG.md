# Changelog

## 2026-04-20 — Template initialized

Forked from lea-emrich standalone skeleton on 2026-04-20 and scrubbed to a
neutral LACOP-shape starting point:

- Single placeholder tenant in `src/data/mock.ts` (`slug: "template"`, empty
  social_links/stats/agencies/custom_links, `display_name: "Template Placeholder"`).
- `DEFAULT_SLUG = "template"` in `src/lib/lacop.ts`.
- Site URL placeholder `template.lacop.site` in `layout.tsx`, `robots.ts`,
  `sitemap.ts`.
- Removed the lea-specific atmospheric blur-orb ornament from `HomeClient.tsx`;
  replaced with a comment reminding scaffolders to add a site-unique signature.
- Kept: full four-route shell (`/`, `/portfolio`, `/about`, `/contact`,
  `/impressum`), empty-state-everywhere rendering, LACOP resolver contract,
  DE copy table, LACOP-DATA-SHAPE.md at repo root.
