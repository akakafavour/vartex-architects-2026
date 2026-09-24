# VARTEX — Master Testing Checklist (Mobile + Desktop)

> Use this after ALL correction batches are done, before pushing.
> Test every page at: mobile ~412px width AND desktop ~1440px width.
> Site runs locally with `npm run build && npm start` → http://localhost:3000

## Legend
- [ ] = not yet verified
- [x] = verified OK on mobile AND desktop (unless noted)

---

## 1. Home (`/`)
- [ ] Hero: "00 / INTRO" label, headline, spacing above/below correct
- [ ] Intro paragraph reads "Here at Vartex Architects we design buildings that last, combining solid engineering with creative and thoughtful design." (B5 — final wording per client)
- [ ] VIEW PROJECTS / OUR PHILOSOPHY buttons → spacing below is the APPROVED look (B1#5, do not change)
- [ ] Philosophy section: "01 / PHILOSOPHY" label style consistent
- [ ] Selected Works header: heading + link on the SAME line on mobile AND desktop; link pushed fully right, bold, one straight line (never wraps), 18px bold arrow (B5, client messages)
- [ ] Process section: "02 / PROCESS" label; VIEW DETAILED PROCESS same treatment — same line, right, bold, 18px arrow, full color in light AND dark mode (B5)
- [ ] Services teaser cards: no leftover gaps; numbers "01"/"02" present
- [ ] Hero image carousel slides without glitches

## 2. Portfolio (`/portfolio`)
- [ ] Title block "PROJECTS." spacing looks right
- [ ] Category tabs: the two lines above/below the tab row run EDGE-TO-END (full width, like journal page) — mobile AND desktop (B3#2)
- [ ] NO third line / empty band below the tabs — first project card sits close under the tab row (B3#2)
- [ ] Filter tabs work (ALL / RESIDENTIAL / COMPETITION / INSTITUTIONAL / SELECTED WORKS)
- [ ] Grid gap between rows reasonable; card hover animations fine on desktop

## 3. Project detail (`/project/the-haven` and one more)
- [ ] Desktop + mobile: gap between the metadata row (CLIENT/LOCATION/…) and "PROJECT OVERVIEW." is moderate (halved in B4#4)
- [ ] Mobile: READ MORE sits close under the clamped text (B1#3)
- [ ] Mobile: whitespace between READ MORE and the first image is small (B1#3)
- [ ] READ MORE expands/collapses the text correctly
- [ ] Metadata row (CLIENT / LOCATION / YEAR / AREA / STATUS) spacing OK
- [ ] Image gallery scrolls/loads fine, numbering overlay "01 / 08" correct

## 4. Services index (`/services`)
- [ ] No whitespace between navbar and "03 / SERVICES" label (B1#4/#7)
- [ ] Space below the intro paragraph before the service cards is modest (B1#4/#7)
- [ ] Card images reveal by sliding up with NO bounce/snap-back feeling (B3#3)
- [ ] After reveal completes, image does NOT jump/shrink (watch for the "shrunk to corner" glitch from voice note 2 — screenshot still coming)
- [ ] Desktop: hover zoom on card images is smooth
- [ ] Mobile: tap zoom does not stick/snap weirdly
- [ ] "01"/"02" numbers, EXPLORE THIS SERVICE links fine
- [ ] COORDINATED ENGAGEMENT + FAQ sections spacing OK

## 5. Service detail (`/services/architecture`, `/services/interior`)
- [ ] No gap between breadcrumb bar and "01 / SERVICE DIRECTORY" (B1#6)
- [ ] Gap below RECEIVE SERVICE GUIDE / START A PROJECT buttons is small (B1#6)
- [ ] Hero image FILLS its container (this is where the shrink glitch was reported — verify on both viewports)
- [ ] Hero image reveal animation clean, no bounce
- [ ] Approach text slide-in OK, tiers/pricing table OK
- [ ] HOW WE WORK + LET'S BUILD sections spacing OK
- [ ] RECEIVE SERVICE GUIDE modal opens/closes fine

## 6. Process (`/process`)
- [ ] Steps timeline + images OK
- [ ] "THE RESULT / ARCHITECTURAL EXCELLENCE." block: whitespace above (border line) and below (before footer) much reduced (B3#4)
- [ ] No horizontal scroll anywhere on this page

## 7. Footer (all pages, mobile + desktop)
- [ ] Logo and "Architecture built on precision and purpose." sit together as ONE tight block — tagline right under the wordmark (B1#2 + B3#1)
- [ ] Header logo (top of page) unchanged by footer fix — same size as before
- [ ] SOCIALS icons row OK, CONTACT US numbers/email OK
- [ ] Privacy/Terms + copyright bar OK

## 8. Global checks (every page)
- [ ] No horizontal scrollbar at 412px and 1440px
- [ ] Navbar links + START A PROJECT button work
- [ ] Dark mode / light mode both sane (where applicable)
- [ ] No console errors on load
- [ ] All animations (reveals, hover) feel smooth — nothing snaps or bounces
- [ ] Images all load (no broken/lazy-load failures)

---

## Change log (what each batch changed, for traceability)
- **Revert** (`b99aa68`): undid failed whitespace/label pass (5243853, 0601ee6, 7ae446b, c327d7e); kept copy handoff (ffd6235). Labels like "02 / PROCESS" restored.
- **Batch 1** (`b9b6f95`): B1#1 intro text already had "and"; B1#2 footer brand block tightened; B1#3 project detail READ MORE + gap below; B1#4/#7 services index top+bottom; B1#6 service detail top+bottom; B1#8 portfolio filter→grid gap.
- **Batch 3** (`0076fec`): footer tagline tucked under logo (negative margin over baked-in PNG padding — PNG itself untouched so header stays same); portfolio category band moved to its own full-width section, third line + dead band removed, grid pulled up; services card reveal now clip-only (GSAP no longer writes transforms onto elements with CSS transition-transform — root cause of the bounce); process CTA whitespace reduced (mt-32→16, py-24→14 on desktop).
- **Batch 4** (`40a2c22`): intro copy restored to "VARTEX designs buildings that last, combining solid engineering with creative, thoughtful design." (replaces the "Here at Vartex Architects…" handoff text — user's final wording, note: comma, no "and"); SEE MORE PROJECTS + VIEW DETAILED PROCESS links: full color, 16px arrow (same as hero featured-project glassmorphism chip), whitespace-nowrap (one straight line), right-aligned on mobile (self-end sm:self-auto); project detail: gap between metadata row and PROJECT OVERVIEW halved (py-32 → py-16).
- **Pending**: shrunk-hero-image glitch screenshot (voice note 2) — user will send; voice-note follow-ups in final batch.
