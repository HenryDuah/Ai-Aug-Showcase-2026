# Sand Technologies — Design & Prototyping Guidelines

A shared reference for designers, PMs, engineers, and AI tools building prototypes and product surfaces for SandOS. This document covers brand voice, visual foundations, component usage, UX laws, accessibility, and the process we follow from sketch to ship.

If you have thirty seconds, read **§1 Principles** and **§2 Voice**. Everything else is detail.

---

## 1. Principles

Four principles govern every Sand interface. When two collide, they're listed in priority order.

1. **Operator first.** Our users are experts working in difficult conditions with inadequate tools. Design for the 2 a.m. burst-main call, not the Monday-morning demo. Reduce the number of clicks, the ambiguity of labels, and the cognitive load of alarms. Never condescend.
2. **Truth over polish.** Every number on screen must be traceable to a sensor, a model, or a record. Never invent a trend line to fill a card. If data is stale, say so. If confidence is low, show the interval.
3. **Clarity respects the audience.** No mystery meat icons. No marketing adjectives in product copy ("powerful", "seamless", "intelligent"). Name the thing. Precise language is a form of respect.
4. **Consequential, not dramatic.** Sand works on water, energy, healthcare — things that matter. Gravity is present without melodrama. No red exclamation marks unless someone needs to act right now. No confetti.

---

## 2. Voice & content

### The voice in one line
**An engineer who can sell.** Not a salesperson who has learned some engineering terms.

### Rules

| Do | Don't |
|---|---|
| "311 confirmed bursts detected in Q3." | "Significant operational improvements." |
| "Deployed in Cape Town since March 2024." | "Trusted by leading utilities worldwide." |
| "Pressure dropped 1.4 bar at node 7B at 03:12." | "Anomaly detected." |
| "Acknowledge" / "Dismiss" / "Escalate" | "Got it!" / "Whoops!" / "Let's go" |
| Active voice, second person ("You have 4 unreviewed alerts.") | Passive, corporate ("Alerts are pending review.") |
| Title Case for screens & nav. Sentence case for buttons, menu items, labels. | ALL CAPS (reserved for section eyebrows in docs only). |

### Copy checklist (run before shipping a screen)
- [ ] Can every stated number be traced to a source? Can you click through to it?
- [ ] Are units explicit (bar, L/s, m³/day, mg/L Cl)? No naked numbers.
- [ ] Are timestamps qualified ("2 min ago", "03:12 SAST", "as of 04:00")?
- [ ] Does every button verb describe the exact action? ("Acknowledge" not "OK".)
- [ ] Have you removed all adjectives that can't be proven? ("Comprehensive", "advanced", "smart".)
- [ ] Is the empty state specific? ("No alerts in the last 24h" beats "Nothing here yet".)

### Casing & numbers
- Metric: `1,284` with thin-space thousand separator in product charts where possible, comma in copy.
- Percentages: `87%` (no space). In tables of percentages, align right.
- Units after number with a non-breaking space: `4.2 bar`, `320 L/s`, `6.1 mg/L`.
- Locations in copy are **named**: "Khayelitsha DMA" not "the affected district".
- Never use emoji in product UI. In internal Slack and docs - fine, in moderation.

---

## 3. Visual foundations

### Logo

| Variant | When |
|---|---|
| `sand-logo-dark.svg` - wordmark on light | Default on white/neutral surfaces. |
| `sand-logo-light.svg` - wordmark on dark | Dark app chrome, dark hero sections. |
| `sand-logo-mark.svg` - A-mark only | Favicon, app icons, tight sidebar collapse, chips. |

Clear space = height of the "A" on all sides. Minimum size: wordmark 64 px wide; mark 16 px. Never recolor the gradient. Never stretch, outline, or drop-shadow.

**Usage rules**
- Primary action: `--brand-purple` on light, white on dark. One primary per screen.
- Alarms use `--danger`. Warnings use `--warning`. Success confirmations use `--success`. Never use brand purple for state.
- Charts: start with neutral-700 for the primary series, add semantic colors only for thresholded lines.
- No bluish-purple gradient backgrounds on cards. The logo gradient lives in the logo.

### Typography

Two families. No third.

```
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: "Lilex", "Roboto Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

- **Inter** (variable, with the optical-size axis) for everything in product + marketing.
- **Lilex / Roboto Mono** for values, IDs, timestamps, log lines, coordinates - anything that is data or system metadata.
- Both self-hosted as variable TTFs from `/fonts/`. Canonical `@font-face` rules live in `colors_and_type.css`.
- Do not use serifs. Do not use display faces.

**Type scale** (product)

| Token | Size / line | Weight | Use |
|---|---|---|---|
| `display` | 48 / 56 | 700 | Landing heroes only |
| `h1` | 30 / 36 | 700 | Page title |
| `h2` | 24 / 32 | 600 | Section heads |
| `h3` | 20 / 28 | 600 | Card titles |
| `body` | 14 / 20 | 400 | Default |
| `small` | 12 / 16 | 400 | Table meta, captions |
| `metric` | 30 / 36 | 600 mono | KPI values |
| `code` | 13 / 20 | 400 mono | IDs, timestamps |

Minimums: 12 px in dense tables, 14 px everywhere else, 16 px in marketing body.

### Spacing, radius, elevation

- **Spacing scale** (4 px base): `0, 4, 8, 12, 16, 24, 32, 48, 64, 96`.
- **Radius**: `--r-sm: 6px` (buttons, inputs) / `--r-md: 8px` (menu items, badges) / `--r-lg: 12px` (cards, dialogs). Nothing is fully round except avatars and status dots.
- **Borders**: 1 px `--neutral-200` on light, 1 px `--neutral-800` on dark. Borders before shadows.
- **Elevation**: Sand uses **two shadow steps**, not five.
  - `shadow-1`: `0 1px 2px rgba(0,0,0,0.05)` - resting cards, buttons.
  - `shadow-2`: `0 8px 24px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` - menus, popovers, drawers.
- No glows, no neon borders, no glassmorphism in product.

### Motion

Restrained. Infrastructure dashboards should not bounce.

- **Durations**: 120 ms (hover), 180 ms (state change), 240 ms (enter), 320 ms (cross-screen). Never >400 ms.
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` for enters, `cubic-bezier(0.4, 0, 1, 1)` for exits.
- No spring bounces on alarms, charts, or map pins. Springs are fine on non-critical micro-interactions (toggles, small badges).
- Respect `prefers-reduced-motion: reduce` - kill all non-essential motion.

### Backgrounds & imagery

- Product: flat neutrals. No patterns, no textures, no hand-drawn illustrations.
- Marketing hero: the Sand gradient is allowed as a single full-bleed band, **with** a plate of solid neutral behind all copy.
- Photography is cool-toned, on-site, operator-in-frame. No stock handshakes. No abstract data viz as photograph.

### Corners on imagery

12 px radius on photography in cards; 0 px when full-bleed.

---

## 4. Component system

We use **shadcn/ui + Tailwind v4** as the component substrate. The Figma library mirrors it 1:1. Before inventing, check the library.

### Component inventory (what we have)
Accordion · Alert · Alert Dialog · Avatar · Badge · Breadcrumb · Button · Button Group · Calendar · Card · Carousel · Chart · Checkbox · Collapsible · Combobox · Command · Context Menu · Data Table · Date Picker · Dialog · Drawer · Dropdown Menu · Empty · Field · Form · Hover Card · Input · Input Group · Input OTP · Item · Kbd · Label · Menubar · Micro Button · Navigation Menu · Pagination · Popover · Progress · Radio Group · Resizable · Scroll Area · Select · Separator · Sheet · Sidebar · Skeleton · Slider · Sonner · Spinner · Switch · Table · Tabs · Textarea · Toggle · Toggle Group · Tooltip.

### Button hierarchy (one primary per screen)

| Variant | Purpose | Example |
|---|---|---|
| **Primary** (solid brand purple / white-on-dark) | The one next action | "Acknowledge alert" |
| **Secondary** (outline) | Common but non-primary | "Export CSV" |
| **Ghost** (text only) | Tertiary / in-line | "Cancel" |
| **Destructive** (solid danger) | Irreversible, user-driven | "Delete schedule" |
| **Icon** (square, ghost/outline) | Compact table actions | Row menu |

States for all buttons: `default, hover, active/pressed, focus-visible, disabled, loading`. Never skip focus-visible.

### Alerts & alarms (critical - this is infrastructure)

- **Info** (blue): telemetry or status updates. No action required.
- **Warning** (amber): thresholds approached. Action recommended.
- **Critical** (red): thresholds breached. Action required now.
- **Resolved** (green): for audit trails only. Don't flash green at someone mid-incident.

Every alarm row has: **timestamp · asset · signal · value · threshold · acknowledged-by**. Never less.

### Empty states

Three lines, max:
1. What would be here (one line, specific).
2. Why it's empty right now (one line, specific).
3. One action (primary button) - or nothing.

> "No alerts in the last 24 hours.\nLast alert: 03:12 SAST, Khayelitsha DMA.\n[View history]"

### Data tables

- Left-align text, right-align numbers, center only icons.
- Column titles sentence case, not ALL CAPS.
- Numeric columns: mono font, tabular-nums.
- Row height 40 px default, 32 px dense, 56 px comfortable.
- Sticky header on scroll. Column resizing if >5 columns. Sort on headers.
- Selection with checkboxes on the left; bulk action bar docks above the table when anything is selected.
- Row-hover = `--neutral-50` on light, `--neutral-900` on dark. No row striping.

### Charts

- One series → `--neutral-700` line, 2 px.
- Two series → primary neutral + `--brand-purple` or `--brand-blue`.
- Three+ → ordered palette (see color system above); never more than 5 series on one chart.
- Gridlines: horizontal only, `--neutral-200`, dashed.
- Axis labels mono. Tooltip is a single card with: label (top, small caps), value (metric style), context (small muted).
- Always show units in the axis title.
- **Active titles preferred.** "Pressure dropped 12% since shift start" not "Pressure over time." The title tells the insight, not the topic.
- **Annotation**: mark threshold lines, anomaly events, and policy changes directly on the chart with labeled vertical lines. One annotation callout for the most important data point.
- **Chart-to-table fallback**: every chart must have a data-table alternative accessible via a "View data" link for screen readers and for operators who need exact values.
- **Sparklines**: legible down to 80 px wide. No axes, no gridlines — shape only. Test this.
- **Small multiples**: use instead of multi-line charts when you have >5 series. Same scale across all panels. Same axis labels. Let the operator compare visually.
- Y-axis starts at zero for bar/column charts. Line charts may use a non-zero baseline only when the variation is the story and the axis clearly labels the range.

---

## 5. UX laws we consciously apply

A working checklist. Not theoretical — each one points to how we apply it at Sand.

### Hick's Law — More choices = slower decisions
- Keep primary nav ≤ 7 items.
- Collapse infrequent actions behind a "…" menu.
- Alarm actions: Acknowledge, Escalate, Snooze, Resolve. Not eight options.

### Fitts's Law — Target size and distance
- Min hit target: **44 × 44 px** (mobile & touch) / **32 × 32 px** (desktop mouse with hover).
- Primary actions live at screen corners or along edges (infinite effective size).
- Dangerous actions live **away** from primary flow and never next to "Save".
- Touch target **spacing**: minimum 8 px between adjacent interactive targets. Touching targets cause misclicks even when each individually meets size requirements.

### Miller's Law — ~7 items in working memory
- Group form fields in 5–7 item sections. Separator or legend between groups.
- Dashboards: ≤ 6 KPIs above the fold; more is noise.

### Jakob's Law — Users expect your product to behave like others
- Follow shadcn/Tailwind conventions unless you have a specific reason.
- Esc closes dialogs. Cmd/Ctrl+K opens command. ⌘+S saves. Arrow keys navigate lists. Enter submits.
- Don't invent new drag affordances if a standard one applies.

### Doherty Threshold — Response < 400 ms
- Any action that takes > 100 ms shows an optimistic state or spinner.
- Skeleton loaders, not spinners, for anything with known layout.
- Streaming data UIs must show "last updated" + stale indicator after 10 s of no update.

### Aesthetic-Usability Effect
- A clean layout feels more usable — but never bury function for aesthetics. Test whether operators can find the alarm in < 3 s under fluorescent light.

### Serial Position (Primacy & Recency)
- Put the most important nav item first, secondary last, boring stuff in the middle.
- Alarms: newest and most severe first; resolved at the bottom.

### Law of Proximity & Common Region
- Related controls inside the same card.
- Whitespace > borders > background tints > cards, in that order of separator strength.

### Von Restorff Effect (Isolation Effect)
- The item that differs from the rest is remembered. Use this for critical alarms — a single red row in a table of neutrals draws the eye. Don't dilute it by making multiple items visually distinct.
- Corollary: if everything is highlighted, nothing is highlighted. Reserve visual emphasis for what genuinely needs attention.

### Gestalt principles (beyond Proximity)
- **Similarity**: items that look alike are perceived as related. Use consistent visual treatment for similar data types across screens. All sensor values look the same; all alerts look the same.
- **Continuity**: the eye follows the smoothest path. Align elements along clear axes. Don't break alignment for decoration.
- **Closure**: the mind completes incomplete shapes. Use this for progress indicators — a partial ring or bar implies "almost done."
- **Figure-ground**: make the active element (figure) clearly distinct from the background. Critical in dense dashboards — the selected card, the active filter, the current alarm must pop.

### Peak-End Rule
- Pay extra attention to the moment an alarm clears, a report exports, an onboarding ends. These are remembered.

### Goal-Gradient & Zeigarnik
- Show progress for multi-step flows (onboarding, asset provisioning).
- Don't auto-dismiss "saved" confirmations in < 2 s if the save took > 2 s — users want to see the landing.

### Tesler's Law (conservation of complexity)
- Complexity is fixed; somebody absorbs it. Push it to the system, not the operator. If a calculation is hard, pre-compute.

### Postel's Law
- Be liberal on input (accept `3.2 bar`, `3.2bar`, `3,2 bar`), strict on output (always render `3.2 bar`).

### Weber's Law — Just noticeable difference
- When values change, the change must be perceptible. For numerical data: highlight delta values ("+0.3 bar", "−12%") alongside absolutes. For visual changes: a 1 px border change is invisible; a color shift is noticeable. Don't rely on subtle changes to communicate important state shifts.

### Parkinson's Law — Task expands to fill available time
- Set deadlines on operator tasks that require response. Show time-since-alert to create urgency. But never use countdown timers that auto-execute — graduated urgency, not automated escalation.

---

## 6. Accessibility (non-negotiable)

We target **WCAG 2.2 AA** for all product surfaces. AAA where text is critical (alarms, legal, compliance).

### Color & contrast
- Body text ≥ **4.5:1** against background. Large text (≥18.66 px bold or ≥24 px regular) ≥ 3:1.
- UI components (borders, focus rings, icon-only buttons): ≥ 3:1 against adjacent surfaces.
- **Never** rely on color alone. Every state carries an icon or label:
  - Critical: red + `AlertCircle` filled icon + "Critical" label
  - Warning: amber + `AlertTriangle` icon + "Warning" label
  - Success: green + `CheckCircle` icon + "Resolved" label
  - Info: blue + `Info` icon + "Info" label

### Keyboard
- Every interactive element reachable by Tab.
- Focus order matches visual order.
- Focus ring: 2 px solid `--brand-purple`, offset 2 px. Visible on every focusable element. Never `outline: none` without a replacement.
- Skip-to-content link at top of every page.
- Shortcuts documented in `⌘+/` help overlay.

### Screen reader
- Semantic HTML first. `<button>` not `<div onClick>`.
- Every icon-only button gets `aria-label`.
- Live regions for alarms: `role="status"` for info/warning, `role="alert"` for critical.
- Data tables: real `<table>` with `<th scope>`, `<caption>`.
- Charts: include a text summary or data-table alternative accessible via "View data" link.
- Landmark roles: `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>` on every page.

### Motion & flashing
- Honor `prefers-reduced-motion`.
- No flashing > 3 Hz. No strobing alarms.
- Essential animations (loading indicators) reduce to opacity-only transitions under reduced motion.

### Target size
- WCAG 2.2: interactive targets ≥ 24 × 24 CSS px. We go 32 × 32 desktop, 44 × 44 touch.
- Minimum 8 px spacing between adjacent targets.

### Language & input
- `lang` attribute set. Dates/numbers localized per deployment region.
- Form fields: always visible label (not just placeholder). Error messages tied by `aria-describedby`.
- Never auto-focus inside dialogs without a dismiss affordance.
- Placeholder text is supplementary — it disappears on input and is not read reliably by all screen readers.

### Cognitive accessibility
- Reading level: aim for Grade 8 (Flesch-Kincaid) for all operator-facing copy. Technical terms from the glossary (§ Appendix A) are exceptions — operators know their domain vocabulary.
- One idea per sentence. Short paragraphs.
- Avoid double negatives. "Enable auto-acknowledge" not "Disable manual acknowledgment override."
- Consistent terminology: if you call it "DMA" on one screen, don't call it "District" on another.

### Test matrix before release
- Keyboard only: can you complete the core task?
- Screen reader: VoiceOver (Mac), NVDA (Win) — at minimum one pass.
- 200% zoom: does layout still work? No horizontal scroll (WCAG 1.4.10).
- Color-blind sim (Deuteranopia + Protanopia): do states still read?
- Contrast pass via axe DevTools.
- Touch target audit: verify size AND spacing.

---

## 7. Process — from idea to ship

### 1. Define (before pixels)
- **Problem statement**: one sentence. "Operators miss 15% of early-warning burst signals overnight."
- **User & context**: named persona, named site, realistic conditions.
- **Success metric**: pre-write the number the design will move. "Reduce time-to-acknowledge from 14 min to < 5 min."
- **Constraints**: SCADA latency, data sovereignty, existing tools the operator won't abandon.

### 2. Research
- Shadow an operator (or read the last 5 shift logs).
- Pull 3 reference interfaces (not all competitors — look at aviation, grid, ICU).
- Check Figma library for existing components that cover 80% of the need.

### 3. Sketch & flow
- Low-fi first. 3 alternate layouts on paper or greybox. Kill two.
- Happy path + two edge cases + one failure state. Always.

### 4. Prototype
- Use shadcn components from the Figma library. Don't re-draw what exists.
- Real data shape, real units, real asset names. No Lorem Ipsum.
- Empty, loading, error, stale — all four states per view.

### 5. Review
- **Self-review**: run the copy checklist (§2) and a11y checklist (§6).
- **Peer design review**: bring the problem statement + metric. Don't open with "here's the design".
- **Engineering sync** before high-fidelity polish. Confirm data is available at the cadence you're showing.

### 6. Usability test
- 3–5 operators or close proxies.
- Task-based, not opinion-based. "Acknowledge the highest-severity open alarm" — time it.
- Silence is data. If they pause > 3 s, that's a design bug.

### 7. Ship
- Write release notes in Sand voice (specific, no adjectives).
- Instrument: time-to-acknowledge, error rates, abandon rates on the flow.
- Revisit in 2 weeks with real data.

### Decision log
Every significant design decision lives in a shared decision log with:
- Date, designer, problem, options considered, decision, rationale, what would change it.

---

## 8. HCI guidelines we use (Nielsen + Google)

### Nielsen's 10 heuristics — applied
1. **Visibility of system status.** Timestamp + source on every live value. Skeleton > blank. Connection status in the chrome.
2. **Match between system & real world.** Use operator vocabulary (DMA, PRV, SCADA, NRW). If the term is site-specific, honor it.
3. **User control & freedom.** Undo for everything reversible. Confirm for everything irreversible.
4. **Consistency & standards.** Follow shadcn, follow OS conventions. Variations need justification.
5. **Error prevention.** Disable destructive buttons until form is valid. Confirm destructive actions with typed input ("Type ASSET-42 to delete").
6. **Recognition over recall.** Surface recent choices. Command palette remembers last action.
7. **Flexibility & efficiency.** Keyboard shortcuts for power operators. Bulk actions for tables > 20 rows.
8. **Aesthetic & minimalist.** Every pixel earns its place. If a card can be removed without information loss, remove it.
9. **Help users recognize, diagnose & recover from errors.** Error = what happened + why + how to fix. Never just "Something went wrong."
10. **Help & documentation.** `?` next to any non-obvious term links to the glossary. Inline, not a separate site.

### Google Material / Human Interface alignment
- Where Material and shadcn overlap, follow shadcn.
- Touch targets, safe areas, system bar handling: follow the host OS (Material on Android, HIG on iOS).
- **Google ML/AI UX guidelines** (when integrating SandOS recommendations):
  - Explain confidence. Show the interval.
  - Let users correct the system. Capture the correction.
  - Disclose that AI is involved. Mark generated content.
  - Provide a path to a human.

### Apple HIG highlights we adopt
- Deference: content is primary, chrome is secondary.
- Clarity: legibility at every size.
- Depth: motion and layering communicate hierarchy, not decoration.

---

## 9. Data & AI in the UI (specific to Sand)

Because SandOS involves simulation, prediction, and recommendation — a few Sand-specific rules:

- **Label prediction as prediction.** Never show a forecast value without a badge: `Forecast · 68% confidence`.
- **Show intervals, not just points.** A predicted flow of 312 L/s ± 40 is more honest than "312".
- **Differentiate sensed vs derived.** Mono + a small dot tag: `● sensed` vs `○ modeled`.
- **Every recommendation is auditable.** Clicking "Why?" reveals inputs, model version, timestamp, and the override log.
- **Role-aware.** If an operator can't execute the recommendation, show it as advisory. If they can, show the action.
- **Never auto-execute without a receipt.** Log every automated intervention with a visible trail the operator can inspect.

### AI Copilot UI patterns

The Copilot follows the ORAR loop (Observe → Reason → Act → Reflect). The UI must make each phase visible.

**Wayfinder patterns** (getting started):
- Initial CTA: large, inviting prompt area with "Ask about any asset, alert, or network segment."
- Suggestions: surface 3–4 contextual prompts based on current view ("What caused the pressure drop at Node 7B?", "Show burst risk for Khayelitsha DMA").
- After empty results, offer refined suggestions — never leave the operator with nothing.

**Streaming UI**:
- AI responses stream token-by-token. Show a typing indicator (pulsing dot, not a spinner) while generating.
- Partial responses are readable mid-stream. Don't buffer the entire response.
- Tool calls (PostGIS queries, map navigation) show a labeled status: "Querying pipe network…", "Navigating to Node 7B…"

**Trust builders**:
- Every factual claim cites the data source (sensor ID, model version, query timestamp).
- Confidence indicators on analytical outputs. Show the interval.
- "Generated by AI" label on all Copilot outputs. Persistent, not dismissable.
- Feedback mechanism: thumbs up/down on every response. Captures signal for model improvement.

**Governor patterns** (human-in-the-loop):
- **Autonomous** actions (data queries, map navigation): execute immediately, show result.
- **Supervised** actions (crew dispatch, alert triage): show action plan → operator approves → execute.
- **Restricted** actions (valve operations, system changes): Copilot cannot execute. Shows advisory only with "Contact operator on duty."

**AI error states**:
- Model timeout: "Analysis is taking longer than expected. [Retry] or [Simplify your question]."
- No results: "I couldn't find relevant data for that query. Try asking about a specific asset or DMA."
- Low confidence: "I'm not confident in this analysis (< 40% confidence). Consider consulting the shift log directly."
- Never fabricate. If the Copilot doesn't know, it says so.

For the implementation substrate behind the Copilot — model routing, tool inventory, autonomy tiers, security posture — see **§14 Platform architecture**.

---

## 10. Map & digital twin UI patterns

SandOS is a map-first product. These patterns govern spatial interfaces.

### Layout
- **Default**: Full Map with overlay chrome. Map fills the viewport. UI floats on top.
- **Asset detail**: Partial Map (60/40 map/panel at `lg+`). Panel shows asset detail, timeline, actions.
- **Mobile**: Map full-screen with peek bar at bottom. Tap to expand into sheet.

### Feature interaction hierarchy
1. **Hover** (pointer only) → **MapTip**: transient tooltip with asset name, type, and status. 150 ms delay.
2. **Click/tap** → **Info Panel**: side panel slides in with full asset detail. Panel does not recentre the map.
3. **Right-click** (pointer) / **long-press** (touch) → Context menu with quick actions (fly-to, toggle layer, copy coordinates).

### Rich Markers
Asset markers encode live state:
- **Color**: RAG (Red/Amber/Green) mapped to risk status.
- **Shape**: circle = sensor, square = valve, diamond = pump station. Shape is the primary differentiator — never rely on color alone.
- **Size**: proportional to severity or count. Minimum 12 px diameter.
- **Pulse**: only for active critical alarms. No more than 3 pulsing markers visible simultaneously — more creates visual noise.

### Cluster markers
- Aggregate at zoom levels where individual markers overlap.
- Show count inside cluster circle. Color = worst status in the cluster (one critical makes the cluster red).
- Click to zoom in and disaggregate. Shift+click to expand as a flare cluster (radial spread) without zooming.

### Layer List
- Toggle layers on/off from the sidebar. Max 8 layers visible simultaneously.
- Order: most critical layers on top. Drag to reorder.
- Each layer entry shows: name, visibility toggle, legend swatch, opacity slider (collapsed by default).
- **Data dimming** over filter removal: when filtering, dim non-matching features to 20% opacity rather than hiding them. Spatial context matters in infrastructure.

### Timeline Slider
- For temporal data playback. Range selector with play/pause, step forward/back.
- Show "as of" timestamp prominently when the slider is not at the current time.
- Playback speed: 1x, 2x, 5x, 10x. Default 2x.

### Map empty state
- Before data loads: grey basemap with the deployment region outlined. "Loading network data…" with skeleton overlays.
- No data for this view: "No [layer type] data in this area. Zoom out or select a different DMA." Never a blank map.

---

## 11. Command palette (⌘+K)

The command palette is the power-user accelerator. It must be fast, predictable, and learnable.

- **Trigger**: ⌘+K (Mac) / Ctrl+K (Windows). Also accessible via search icon in the top bar.
- **Structure**: single input field. Results grouped by category: Navigation, Assets, Actions, Recent.
- **Behavior**: fuzzy match on title + description. Show keyboard shortcut hints inline.
- **Recent actions**: last 5 commands persist across sessions. Shown when palette opens empty.
- **Asset search**: typing an asset ID or name surfaces it immediately with "Fly to" and "View detail" actions.
- **Response time**: results appear within 100 ms of typing. Debounce at 150 ms.
- **Dismiss**: Esc or click outside. Never navigate away without explicit selection.

---

## 12. File & asset hygiene

- **Figma**: components live in the shared library. Don't detach. If you need a variant, propose it to the library maintainer.
- **Naming**: `Sidebar / MenuItem / size=md, state=hover`. Slash-separated, variant props at the end.
- **Prototypes**: one file per surface, named `[Surface] — [Problem] — [YYYY-MM]`.
- **Handoff**: ship a README with: problem, metric, decisions, open questions, known debt.
- **Icons**: Lucide only (see §3 Iconography).
- **Images**: WebP or AVIF. PNG only for exact pixel work. Compress everything.
- **Fonts**: Inter + Roboto Mono, self-hosted variable TTFs in `/fonts/`. Canonical `@font-face` in `colors_and_type.css`.

---

## 13. Anti-patterns (things we don't do)

- ❌ Gradient backgrounds on cards.
- ❌ Emoji in product UI.
- ❌ Pie charts (use bar or horizontal bar).
- ❌ Rainbow status bars or rainbow color scales.
- ❌ Auto-playing video.
- ❌ Cards with only a colored left border and rounded corners (AI-slop trope).
- ❌ Confirmation dialogs for reversible actions.
- ❌ Notification sounds by default.
- ❌ Green "success" toasts for things that were expected to succeed.
- ❌ Icons without labels in primary navigation.
- ❌ Placeholder-as-label in forms.
- ❌ Inventing metrics to fill dashboard slots.
- ❌ 3D effects on charts or UI elements.
- ❌ Truncated y-axes on bar charts.
- ❌ Legends when direct labels are possible.
- ❌ Pie charts with > 5 segments (you shouldn't have pie charts at all, but definitely not this).
- ❌ Rotated axis labels (use horizontal bars instead).
- ❌ Chart-table hybrids that do neither well.
- ❌ Hover-only affordances on touch devices.
- ❌ Kitchen sink maps (every layer, filter, and tool visible simultaneously).
- ❌ Overloaded map pop-ups (use Info Panel for rich content).
- ❌ `display: none` to "hide on mobile" — reflow, don't hide.
- ❌ Arbitrary z-index values (use tokens).
- ❌ `outline: none` without a replacement focus indicator.

---

## 14. Checklist — before you share a prototype

Copy this to the top of your prototype page.

**Brand & voice**
- [ ] Copy uses Sand voice (specific, no marketing adjectives)
- [ ] Units on every number
- [ ] Timestamps qualified with zone or relative time
- [ ] One logo variant, correctly placed
- [ ] No invented stats

**Visual**
- [ ] Inter + Roboto Mono only
- [ ] Type scale follows golden ratio modular scale
- [ ] Spacing from the 4 px scale
- [ ] Radii from the three-step system (6/8/12)
- [ ] One primary action per screen
- [ ] Only two shadow levels
- [ ] Logo gradient only in the logo
- [ ] Dark mode tested (if applicable)
- [ ] Z-index values use tokens

**Components**
- [ ] Using shadcn/Figma library components (not redrawn)
- [ ] All four states per view (default, loading, empty, error)
- [ ] Button hierarchy correct (one primary)
- [ ] Data table conventions (alignment, mono, sort)
- [ ] Toast/notification rules followed (no success toasts for expected outcomes)

**UX**
- [ ] Primary action within Fitts-friendly reach
- [ ] ≤ 7 top-level nav items
- [ ] ≤ 6 KPIs above the fold
- [ ] Empty states are specific
- [ ] Errors explain what + why + how
- [ ] Command palette (⌘+K) works for this surface

**Accessibility**
- [ ] 4.5:1 contrast on body, 3:1 on UI
- [ ] Focus-visible ring on every interactive element
- [ ] Icon-only buttons have aria-label
- [ ] Keyboard-completable core task
- [ ] State communicated by more than color (icon + label)
- [ ] `prefers-reduced-motion` honored
- [ ] Touch targets ≥ 44 × 44 px with ≥ 8 px spacing
- [ ] Landmark roles present (`main`, `nav`, `aside`)

**Data & AI**
- [ ] Sensed vs modeled distinguished
- [ ] Predictions labeled with confidence
- [ ] Recommendations have a "Why?"
- [ ] No silent automations
- [ ] AI outputs labeled "Generated by AI"
- [ ] Copilot responses have feedback mechanism (thumbs up/down)

**Data visualization**
- [ ] Chart has an active title (states the insight, not just the topic)
- [ ] Y-axis starts at zero on bar charts
- [ ] Max 5 series per chart
- [ ] Colorblind-safe palette used
- [ ] Chart has a data-table alternative
- [ ] Units on axis titles
- [ ] Direct labels preferred over legends

**Responsive**
- [ ] Designed at `lg`, then reviewed at `xs`, `md`, `xl`
- [ ] One primary action per view at every breakpoint
- [ ] No `display: none` hiding essential content on narrow viewports
- [ ] Tables re-flow to cards at `sm` and below
- [ ] Touch targets ≥ 44 × 44 px on `(pointer: coarse)`
- [ ] No hover-only affordances
- [ ] Fluid type with a minimum of 14 px body
- [ ] Survives browser zoom to 200%
- [ ] Tested on a real phone, not just DevTools

**Map & spatial**
- [ ] Map has a non-blank empty state
- [ ] Rich markers encode state via shape + color (not color alone)
- [ ] Info Panel used for rich content (not overloaded pop-ups)
- [ ] Layer list ≤ 8 layers visible simultaneously
- [ ] Cluster markers show worst-case status color

---

## 15. Responsive design

SandOS is used on a 32-inch control-room display, a 13-inch field laptop balanced on a truck hood, and a phone under a headlamp at 2 a.m. Responsive is not "it works on mobile" — it's "the right information, at the right density, at whatever screen the operator has in hand." Each breakpoint is a **different design**, not a squished version of the desktop one.

### Breakpoints

We use six. Design for the named anchors; the ranges between them should scale smoothly.

| Token | Range | Anchor | Typical context |
|---|---|---|---|
| `xs` | 0 – 479 px | 360 px | Field phone (portrait). Single task, one hand. |
| `sm` | 480 – 767 px | 640 px | Large phone / small tablet. |
| `md` | 768 – 1023 px | 900 px | Tablet, small laptop split view. |
| `lg` | 1024 – 1439 px | 1280 px | Standard laptop / office monitor. **Default design target.** |
| `xl` | 1440 – 1919 px | 1600 px | External monitor / control desk. |
| `2xl` | 1920 px+ | 2560 px | Control-room wall. More density, not bigger text. |

Rules of thumb:
- **Design `lg` first, then adapt up and down.** `lg` is where 70%+ of our users live.
- Never ship a screen that has only been tested at `lg`. Minimum test matrix: `xs`, `md`, `lg`, `xl`.
- Don't design for specific devices ("iPhone 14", "MacBook"). Design for breakpoints — devices change.

### Mobile-first principles

When the viewport narrows, the question is **"what is the single most important thing on this screen?"**, not "what do we hide?"

- **One primary action per view.** If you have three buttons on desktop, one becomes primary, the others collapse into a "…" menu.
- **Progressive disclosure.** Secondary metadata collapses into an expand toggle. Users can pull more detail when needed; the first render is scannable in < 2 s.
- **Stack, don't shrink.** Two 400 px columns at `lg` become two full-width rows at `sm`. Don't squish — re-flow.
- **Drop chrome, keep content.** Sidebars become drawers. Multi-level navigation becomes breadcrumb + back. Filters become a bottom sheet.
- **Thumb zone.** On mobile, primary actions live in the lower-third of the screen. The top of the screen is for context (title, status), not action.

### Touch vs pointer

The medium changes the interaction, not just the size. Detect with `@media (pointer: coarse)` and `(hover: none)`; do **not** branch on viewport size alone — there are 14-inch touch laptops and 6-inch keyboard-navigable phones.

| Aspect | Pointer (mouse/trackpad) | Touch |
|---|---|---|
| Min hit target | 32 × 32 px | **44 × 44 px** (WCAG 2.2 floor is 24; we always exceed). |
| Hover states | Yes — used for preview + tooltip | Disable. Convert to long-press or explicit button. |
| Right-click menus | Allowed as power-user shortcut | Replace with ellipsis menu in the row. |
| Drag | Fine-grained, with keyboard alt | Only for obvious affordances (reorder handles). Always provide a button alt. |
| Gestures (swipe, pinch) | Scroll-wheel + modifier | First-class. Swipe-to-dismiss, pinch-to-zoom on maps. |
| Density | Comfortable (default) | Roomy. Rows +4 px, padding +8 px vs pointer. |

### Layout patterns that scale

Pick the pattern **before** you start designing. Changing pattern mid-build is the most expensive kind of rework.

- **Holy grail (header · nav · content · aside · footer).** `lg+` only. On `md`, aside collapses to a drawer. On `sm`, nav becomes bottom tabs.
- **Master–detail (list on left, detail on right).** `md+`. On `sm`, becomes two routes: list → tap → detail, with explicit back.
- **Dashboard grid (cards).** Use CSS Grid with `minmax()` auto-fit. Cards should have a minimum width (~280 px) and flow into 1 / 2 / 3 / 4 columns as space allows. Avoid fixed column counts per breakpoint.
- **Data table.** At `sm` and below, tables become cards (one card per row). Primary columns become the card's title and metric; secondary columns become labeled rows inside. Don't horizontal-scroll tables on phones — it hides the data that matters.
- **Map + panel.** `lg+` is 60/40 map/panel side-by-side. `md` is map with a collapsible bottom sheet. `sm` is map full-screen with a peek bar; tap to expand.
- **Form.** One column on `sm`, two columns on `md+` for short fields (dates, numbers, enums). Long fields (text areas, multiline addresses) stay full-width at every breakpoint.

### Typography at scale

Type scales with viewport, but not linearly.

- Use **fluid type** with `clamp()` (see §3 Typography).
- Body copy never smaller than **14 px on any breakpoint**. 12 px is reserved for dense tables on `lg+` only.
- Line length: 45–75 characters. Use `max-width` on prose blocks, not `width: 100%`.
- Headings can scale more aggressively than body: a 37 px display on `lg` may drop to 23 px on `sm`.

### Maps, charts, and data viz

These are the most-deformed surfaces in our product. Rules:

- **Maps.** Full-bleed on `sm`. Legend and layer controls collapse to a single sheet icon. Default zoom adjusts: wider zoom on small screens, tighter on large (more context per pixel on the wall display).
- **Charts.** Axes, gridlines, and annotations collapse first; the series is sacred. If the chart becomes unreadable, swap for a single KPI + "View chart" link on `xs`.
- **Sparklines.** Always legible down to 80 px wide. Test this.
- **Tooltips.** Become bottom sheets or inline expansions on touch. Don't stack hover-tooltips on a device that has no hover.

### Testing & validation

- Design at `lg` (1280 px) and at least **one narrow + one wide** breakpoint before review.
- In the browser, pin at `360`, `768`, `1280`, `1920`. Take a screenshot of each. These live in the PR.
- DevTools "responsive" mode is not enough. Also test on a real phone over the office Wi-Fi — latency reveals skeleton-loader bugs that desktop DevTools hides.
- Orientation: if it rotates, design both. Never lock orientation on mobile without a reason.
- Zoom: everything must survive browser zoom to **200%** without horizontal scroll (WCAG 1.4.10).

### Responsive anti-patterns (do not ship)

- ❌ Hiding content on `sm`. If it's important enough to show on desktop, it's important on mobile — find a way (collapse, link, second route).
- ❌ `display: none` for "mobile only". The element still loads. Use server-driven variants or skeletal components.
- ❌ A separate `m.sand.app` subdomain. One URL. One app. Different layout.
- ❌ Requiring hover on touch. "Hover to see…" == broken on 40% of traffic.
- ❌ Shrinking a 10-column table to fit. Re-flow into cards.
- ❌ 10 px text "because it has to fit". Remove columns instead.
- ❌ Sticky elements on `sm` that eat more than 1/3 of the viewport height.
- ❌ Modal dialogs sized with `max-width: 600px` on `xs` (becomes a letterbox). Full-screen modals on `xs` / `sm`.

---

## 16. Platform architecture — Geospatial.App

*Contributed by Stefan B. This is the technical substrate the design system ships on. Designers don't need to read the whole section, but the three headline points (config over code, declarative layers, `app.*` schema) shape what's cheap vs expensive to change in a prototype.*

**Geospatial.App** is our configuration-driven platform for utility infrastructure visualization and risk assessment. Clients differ by configuration, not by code. A new deployment is a new `.env` file, not a code fork.

### Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, deck.gl 9.1, MapLibre GL |
| Backend | FastAPI (Python gateway), Martin (MVT tile server), Nginx (reverse proxy) |
| Database | PostGIS + pgRouting |
| Auth | AWS Cognito (OIDC) — optional, disabled by default |
| AI Copilot | LiteLLM + Claude Haiku / Sonnet / Opus, SSE streaming, ORAR agent loop |
| Deployment | Docker Compose (profiles for dev/prod), EC2 via SSM |

### System diagram

```
                        ┌─────────────────────┐
                        │    Client Browser    │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │   Nginx (port 8081)  │
                        │   Reverse Proxy +    │
                        │   Tile Caching       │
                        └──┬───────┬────────┬──┘
                           │       │        │
              /api/tiles/* │  /api/*│    /*  │
                           │       │        │
                    ┌──────▼──┐ ┌──▼────┐ ┌─▼────────┐
                    │ Martin  │ │FastAPI│ │ Next.js  │
                    │ MVT     │ │Gateway│ │ Frontend │
                    │ Tiles   │ │+ AI   │ │          │
                    └────┬────┘ └──┬────┘ └──────────┘
                         │         │
                    ┌────▼─────────▼─────┐
                    │  PostGIS/pgRouting  │
                    │  ┌───────────────┐  │
                    │  │  app.* schema │  │ ← Product data contract
                    │  │  (views)      │  │
                    │  └───────┬───────┘  │
                    │    ┌─────┴─────┐    │
                    │    │synth.*    │    │ ← Demo data
                    │    │public.*   │    │ ← Client data
                    │    └───────────┘    │
                    └─────────────────────┘
```

### Five core patterns

1. **Configuration over code.** All client-specific values come from environment variables via `appConfig.ts` — branding, geography, auth, feature flags. Zero code changes per client.
2. **Declarative layer system (ADR-0001).** `layers.json` is the single source of truth for map layers. Each entry defines tile source, styling, RAG coloring, hover/click interactions, time filtering, and 3D extrusion. Adding a layer = one JSON entry + one PostGIS function. No TypeScript changes.
3. **`app.*` schema abstraction (ADR-0015).** All backend queries and MVT functions reference only the `app.*` schema. Per-deployment SQL views map `app.*` to the physical schema (`synth.*` for demo, `public.*` for real clients). New clients create adapter views — no backend code changes.
4. **Martin auto-discovery (ADR-0003).** Martin auto-publishes PostGIS functions matching `(z, x, y) → bytea` as tile endpoints. New layers become available by adding a migration — no tile server config changes.
5. **Service-based state (ADR-0002).** `LayerManager` orchestrates four domain stores (Visibility, Interaction, Extrusion, Filter) outside the React tree. Components subscribe via selector hooks. State persists to `localStorage` across sessions.

### Data pipeline (ADR-0008)

Generates realistic synthetic utility data from OSM for any city — no real utility data required.

```
OSM Roads/Buildings → Pipe Network → Graph Topology → Events → Risk Zones
         │                  │              │              │          │
    load_osm.py      generate_network  build_graph  generate_   generate_
    load_census.py        .py            .py        events.py   zones.py
```

- **Configuration**: `demo-params.yaml` (risk thresholds, materials, pipe sizing) + `cities.json` (bbox, FIPS codes).
- **pgRouting (ADR-0013)**: derives a connected node/edge graph from pipe geometry — enables valve isolation, shortest paths, connected-component analysis.
- **Census geometries (ADR-0012)**: Block Groups as neighborhoods, Blocks as city blocks — recognizable boundaries for risk visualization.
- **Multi-city**: 5 cities configured (Springfield IL, Baltimore, NYC, St. Louis, Prince William VA).

### AI Copilot (ADR-0014, ADR-0016)

Natural language interface for operators to investigate events, assess risk, and triage alerts. See also **§9 Data & AI in the UI** for the copy and surfacing rules.

- **ORAR philosophy**: Observe → Reason → Act → Reflect.
- **Model routing**: Haiku (lookups) → Sonnet (analysis) → Opus (strategic) — based on query complexity.
- **Tools**: 9 total — 7 PostGIS query handlers + 2 frontend actions (fly-to, toggle layer).
- **Graduated autonomy**: **Autonomous** (queries, map nav) · **Supervised** (crew dispatch) · **Restricted** (valve ops).
- **Security**: read-only DB role, 50-row cap, parameterized SQL, rate limiting, input validation.
- **Knowledge base**: domain docs on burst detection methodology, entity ontology, operator / leakage-manager personas, maturity tiers (dark → noisy → intelligent).

### ADR summary

| # | Decision | Why it matters |
|---|---|---|
| 001 | Config-driven layers (`layers.json`) | New layers = JSON, not code. |
| 002 | Service-based state (LayerManager + stores) | Decoupled from React, testable, persistent. |
| 003 | Martin MVT + PostGIS functions | Auto-discovery, zero config for new layers. |
| 004 | Nginx routing + tile caching | Single entry point, 5-min tile cache. |
| 005 | Cognito OIDC (optional) | Auth disabled by default, enable per client. |
| 006 | RAG color system | Consistent risk visualization palette. |
| 007 | Docker Compose profiles | Dev/prod from the same compose file. |
| 008 | Synthetic data from OSM | Demo any US city, no real data needed. |
| 009 | Pressure monitoring (3 endpoints) | Point-in-time, historical, map-ready. |
| 010 | Unified search | Multi-source with consistent scoring. |
| 011 | Global time range context | Single time filter across all features. |
| 012 | Census polygon layers | Recognizable neighborhood/block boundaries. |
| 013 | pgRouting network graph | Connectivity, isolation, shortest paths. |
| 014 | AI Copilot (LiteLLM + tools) | Natural language ops, streaming, secure. |
| 015 | `app.*` schema views | Client data = adapter views, not code. |
| 016 | ORAR agent loop | Model routing, graduated autonomy, memory. |

### New client deployment — three steps

1. **Configure.** Set env vars (branding, geography, auth, features).
2. **Data.** Either run the synthetic pipeline *or* create `app.*` adapter views over the client DB.
3. **Deploy.** `bash deploy.sh` on EC2.

No code forks. No client branches. Configuration only.

### What this means for designers

- **Branding, city, feature flags** = env-var changes. Cheap. Prototype freely across clients.
- **New map layer** = JSON entry + PostGIS function. Cheap. Propose new layers without fear.
- **New data field on an existing layer** = `app.*` view change + migration. Medium.
- **Changes to the four state stores, the tile server, or the ORAR loop** = code change, ADR territory. Expensive. Bring it to an architecture review, not a design review.

---

## Appendix A — Glossary

| Term | Meaning |
|---|---|
| DMA | District Metered Area — a bounded zone of the water network. |
| NRW | Non-Revenue Water — water produced but not billed (leaks + theft + meter error). |
| SCADA | Supervisory Control and Data Acquisition — the existing telemetry system SandOS reads from. |
| PRV | Pressure Reducing Valve. |
| Decision Stack | SandOS's sense → analyze → act layers. |
| Consequence Model | A physics-aware simulation of what happens if an intervention is taken. |
| ADR | Architecture Decision Record — a short, dated note explaining why a non-obvious technical choice was made. Referenced throughout §16. |
| MVT | Mapbox Vector Tile — binary vector tile format served by Martin and rendered by MapLibre/deck.gl. |
| RAG | Red / Amber / Green — the risk color system used across map layers (ADR-0006). |
| ORAR | Observe → Reason → Act → Reflect — the AI Copilot's agent loop (ADR-0016). |
| PostGIS | Postgres extension adding geospatial types and functions — the base of our spatial database. |
| pgRouting | Postgres extension adding graph/routing algorithms over PostGIS geometry — used for valve isolation and shortest paths. |
| Golden ratio (φ) | 1.618 — the mathematical ratio used to govern the type scale, line-height, and spacing hierarchy in this design system. |

## Appendix B — Design token summary (quick reference)

```
/* === TYPE SCALE (Golden Ratio) === */
--font-size-display: 37px;    /* φ² from base */
--font-size-h1: 29px;         /* φ^1.5 from base */
--font-size-h2: 23px;         /* φ from base */
--font-size-h3: 18px;         /* √φ from base */
--font-size-body: 14px;       /* base */
--font-size-small: 12px;      /* ÷√φ from base */
--font-size-metric: 29px;     /* mono, φ^1.5 */
--font-size-code: 13px;       /* mono */

/* === LINE HEIGHTS (size × φ, rounded to 4px grid) === */
--line-height-display: 60px;
--line-height-h1: 48px;
--line-height-h2: 36px;
--line-height-h3: 28px;
--line-height-body: 24px;
--line-height-small: 20px;

/* === SPACING (4px base) === */
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;

/* === RADIUS === */
--r-sm: 6px;
--r-md: 8px;
--r-lg: 12px;

/* === SHADOWS === */
--shadow-1: 0 1px 2px rgba(0,0,0,0.05);
--shadow-2: 0 8px 24px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
```

## Appendix C — Further reading (internal)

- `README.md` — project overview
- `colors_and_type.css` — canonical tokens (when added)
- Figma: `Sand / Design System` (shadcn/ui kit base)
- Lucide Icons: https://lucide.dev
- shadcn/ui: https://ui.shadcn.com
- Laws of UX: https://lawsofux.com
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Google People + AI Guidebook: https://pair.withgoogle.com/guidebook/
- Nielsen 10 Heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/
- Modular Scale Calculator: https://www.modularscale.com/?14&px&1.618

---

*Questions, disagreements, proposed changes: open a PR on this file or drop a comment in #design-system. This document is living — if a rule here hurts more than it helps, we change it.*