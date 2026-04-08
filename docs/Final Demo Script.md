# Final Presentation & Demo Script — Flare CU (~15 min)

**Format:** Group presentation (5 members), live on real device (screen-shared), ~7-8 min demo + ~7-8 min Q&A
**Deliverable:** Project Presentation and Demo (25%)
**Date:** Wednesday, April 8, 2026

---

## Key Differences from Alpha Demo

- **Each member presents their section** — the prof expects this
- **No emulator** — must run on a real phone (wireless screen-share or camera)
- **Don't focus on tech stack/libraries** — focus on HCI, UCD, usability
- **10 Usability Heuristics are worth 10/25** — call them out explicitly throughout
- **Slides are optional but recommended** (max 10) — use them for design process, personas, low-fi vs high-fi comparisons
- **Prof + marker come to your group** — not a stage presentation

---

## Rubric Coverage Matrix

| Criterion | Weight | Where it's covered |
|---|---|---|
| Technical presentation — oral delivery | /3 | All segments, each member presents |
| Response to questions — course material + design | /3 | Q&A (prep below) |
| Fulfillment of course project — UCD approach | /3 | 1 — Design Process, woven throughout |
| Effectiveness of user interface — evolved through UCD | /3 | 2–6 live walkthrough |
| 10 Usability Heuristics (1 pt each) | /10 | Called out with **[H#]** tags throughout |
| Relative and Generic Aesthetic | /3 | Visible throughout demo, called out in Seg 1 + 6 |

### Heuristic Tracking

Every heuristic is tagged **[H#]** in the script so you can confirm full coverage:

| # | Heuristic | Where it appears |
|---|---|---|
| H1 | Visibility of system status | Seg 3 (online/offline badge, credibility labels), Seg 5 (progress bar), Seg 6 (offline banner) |
| H2 | Match between system and real world | Seg 1 (calm language), Seg 3 ("flare" not "alert"), Seg 4 (familiar categories) |
| H3 | User control and freedom | Seg 4 (undo snackbar), Seg 5 (exit plan anytime), Seg 5 (exit emergency + "Are you safe?") |
| H4 | Consistency and standards | Seg 1 (Material Design 3 via Paper), Seg 3 (consistent card layout), Seg 6 (same placement across screens) |
| H5 | Error prevention | Seg 4 (structured categories prevent vague reports), Seg 5 (confirmation before emergency exit) |
| H6 | Recognition rather than recall | Seg 3 (sort chips), Seg 4 (category chips, location chips), Seg 5 (route option cards) |
| H7 | Flexibility and efficiency of use | Seg 2 (guest mode shortcut), Seg 3 (sort options), Seg 6 (alert intensity levels) |
| H8 | Aesthetic and minimalist design | Seg 1 (Calm Tech), Seg 5 (emergency strips to 3 tabs), Seg 6 (low-stim mode) |
| H9 | Help users recognize, diagnose, recover from errors | Seg 4 (undo after submit), Seg 6 (offline queues reports, syncs later) |
| H10 | Help and documentation | Seg 2 (Quick Setup explains each option), Seg 6 (settings explain effects in plain language) |

---

## Presenter Assignments

Assign segments based on who built what. Suggested split for 5 members:

| Presenter | Segment | Duration |
|---|---|---|
| **Member A** | 1 — Design Process & Intro | ~1:00 |
| **Member B** | 2 — Onboarding + 3 — Nearby Feed & Detail | ~2:00 |
| **Member C** | 4 — Raise a Flare + 5 — Route Planning & Emergency | ~2:30 |
| **Member D** | 5 (cont.) — Emergency Mode | ~1:30 |
| **Member E** | 6 — Accessibility, Offline & Wrap-up | ~1:00 |

> **Note:** Adjust assignments so each person presents the component they were responsible for — the prof explicitly expects this.

---

## Timed Outline

| # | Segment | Target | Cumulative |
|---|---|---|---|
| 1 | Design Process & Intro | 1:00 | 1:00 |
| 2 | Onboarding | 1:00 | 2:00 |
| 3 | Nearby Feed & Flare Detail | 1:30 | 3:30 |
| 4 | Raise a Flare + Route Planning | 1:30 | 5:00 |
| 5 | Emergency Mode | 1:30 | 6:30 |
| 6 | Accessibility, Offline & Wrap-up | 1:00 | 7:30 |
| — | Q&A | 7:30 | 15:00 |

---

## Suggested Slides (max 10)

Only use slides to show things you can't show live. Keep them minimal.

| Slide | Content |
|---|---|
| 1 | Title slide — Flare CU, team names, course |
| 2 | Problem statement — 1-2 sentences + photo of SGW disruption context |
| 3 | Three user groups — mobility, anxiety/sensory, low familiarity (show personas) |
| 4 | Double Diamond — your 4 phases with what you did in each |
| 5 | Low-fi wireframes — 3-4 key screens side by side |
| 6 | Low-fi → High-fi comparison — same screen, before and after |
| 7 | 10 Heuristics summary — table mapping each heuristic to a feature (backup reference) |

> Slides 5-6 are important — the rubric specifically asks about UI evolution through UCD.
> After slide 6 or 7, transition to the live demo on the real device.

---

## Script

### 1 — Design Process & Intro (~1:00) — Member A

*[Start with slides on the presentation computer]*

- Flare CU is a safety and navigation app for Concordia SGW students — it helps you navigate disruptions like protests, blockades, dense crowds, and construction
- Where Google Maps optimizes for speed, we're optimizing for safety, accessibility, and staying calm under stress **[H2 — real-world match: we use language and concepts that reflect how students actually think about campus safety]**
- We designed for three user groups, each with specific constraints:
  - Students with mobility needs who require barrier-free routes
  - Students with anxiety or sensory sensitivity who benefit from reduced cognitive load
  - Students who are new to campus and need clear contextual guidance
- *[Show Double Diamond slide]* We followed a Double Diamond process — Discover, Define, Develop, Deliver — going from research and personas to low-fi wireframes to this high-fi functional prototype
- *[Show low-fi → high-fi slide]* Here's how our screens evolved — the low-fi established layout and hierarchy, the high-fi added our Concordia color system, real interaction states, and accessibility adaptations
- The whole design follows Calm Tech principles — the interface stays minimal and non-alarming, especially under stress **[H8 — aesthetic and minimalist design]**
- Our visual language is consistent throughout — we use Material Design 3 components with Concordia burgundy as the anchor color **[H4 — consistency and standards]**

→ *[Hand off to Member B]* "Let me hand it over to [Member B] to walk you through the app."

---

### 2 — Onboarding (~1:00) — Member B

*[Switch to live demo on real device]*

- So here's the welcome screen — you can log in, create an account, or continue as a guest
- Guest mode lets you browse flares right away without signing up — that's a shortcut for experienced users who just want quick info **[H7 — flexibility and efficiency of use]**
- I'll create an account to show the full flow
- **Tap Create Account** — just email and password, takes a few seconds *(UG1 — Create account)*
- **Fill in and submit → Quick Setup appears**
- Quick Setup lets you turn on mobility-friendly routing, low-stim mode, and adjust alert intensity
- Each option has a plain-language explanation of what it does **[H10 — help and documentation: no jargon, explains effects clearly]**
- All of this is optional and changeable anytime in Settings *(UG10 — Personalized preferences)*

→ "Let me show you the main feed."

---

### 3 — Nearby Feed & Flare Detail (~1:30) — Member B

- This is the Nearby screen — the main feed
- Up top you see "SGW Campus" and the online/offline status badge — you always know the system state **[H1 — visibility of system status]**
- **Tap between sort chips** — Priority, Nearest, Recent — these are always visible so you recognize your options rather than having to remember them **[H6 — recognition rather than recall]**
- Each card is a "flare" — we use that word instead of "alert" or "incident" because it's calmer and more human **[H2 — match between system and real world]**
- See the credibility label? This one says "Verified" in green — campus safety confirmed it *(UG3 — Label crowdsourced data)*
- Four levels: Reported (orange), Confirmed (blue), Verified (green), Resolved (grey) — consistent colors and placement on every card **[H4 — consistency and standards]**
- **Tap a flare card** to see the detail view
- Here's the full info — 21 people confirmed this one, and you can confirm it yourself
- **Scroll to Timeline** — this progress bar shows the full lifecycle: filled dots for completed steps, hollow for pending *(UG4 — Thread progress bar)* **[H1 — visibility of system status]**
- In low-stim mode this section starts collapsed to reduce cognitive load
- I can bookmark this flare for later — and there's a link to enter emergency mode if needed

→ *[Hand off to Member C]* "What if you see something yourself? [Member C] will show you."

---

### 4 — Raise a Flare + Route Planning (~1:30) — Member C

**Raise a Flare:**

- There's a "Raise a flare" button in the bottom-right
- **Tap Raise a flare**
- Step 1: pick a category — blocked entrance, dense crowd, construction — structured categories prevent vague or misleading reports **[H5 — error prevention]**
- These are presented as chips you can tap, not a blank text field — you recognize and select rather than recall and type **[H6 — recognition rather than recall]**
- **Select Blocked entrance → Next**
- Step 2: location — quick chips for SGW buildings
- **Tap Hall → Next**
- Step 3: optional note for extra detail
- **Tap Raise flare** — under 30 seconds *(UG7 — Report quickly)*
- See the snackbar: "Flare raised" with an **Undo** button — if you tapped by mistake or picked the wrong category, you can take it back immediately **[H3 — user control and freedom] [H9 — help users recover from errors]**

**Route Planning:**

- **Tap the Route tab**
- Defaults to your current location — toggles to avoid high-tension areas, stick to accessible paths, or reduce stimulation
- Quick grid for common SGW buildings — **Tap EV**
- You get options: Safest, Accessible, Fastest safe — top one gets a "Best match" badge based on your preferences
- **Tap Start plan** — step-by-step walkthrough *(UG9 — Follow action plan)* **[H1 — visibility: progress bar at top shows where you are]**
- **Tap Next step** a couple times — you can exit anytime without losing your place **[H3 — user control and freedom]**
- Arrival screen says "You've arrived" and prompts you to check the feed

→ *[Hand off to Member D]* "Now imagine something serious happens — [Member D] will show emergency mode."

---

### 5 — Emergency Mode (~1:30) — Member D

- Let me go back to the saved flare and enter emergency mode from there
- **Navigate to flare detail → Tap "Enter emergency mode"**
- Right away the interface changes — red banner, minimal layout *(UG2 — Emergency UX)*
- The whole screen strips down to just three tabs: Steps, Safe Route, Updates — everything non-essential is hidden **[H8 — aesthetic and minimalist design: only what you need in a crisis]**
- Since we came in from a specific flare, the steps are contextual — the app knows what triggered this

- **Steps tab:** short instructions, never more than 2-4 steps *(UG9)* — calm, clear language **[H2 — real-world match: guidance reads like a person helping you, not a system error]**
- **Tap Next step**

- **Swipe to Safe Route** — pre-built options like nearest safe building
- If accessibility is enabled, routes show a badge confirming they're ramp-friendly
- **[H7 — flexibility: adapts to your preferences automatically]**

- **Swipe to Updates** — shows the triggering flare plus other active flares nearby, with manual refresh

- Bottom bar persists across all tabs: Campus Security, 911, Quick Report — always reachable **[H4 — consistency: same placement, always available]**
- **Tap Quick Report** — you can report something new without leaving emergency mode **[H3 — user control and freedom]**
- **Tap Exit** — the app asks "Are you safe?" before returning to normal mode **[H5 — error prevention: prevents accidental exit from safety-critical mode]**

→ *[Hand off to Member E]* "Last section — [Member E] will cover accessibility and offline."

---

### 6 — Accessibility, Offline & Wrap-up (~1:00) — Member E

- **Tap Settings**
- Alert intensity on Low hides unconfirmed flares — less noise for anxiety-sensitive users **[H7 — flexibility and efficiency: different levels for different needs]**
- Accessibility bumps accessible routes to the top
- Low-stim mode mutes colors, cuts animations, collapses sections by default **[H8 — minimalist design taken further for sensory sensitivity]**
- Every setting explains its effect in plain language **[H10 — help and documentation]**
*(UG10 — Personalized preferences)*

- **Toggle Offline mode → go back to Nearby**
- Badge switches to "Offline" in orange — the system always tells you its state **[H1 — visibility of system status]**
- Everything still works off cached data *(UG5 — Offline mode)*
- **Tap Saved tab** — offline pack shows last sync time and cached flare count
- Reports created offline get queued and sync when you reconnect — no error walls, no lost data **[H9 — recover from errors: graceful degradation, not failure]**

- **Toggle Offline off → Settings → Tap "Simulate zone alert"**
- This is what you'd see walking near a flagged area *(UG6 — Zone detection)*
- Calm prompt — dismiss, snooze, or tap "View guidance" to enter emergency mode
- **Tap "View guidance"** — emergency mode activates, triggered by the zone this time
- **Tap Exit → confirm "Are you safe?"**

- That covers all 10 user goals and all 10 usability heuristics. Happy to take questions.

---

## Fallback Plans

| Problem | Fallback |
|---|---|
| Phone dies / crashes | Have a second phone with the app installed and ready. Keep both charged. |
| Screen-share fails | Use the phone camera on a laptop to mirror the screen, or just hold the phone and let the marker watch directly — it's a small group setting. |
| App freezes mid-demo | Force-close and reopen — the app preserves state. Have a pre-created account ready so you don't need to re-onboard. |
| Network issues | The app has offline mode — toggle it on and continue the demo. Offline is a feature, not a bug. |
| A specific screen breaks | Skip it, mention the feature verbally, and move on. Don't debug live. |
| Slides won't display | Demo can stand alone without slides. Have the low-fi wireframes as images on the phone if needed. |

---

## Q&A Preparation

The Q&A is worth **3 points** and the prof said questions will be about **your application and design**. Every member should be ready to answer. Focus on connecting answers to **course material and HCI concepts**, not technical implementation.

### Likely Questions

**"How does the credibility progression work?"**
> Flares start as "Reported" when submitted. Community confirmation moves them to "Confirmed." Campus safety can mark them "Verified." When cleared, they become "Resolved." Each level has a distinct color. This directly supports **visibility of system status (H1)** — users can judge trustworthiness at a glance without reading details.

**"Which usability heuristics guided your design?"**
> All 10. The biggest ones for us were: **(1) Visibility of system status** — online/offline badges, credibility labels, progress bars everywhere. **(2) Match between system and real world** — we use "flare" instead of "alert" to stay calm. **(5) Error prevention** — structured categories prevent vague reports, confirmation before exiting emergency mode. **(8) Aesthetic and minimalist design** — Calm Tech principles, low-stim mode strips the interface down. But every heuristic is covered — we can point to specific examples for any of them.

**"How did your design evolve from low-fi to high-fi?"**
> Low-fi wireframes were grayscale and focused on layout, hierarchy, and flow — where does the credibility chip go, where does the action button sit, what's the navigation structure. High-fi added the Concordia color system, real interaction states, conditional rendering for accessibility preferences, and polished transitions. The core structure stayed the same because the low-fi captured the right information architecture.

**"Why a mobile app?"**
> Because safety navigation requires real-time location awareness, push notifications, and offline capability — all things that need to be on the device students already carry. The platform choice was driven by user needs and context, not by our development skills. *(This directly addresses the prof's hint in the rubric about choosing platform based on user needs, not developer familiarity.)*

**"How do you prevent misinformation in crowdsourced reports?"**
> Three mechanisms: (1) Structured categories force specificity. (2) The 4-stage credibility system makes trustworthiness visible. (3) Undo after submission lets users retract mistakes immediately. This combines **error prevention (H5)** with **visibility of system status (H1)**.

**"What happens when the user goes offline?"**
> The app caches recent flares and preferences. The header shows an orange "Offline" badge. Saved flares remain accessible. New reports queue locally and sync on reconnect. We never show blank screens or aggressive errors — just a calm indicator. This supports **H1 (visibility)** and **H9 (error recovery)**.

**"How does zone-of-interest detection work?"**
> The system monitors proximity to flagged areas. When a user enters or approaches a zone with an active high-severity flare, a calm prompt appears. It's dismissible and rate-limited to prevent alert fatigue. In severe cases it can auto-activate emergency mode. The trigger source is tracked — manual, flare, or zone — so the emergency steps are context-aware. This is **H7 (flexibility)** — the system adapts to context automatically.

**"What's the difference between normal mode and emergency mode?"**
> Normal mode is the full app — feed, routing, reporting, settings. Emergency mode strips the interface to three tabs: Steps, Safe Route, Updates. Non-essential features disappear, touch targets get larger, language stays calm. A persistent bottom bar keeps Campus Security, 911, and Quick Report always reachable. This is a direct application of **Calm Tech and Emergency UX principles** — reduce cognitive load when stakes are highest. It demonstrates **H8 (minimalist design)** and **H3 (user control)**.

**"How does your design support accessibility?"**
> At three levels: (1) **Preference-driven** — mobility-friendly routing and low-stim mode are set once and apply everywhere. (2) **Context-driven** — emergency mode automatically enlarges touch targets and simplifies the interface. (3) **Progressive disclosure** — timelines collapse in low-stim mode, alert intensity filters noise. We designed for our three persona groups, and each accessibility feature maps back to their specific constraints. This reflects **user-centered design** — we didn't add accessibility as an afterthought, it shaped the core flows.

**"What Calm Tech principles did you apply?"**
> Calm Tech means the system stays in the periphery until needed, then provides clear, non-alarming guidance. Specifically: we use "flare" not "alert," we avoid red in normal mode (red only appears in emergency), low-stim mode reduces motion and color saturation, alert intensity lets users control how much reaches them, and emergency instructions use short, directive language without exclamation marks or panic words. The goal is **informed action, not fear**.

**"How did you apply the Double Diamond?"**
> Discover: reviewed Concordia safety resources, campus maps, accessibility info, and public disruption reports. Define: built personas, empathy maps, journey maps, and translated findings into 10 user goals. Develop: created low-fi wireframes first for layout and flow, then iterated into high-fi prototypes. Deliver: implemented the functional prototype and evaluated against the 10 heuristics. Each phase directly informed the next — the personas from Define drove which features we prioritized in Develop.

---

## Pre-Demo Checklist

- [ ] App is installed on a real phone (no emulator, no wired connection)
- [ ] Phone is fully charged or plugged in
- [ ] Screen-share / mirroring is tested and working wirelessly
- [ ] Second phone has the app as a backup
- [ ] A pre-created account exists (skip onboarding if something breaks)
- [ ] Each member knows their segment and has rehearsed
- [ ] Slides are loaded on the presentation laptop (if using)
- [ ] Low-fi wireframe images are accessible (phone gallery or slides)
- [ ] Team arrives 15 minutes early
- [ ] Everyone can name all 10 heuristics and point to at least one example each
