# IEEE YorkU Frontend Quality Audit

Date: 2026-03-15  
Scope: client frontend + server UI data contracts  
Method: source inspection, lint/build diagnostics, frontend-design anti-pattern review, targeted WCAG checks

## Anti-Patterns Verdict
Fail: the experience still reads as template-like and partially AI-generated.

Specific tells found against frontend-design anti-pattern guidance:
- Hero metric-strip template (250+, 15+, 7) dominates above actionable content in client/src/components/HeroSection.jsx:41,45,49.
- Heavy decorative gradients and animated geometric overlays are still primary visual language in client/src/components/HeroSection.jsx:4,8,9,10,11,12,13.
- About and Team sections continue the repeated rounded card/grid motif with little structural variation in client/src/pages/Home.jsx:129 and client/src/pages/Home.jsx:241.

## Executive Summary
- Total issues: 12
- By severity: 2 Critical, 4 High, 4 Medium, 2 Low
- Most critical issues:
  1. Sponsor ticker auto-moves with no keyboard/touch pause/stop control.
  2. Join the Team CTA is still a dead link.
  3. Past events category contract mismatch causes empty/undefined badge label.
  4. Lint gate fails (1 error, 2 warnings), blocking clean CI quality gate.
  5. Color-system normalization is incomplete in light mode.
- Overall quality score: 70/100
- Recommended next steps: resolve accessibility and data-contract blockers first, then close lint gate, then normalize color/performance patterns.

## Detailed Findings by Severity

### Critical Issues

1) Auto-moving sponsor content has no reliable pause/stop control ✅
- Location: client/src/components/SponsorRibbon.jsx:114,132 and client/src/index.css:9,18
- Severity: Critical
- Category: Accessibility
- Description: Sponsor logos continuously animate via animate-scroll-left when ticker mode is active. There is no explicit pause/play control for keyboard/touch users.
- Impact: Motion-sensitive users and keyboard users cannot reliably pause moving content.
- WCAG/Standard: WCAG 2.2.2 Pause, Stop, Hide (Level A)
- Recommendation: Add persistent pause/play control, keyboard operability, and touch-accessible stop behavior.
- Suggested command: /harden

2) Primary CTA is non-functional
- Location: client/src/pages/Home.jsx:171
- Severity: Critical
- Category: Accessibility
- Description: Join the Team uses href="#" and does not perform meaningful navigation or action.
- Impact: Primary conversion path is broken, reducing trust and creating keyboard no-op behavior.
- WCAG/Standard: Operable control reliability (functional interaction requirement)
- Recommendation: Point to a real route/section or convert to actionable button logic.
- Suggested command: /clarify

### High-Severity Issues

3) Past events category contract mismatch causes undefined category label ✅
- Location: server/data.js:69,85 and client/src/components/PastEventsCarousel.jsx:24,112
- Severity: High
- Category: Responsive
- Description: Past event entries do not include category, while the carousel renders currentSlide.eventCategory in the badge.
- Impact: Users see empty/ambiguous event classification, reducing comprehension.
- WCAG/Standard: Robustness/content clarity
- Recommendation: Add category for all past events or render a safe fallback string.
- Suggested command: /harden

4) Lint gate currently fails
- Location: client/src/components/HeroSection.jsx:54, client/src/components/EventCard.jsx:2, client/src/components/TeamCard.jsx:3
- Severity: High
- Category: Performance
- Description: Current lint output shows one error (react/no-unescaped-entities) and two warnings (unused symbols).
- Impact: CI quality gate fails and warning debt obscures real defects.
- WCAG/Standard: Engineering quality standard
- Recommendation: Resolve lint violations and enforce clean lint before merge.
- Suggested command: /polish

5) Light-mode color-system normalization is incomplete
- Location: client/src/index.css:70,72 and client/src/App.jsx:8
- Severity: High
- Category: Theming
- Description: Styling uses mixed primitives (hard-coded section values plus utility literals), which makes color behavior harder to keep consistent.
- Impact: Visual consistency and maintainability degrade as sections evolve.
- WCAG/Standard: Design-system maintainability expectation
- Recommendation: Normalize to a single light-mode token strategy and keep values centralized.
- Suggested command: /normalize

6) Hero composition is still template-like and content-secondary
- Location: client/src/components/HeroSection.jsx:41,45,49 and client/src/components/HeroSection.jsx:4,8,9,10,11,12,13
- Severity: High
- Category: Theming
- Description: Metric-strip + decorative geometry currently dominates over mission and next-step actions.
- Impact: Distinctiveness and clarity are reduced; page feels generic.
- WCAG/Standard: Frontend-design anti-pattern guidance
- Recommendation: Shift hero priority to value proposition and next action, reduce ornament load.
- Suggested command: /distill

### Medium-Severity Issues


8) Broad transition-all and backdrop blur usage may hurt rendering performance ✅
- Location: client/src/components/Header.jsx:24,61 and client/src/pages/Home.jsx:85,118,190,233
- Severity: Medium
- Category: Performance
- Description: Originally present in large visible containers. These have now been replaced with property-specific transitions and non-blurred section surfaces.
- Impact: Paint/compositing pressure from these specific hotspots is reduced, especially during scroll.
- WCAG/Standard: Rendering performance best practice
- Recommendation: Transition only specific properties and reduce large-area blur surfaces.
- Suggested command: /optimize

9) Color styling still relies on hard-coded values outside token system ✅
- Location: client/src/App.jsx:9,10,11,12,14 and client/src/index.css:72
- Severity: Medium
- Category: Theming
- Description: Section gradients and root colors are now consumed through semantic CSS tokens, replacing prior hard-coded section hex usage in app-level theming.
- Impact: Theme consistency and maintainability are improved through centralized token control.
- WCAG/Standard: Design-system maintainability standard
- Recommendation: Move to semantic color tokens consumed uniformly.
- Suggested command: /normalize

10) Carousel dot controls remain tiny touch targets ✅
- Location: client/src/components/PastEventsCarousel.jsx:190 and client/src/components/ImageCarousel.jsx:109
- Severity: Medium
- Category: Responsive
- Description: Dot visuals remain compact while interactive hit areas were expanded to touch-safe wrappers in both carousels.
- Impact: Mis-taps are reduced on touch devices while visual density is preserved.
- WCAG/Standard: WCAG 2.5.5 Target Size (AAA) / mobile usability best practice
- Recommendation: Add invisible hit-area wrappers or increase interactive area while preserving visual size.
- Suggested command: /adapt

### Low-Severity Issues

11) Generic social destination URLs reduce trust
- Location: client/src/pages/Home.jsx:321,330,339
- Severity: Low
- Category: Accessibility
- Description: Social links still point to platform homepages rather than official IEEE YorkU profiles.
- Impact: Users can be misdirected and confidence decreases.
- WCAG/Standard: Content trustworthiness and clarity
- Recommendation: Replace with verified official profiles or hide until available.
- Suggested command: /clarify

12) Production console error logging is still present in data-fetch paths
- Location: client/src/App.jsx:50,83
- Severity: Low
- Category: Performance
- Description: console.error remains in user-facing data loading flows.
- Impact: Can leak implementation noise and clutter production logs.
- WCAG/Standard: Engineering hygiene
- Recommendation: Route through centralized error handling/telemetry abstraction.
- Suggested command: /polish

## Patterns and Systemic Issues
- Motion defaults to always-on (ticker + floating effects) without user motion controls.
- Visual styling overuses gradients/blur/transition-all as polish primitives instead of hierarchy.
- Color architecture is still value-based (hex literals) rather than semantic-token-based.
- Content/data contracts are not consistently enforced across server payloads and UI expectations.

## Positive Findings
- Modal dialog implementation is now robust with role/aria, focus trap, Escape handling, and focus return in client/src/components/MessageModal.jsx:116,117,120.
- Sponsor pipeline is API-driven with explicit loading/error/retry paths in client/src/App.jsx:40,45 and client/src/pages/Home.jsx:211,215,221.
- Major touch targets are improved in core controls (header menu, nav items, team social, past-events arrows).
- Typography has improved identity with a purposeful Sora/Manrope pairing in client/src/index.css:1,70,86.
- Build succeeds with moderate bundle output (JS about 219 KB, CSS about 36.34 KB).

## Recommendations by Priority
1. Immediate
- Add accessible pause/stop control for sponsor ticker motion.
- Replace dead Join the Team CTA with real behavior.
- Fix past-events category data contract mismatch.

2. Short-term
- Resolve lint failures and enforce a clean lint gate.
- Add reduced-motion behavior for continuous animations.
- Fix tiny carousel dot hit areas.

3. Medium-term
- Implement semantic token-based color styling for the light-mode system.
- Reduce transition-all/backdrop-blur usage to targeted, performant transitions.

4. Long-term
- Rework hero composition to reduce template fingerprints and improve narrative clarity.
- Replace generic social placeholders with official branch profiles.

## Suggested Commands for Fixes
- Use /harden to address 4 issues: motion pause control, reduced-motion support, category fallback/data robustness, interaction reliability.
- Use /clarify to address 2 issues: dead CTA path and social destination correctness.
- Use /polish to address 2 issues: lint gate cleanup and production logging hygiene.
- Use /normalize to address 2 issues: semantic color tokens and value-centralization.
- Use /adapt to address 1 issue: carousel dot touch target sizing.
- Use /optimize to address 1 issue: expensive broad transitions/blur.
- Use /distill to address 1 issue: hero simplification and hierarchy reset.

## Verification Notes
- Lint result: failed (1 error, 2 warnings).
- Build result: success; output includes dist/assets/index-Dece9-Z_.js at 219.08 KB and dist/assets/index-GnbyNqrN.css at 36.34 KB.
- Codebase checks confirm no reduced-motion media query in client/src/index.css.
- Optimization pass confirms no transition-all/backdrop-blur usage remains in the originally flagged Header/Home locations.
