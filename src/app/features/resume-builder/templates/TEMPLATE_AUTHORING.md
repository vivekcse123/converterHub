# Adding a resume template

The library targets 80-100 original templates (currently 50), added in
batches. This is the checklist for a new batch — read it before writing
any template code so registration doesn't get missed.

## 1. The three-file pattern

Every template is `templates/<id>/<id>-template.component.{ts,html,css}`.
Copy the structure of an existing template close to what you're building
(e.g. `templates/ats-professional/` for single-column, `templates/tech/`
for a template that uses `var(--r-accent)` directly in CSS) — don't
reinvent the wrapper boilerplate.

- **`.component.ts`**: `input.required<ResumeData>()`, plus the shared
  helpers from `templates/shared/template-helpers.ts`:
  `buildContactParts`, `formatDateRange`, `formatMonthYear`,
  `getVisibleSections`, `getSectionKind`, `getCustomSection`. Only add
  extra computed properties if the design needs them (e.g.
  `data-scientist-metrics-template.component.ts`'s `stats` computed).
- **`.component.html`**: root `<div class="resume-page my-tpl">`, a
  `@for (section of visibleSections(); track section)` loop with
  `@switch (sectionKind(section))` covering **all** cases: `summary`,
  `experience`, `education`, `projects`, `skills`, `certifications`,
  `achievements`, `languages`, `interests`, `custom`. Wrap each section in
  `class="resume-section"` and each repeated item (job, degree, project,
  custom entry) in `class="resume-entry"` — these two classes are the
  page-break atoms `ResumePreviewComponent.recalculatePages()` and the PDF
  export pipeline use to avoid splitting an entry across a page.
- **`.component.css`**: import chain is `styleUrls: ['../shared/print.css', './<id>-template.component.css']` — `print.css` gives you `.resume-page` sizing/padding and the print color-scheme lock; your file only adds the design's unique look.

## 2. Design tokens — don't hardcode colors/fonts

Every template renders inside a wrapper that sets CSS custom properties
from `computeDesignVarsCss()` (`components/preview/resume-preview.component.ts`).
Use them so the builder's color/font/spacing controls actually work:

- `var(--r-accent)`, `var(--r-accent-12)` (12% tint), `var(--r-accent-25)` (25% tint) — never hardcode the accent hex in CSS.
- `var(--r-font)` — respects the user's font-family choice. Only skip this
  (hardcode `Georgia, 'Times New Roman', serif`) if the template's whole
  identity is a fixed serif look — the existing precedent is
  `minimal-serif` and the new `serif-editorial`. Document why in a comment
  if you do this.
- Font size scales via `calc(10.5pt * var(--r-size, 1))` on `.resume-page`
  (from `print.css`) — write your text sizes as `text-[Npt]` Tailwind
  arbitrary values relative to that 10.5pt base, don't fight it with fixed px sizes.
- `var(--r-spacing)` drives line-height on `.resume-page` — leave it alone.

## 3. What "genuinely distinct" means

The bar (from prior user feedback — see memory `project_template_library.md`):
**not a recolor of an existing layout.** Each new template needs its own:

1. Header style (not just a different accent — different structure: centered vs left-aligned vs split vs banner vs letterhead, etc.)
2. Typography treatment (weight/case/tracking, not just color)
3. Spacing rhythm (compact vs generous — actually change margins, not just re-theme)
4. Section-heading treatment (underline vs filled tab vs flanking rules vs icon prefix — pick one this batch hasn't used yet)
5. Skill style (comma list vs pill tags vs progress bars vs grouped cards)
6. Entry/timeline style for experience & projects (plain block vs dot-marker vs numbered card vs bordered card)

Before starting a new template, skim the table in
`../../../../../../.claude/projects/*/memory/project_template_library.md`
(or just `data/resume-templates.data.ts`) so you don't duplicate an
existing header/heading/skill combination.

**Concrete duplicate check** (a real one slipped through in batch 3 and had
to be removed post-hoc — `pm-roadmap`/`product-sprint` and
`academic-scholar`/`research-fellow` ended up with the *exact same*
`category` + `tags` set and near-identical mechanics): before finalizing a
batch, grep the full `id | category | tags` listing (see the one-liner in
`project_template_library.md`'s "Phase 3" notes, or re-run it: extract
`id`, `category`, and `tags: [...]` per entry) and flag any two templates
whose category and tag set are identical or near-identical. If two are
that close, only keep both if their core visual mechanic is genuinely
different (not just a different heading decoration) — otherwise drop the
weaker one before it ships, not after.

## 4. Registration checklist

1. `models/resume.model.ts` — add the id to the `TemplateId` union.
2. `data/resume-templates.data.ts`:
   - Import the component.
   - Add a `ResumeTemplateMeta` object to `RESUME_TEMPLATES`. Required
     fields include `tags: TemplateTag[]` (see `TEMPLATE_TAG_GROUPS` for
     the full taxonomy — style / role / career-stage / layout) and
     `pageCount: 1 | 2`. Set `isNew: true` for the current batch only —
     clear it (or just omit it) on templates from a *previous* batch when
     you next touch this file, since "Newest" should track the most
     recent batch, not accumulate forever.
   - If the template is premium, add its id to `PREMIUM_TEMPLATE_IDS`.
3. No changes needed in `data/resume-defaults.ts` — `createBlankResume`/
   `createPersonaSample` are already generic over `TemplateId` (they seed
   the accent color via `getDefaultAccentById` and don't special-case
   individual templates). Only touch that file if your template needs a
   genuinely different *sample content shape* than the existing personas
   provide.
4. Nothing else needs updating — the gallery, template-detail page,
   in-builder template picker/gallery-modal, PDF export, and pricing page
   are all data-driven off `RESUME_TEMPLATES`/`PREMIUM_TEMPLATE_IDS`.

## 5. Verify

- `ng build` (TypeScript will catch a missed `TemplateId` union entry or a
  missing required `ResumeTemplateMeta` field immediately).
- Load `/resume-templates`, confirm the card renders (give the `@defer`
  thumbnail a moment) and that the new tags show up correctly in the
  "More Filters" drawer.
- Load `/resume-templates/<slug>`, open the full preview, cycle next/prev,
  try the desktop/mobile/A4 toggle, and click "Use Template" through to
  the builder.
- Fill in a longer sample resume and check the page-break guides in the
  preview (needs `resume-section`/`resume-entry` classes applied
  correctly, per §1) plus an actual PDF export for text overlap.

## Roadmap

77/80-100 templates (80 shipped in batch 3/v6, then 3 removed the same day
as duplicates: `pure-minimal` duplicated the pre-existing `minimal`
template; `product-sprint` and `research-fellow` each had the exact same
`category` + `tags` as `pm-roadmap` and `academic-scholar` respectively —
see the "Concrete duplicate check" in §3). Before starting a batch 4,
confirm with the user whether to keep pushing toward 80-100 or treat the
library as complete near its current size. If continuing, re-run a
tag-frequency count against `data/resume-templates.data.ts` before picking
the new batch's designs — grep `tags: \[` and tally, or ask a fresh
session to do it — since which categories are "thin" shifts
after every batch. Also two-column templates (7 added in batch 3, using
the `sidebar-right`/`executive-serif` `mainSections()`/`sidebarSections()`
split pattern) are now well represented — lean back toward single-column
and toward whichever category/tags are thinnest at the time.
