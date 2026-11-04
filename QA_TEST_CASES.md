# Portfolio QA Test Plan

**Scope:** Current static GitHub Pages portfolio (`index.html`, `assets/js`, `assets/css`). The checks focus on JavaScript/data integrity, core interactions, media rendering, responsive behavior, and common client-side security risks.

**Limit:** “Every line” coverage is not a useful target for HTML/CSS and would require browser instrumentation for JavaScript. This plan checks each feature path and security boundary; it does not claim 100% line or branch coverage.

| ID | Priority | Area | Test case | Expected result |
|---|---|---|---|---|
| QA-001 | P0 | Code integrity | Parse every portfolio JavaScript file | All scripts parse with no syntax errors |
| QA-002 | P0 | Data integrity | Load the config, project, skill, education, experience, and certification data files | Each file defines its expected array/object; project IDs are unique |
| QA-003 | P1 | Navigation | Check section IDs and internal navigation links | Every internal link resolves to one unique section |
| QA-004 | P1 | Asset paths | Check local HTML assets and configured resume path | Referenced local files exist |
| QA-005 | P1 | Projects | Render each configured project and open its details dialog | Every project has a title; detail content and repository links are usable |
| QA-006 | P1 | Statistics | Calculate displayed project, internship, certificate, and technology statistics | Values come from configured data and render in the stats section |
| QA-007 | P1 | Theme | Toggle dark/light and load the saved preference | Theme changes; storage failures do not break the page |
| QA-008 | P1 | Mobile menu | Open and close the menu and follow a section link | Menu state and `aria-expanded` stay in sync; destination section exists |
| QA-009 | P1 | Contact | Submit empty and valid forms | Browser validation blocks missing fields; valid data creates a `mailto:` draft only |
| QA-010 | P0 | XSS | Use markup-like strings in project titles/descriptions | Text is displayed as text; it does not create executable markup |
| QA-011 | P0 | URL schemes | Pass `javascript:`, `data:`, `file:`, protocol-relative, and malformed URLs through the link validator | Unsafe/unsupported URLs are rejected |
| QA-012 | P1 | External links | Inspect links opened in a new tab | External links use `rel="noopener noreferrer"` |
| QA-013 | P1 | Video embed | Try allowed demo video URLs and untrusted hosts | Only expected video hosts are embedded; arbitrary content is not framed |
| QA-014 | P1 | Project media | Link project image, screenshot, local video, and hosted video fields | Images load with alt text; video is controlled, lazy, and usable on mobile |
| QA-015 | P1 | Media upload | Upload a project image/video from the portfolio UI | A private owner-only workflow is required; the current public static site has no uploader |
| QA-016 | P1 | Responsive | Inspect 320px, 390px, 768px, 1024px, and desktop widths | No horizontal overflow; navigation, cards, dialog, and form remain usable |
| QA-017 | P2 | Accessibility/motion | Keyboard navigation and reduced-motion preference | Controls are keyboard reachable; reduced motion avoids continuous typing/animation |
| QA-018 | P1 | Deployment | Verify Pages workflow and published static files | Workflow succeeds and the live site serves the committed version |

## Execution Results

Automated checks were run with `node --test tests/portfolio.qa.test.cjs` on 2026-11-04.

| Result | Count |
|---|---:|
| Passed | 18 |
| Failed | 0 |
| Skipped | 0 |

All 18 checks passed. The video security test executes the site's actual video URL validator with valid YouTube URLs, lookalike domains, non-HTTPS URLs, unsupported schemes, and malformed video IDs. `git diff --check` also passed.

Browser-only visual checks were not executed. QA-014 confirms both compressed MP4 files exist, are under GitHub's per-file limit, and are connected to the correct project records. Both compressed videos were also decoded for a five-second playback probe and their durations match the originals. Preview locally and check modal playback at mobile and desktop widths. The original recordings remain in the local folder and are excluded with `.gitignore`. QA-015 confirms and documents the repository-managed workflow: the public static site has no upload form, and you add/commit media files yourself.

The suite is focused coverage of data, assets, security boundaries, and interactions. It is not a claim of per-line coverage; that would need an instrumented browser run and would not meaningfully apply to CSS/HTML.
