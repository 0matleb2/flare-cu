# Final Presentation & Demo Script — Flare CU (~15 min)

**Format:** Mathieu presents and demos solo, groupmates handle Q&A
**Deliverable:** Project Presentation and Demo (25%)
**Date:** Wednesday, April 8, 2026

---

## Rubric Coverage Matrix

| Criterion | Weight | Where it's covered |
|---|---|---|
| Technical presentation — oral delivery | /3 | Entire presentation |
| Response to questions — course material + design | /3 | Q&A handled by groupmates (prep below) |
| Fulfillment of course project — UCD approach | /3 | 1 — Slides intro, woven throughout |
| Effectiveness of user interface — evolved through UCD | /3 | 1 — Low-fi → high-fi slides, 2–7 live walkthrough |
| 10 Usability Heuristics (1 pt each) | /10 | Called out with **[H#]** tags throughout |
| Relative and Generic Aesthetic | /3 | Visible throughout demo, called out in Seg 1 + 7 |

### Heuristic Tracking

Every heuristic is tagged **[H#]** in the script so you can confirm full coverage:

| # | Heuristic | Where it appears |
|---|---|---|
| H1 | Visibility of system status | Seg 3 (online/offline badge, credibility labels), Seg 3 (timeline progress bar), Seg 7 (offline banner) |
| H2 | Match between system and real world | Seg 1 (calm language), Seg 3 ("flare" not "alert"), Seg 4 (familiar categories) |
| H3 | User control and freedom | Seg 4 (undo snackbar), Seg 5 (exit plan anytime), Seg 6 (exit emergency + "Are you safe?") |
| H4 | Consistency and standards | Seg 1 (Material Design 3, Concordia color system), Seg 3 (consistent card layout + credibility colors), Seg 6 (persistent bottom bar) |
| H5 | Error prevention | Seg 4 (structured categories prevent vague reports), Seg 6 (confirmation before emergency exit) |
| H6 | Recognition rather than recall | Seg 3 (sort chips), Seg 4 (category chips, location chips), Seg 5 (route option cards) |
| H7 | Flexibility and efficiency of use | Seg 2 (guest mode shortcut), Seg 3 (sort options), Seg 7 (alert intensity levels) |
| H8 | Aesthetic and minimalist design | Seg 1 (Calm Tech), Seg 6 (emergency strips to 3 tabs), Seg 7 (low-stim mode) |
| H9 | Help users recognize, diagnose, recover from errors | Seg 4 (undo after submit), Seg 7 (offline queues reports, syncs later) |
| H10 | Help and documentation | Seg 2 (Quick Setup explains each option), Seg 7 (settings explain effects in plain language) |

---

## Timed Outline

| # | Segment | Target | Cumulative |
|---|---|---|---|
| 1 | Slides — Context & Design Process | 1:15 | 1:15 |
| 2 | Onboarding | 1:00 | 2:15 |
| 3 | Nearby Feed & Flare Detail | 2:00 | 4:15 |
| 4 | Raise a Flare | 1:00 | 5:15 |
| 5 | Route Planning | 1:00 | 6:15 |
| 6 | Emergency Mode | 1:30 | 7:45 |
| 7 | Accessibility, Offline & Wrap-up | 1:00 | 8:45 |
| — | Q&A (groupmates) | ~6:15 | 15:00 |

---

## Script

### 1 — Slides: Context & Design Process (1:15)

*[Laptop showing presentation slides]*

- *[Title slide]* So this is Flare CU — a safety and navigation app for Concordia SGW students
- *[Problem slide]* It helps you navigate disruptions like protests, blockades, crowds, construction
- Where Google Maps optimizes for speed, we're optimizing for safety, accessibility, and staying calm under stress **[H2]**
- *[Users slide]* We designed for three groups: students with mobility needs, students with anxiety, and students who are new to campus
- *[Double Diamond slide]* Process-wise we used Double Diamond — went from research and personas to low-fi wireframes, then refined into this high-fi prototype
- *[Low-fi wireframes slide]* These are our early wireframes — grayscale, focused on layout and hierarchy
- *[Low-fi → high-fi slide]* And here's how they evolved — the core structure stayed the same, but we added the Concordia color system, real interaction states, and accessibility adaptations
- The whole design follows Calm Tech principles — the interface stays minimal and non-alarming **[H8]**
- Our visual language is consistent throughout — Material Design 3 with Concordia burgundy as the anchor color **[H4]**

→ "Let me walk you through the app."

*[Switch to live demo on real device]*

---

### 2 — Onboarding (1:00)

- So here's the welcome screen — you can log in, create an account, or just continue as a guest
- Guest mode is nice because you can browse alerts right away without signing up **[H7]**
- I'll go ahead and create an account to show the full flow
- **Tap Create account** — it's just email and password, takes a few seconds *(UG1 — Create account)*
- I'll fill this in and submit
- **Tap Create account → Quick Setup appears**
- So now we get Quick Setup — here you can turn on mobility-friendly routing, which prioritizes ramps and elevators
- Low-stim mode tones things down — less motion, simpler alerts
- And alert intensity controls how much shows up in your feed
- Each option explains what it does in plain language **[H10]**
- All of this is optional and you can change it anytime in Settings *(UG10 — Personalized preferences)*

→ "Let's see the main feed."

---

### 3 — Nearby Feed & Flare Detail (2:00)

- This is the Nearby screen, it's the main feed
- Up top you've got SGW Campus and whether you're online or offline — you always know the system state **[H1]**
- **Tap between the sort chips** — you can sort by Priority, Nearest, or Recent — these are always visible so you recognize your options **[H6]**
- Each card here is a flare — we use that word instead of "alert" because it's calmer **[H2]**
- See this credibility label? This one says Verified in green, meaning campus safety confirmed it *(UG3 — Label crowdsourced data)*
- There are four levels — Reported, Confirmed, Verified, Resolved — each with its own color, consistent on every card **[H4]**
- Let me tap into one so you can see the detail view
- **Tap a flare card**
- So here you get the full info, how many people confirmed it — 21 here — and you can confirm it yourself
- If I scroll down there's a Timeline section
- **Scroll down to the Timeline** — this is the progress bar showing the whole lifecycle *(UG4 — Thread progress bar)* **[H1]**
- Filled dots with timestamps for completed steps, hollow dots for what's still pending
- In low-stim mode this starts collapsed so it's less overwhelming
- I can also save this flare for later
- **Tap the bookmark** — and there's a link here to jump to emergency mode too

→ "What if I see something myself?"

---

### 4 — Raise a Flare (1:00)

- There's this Raise a flare button in the bottom-right
- **Tap Raise a flare**
- Step 1 is picking a category — blocked entrance, dense crowd, construction, things like that
- Structured categories keep reports specific and cut down on noise **[H5]**
- These are chips you tap, not a blank text field **[H6]**
- I'll pick blocked entrance
- **Select Blocked entrance → Next**
- Step 2 is the location — these chips make it quick
- **Tap Hall → Next**
- Step 3 is just an optional note if you want to add detail
- And that's it, I'll submit
- **Tap Raise flare** — that whole thing was under 30 seconds *(UG7 — Report quickly)*
- And we're back on the feed — see the snackbar at the bottom saying "Flare raised" with an Undo button in case you made a mistake **[H3] [H9]**

→ "Say I need to get to EV safely."

---

### 5 — Route Planning (1:00)

- Let me hop over to the Route tab
- **Tap the Route tab**
- It defaults to your current location for the starting point
- These toggles let you avoid high-tension areas, stick to accessible paths, or reduce stimulation
- And there's a quick grid for common SGW buildings — I'll pick EV
- **Tap EV**
- So you get a few options — Safest, Accessible, Fastest safe **[H6]**
- The top one gets a "Best match" badge based on whatever preferences you set
- Let me start this one
- **Tap Start plan** — now you've got a step-by-step walkthrough *(UG9 — Follow action plan)*
- Progress bar at the top, current instruction front and center, all steps listed below **[H1]**
- **Tap Next step** a couple times
- You can exit anytime without losing your place **[H3]**
- When you're done it says "You've arrived" and prompts you to check the feed

→ "Now imagine something serious happens."

---

### 6 — Emergency Mode (1:30)

- So let me go back to that flare we saved earlier and enter emergency mode from there
- **Navigate to the flare detail → Tap "Enter emergency mode"**
- Right away you can see everything looks different — there's a red banner at the top, and you can always exit right from here *(UG2 — Emergency UX)*
- The whole screen strips down to just three tabs — everything non-essential is hidden **[H8]**
- Since we came in from an actual flare, the app knows what's going on and gives you specific instructions

- So on the Steps tab, it's telling me the area is restricted — that's based on the flare we came from
- Nice short steps, never more than 2 to 4 — calm, clear language **[H2]**
- **Tap Next step**

- Let me swipe over to Safe route
- **Swipe to Safe route**
- This gives you pre-built options like nearest safe building or just get away from the area
- And if you have accessibility turned on, there's a badge showing it's ramp-friendly **[H7]**

- And then there's Updates
- **Swipe to Updates**
- You can see the flare that triggered all this, what else is active nearby, and you can refresh manually

- Down at the bottom you've always got Campus Security, 911, and Quick Report no matter which tab you're on **[H4]**
- Let me open Quick Report
- **Tap Quick report** — so you can report something new without leaving emergency mode **[H3]**
- And when you're ready to leave
- **Tap Exit** — it checks with you first, asks "Are you safe?" before going back to normal **[H5]**

→ "Last thing — accessibility and offline."

---

### 7 — Accessibility, Offline & Wrap-up (1:00)

- Let me go to Settings
- **Tap Settings**
- Alert intensity on Low hides unconfirmed flares so there's less noise **[H7]**
- Accessibility bumps accessible routes to the top
- Low-stim mutes colors, cuts animations, and collapses sections by default **[H8]**
- Every setting explains its effect in plain language **[H10]**
*(UG10 — Personalized preferences)*

- I'll turn on offline mode here and go back to the feed
- **Toggle Offline mode on → go back to Nearby**
- See the badge switched to Offline in orange — everything still works off cached data *(UG5 — Offline mode)* **[H1]**
- And if I check the Saved tab
- **Tap the Saved tab** — there's an offline pack showing last sync and how many flares are cached
- Anything you report offline gets queued and syncs when you reconnect **[H9]**
- That matters on SGW campus where the tunnels and corridors have spotty signal

- There's also a zone detection feature — let me show that
- **Toggle Offline mode off → go back to Settings → Tap "Simulate zone alert"**
- So this is what you'd see if you walked near a flagged area *(UG6 — Zone detection)*
- It's a calm prompt — you can dismiss it, snooze it, or tap View guidance to go straight into emergency mode
- **Tap "View guidance"** — and now we're in emergency mode, triggered by the zone this time
- **Tap Exit → confirm**

- So that's all 10 user goals and all 10 usability heuristics. My groupmates can take any questions.

---

## Fallback Plans

| Problem | Fallback |
|---|---|
| Phone dies / crashes | Have a second phone with the app installed and ready. Keep both charged. |
| App freezes mid-demo | Force-close and reopen — the app preserves state. Have a pre-created account ready so you don't need to re-onboard. |
| Network issues | The app has offline mode — toggle it on and continue the demo. Offline is a feature, not a bug. |
| A specific screen breaks | Skip it, mention the feature verbally, and move on. Don't debug live. |
| Slides won't display | Demo can stand alone without slides. Have the low-fi wireframes as images on the phone if needed. |

---

## Q&A Preparation (for groupmates)

The Q&A is worth **3 points** and the prof said questions will be about **your application and design**. Focus on connecting answers to **course material and HCI concepts**, not technical implementation. The heuristics slide in the presentation is a good reference to pull up during Q&A.

### Likely Questions

**"How does the credibility progression work?"**
> Flares start as "Reported" when submitted. Community confirmation moves them to "Confirmed." Campus safety can mark them "Verified." When cleared, they become "Resolved." Each level has a distinct color: orange, blue, green, grey. This directly supports **visibility of system status (H1)** — users can judge trustworthiness at a glance without reading details.

**"Which usability heuristics guided your design?"**
> All 10. The biggest ones for us were: **(1) Visibility of system status** — online/offline badges, credibility labels, progress bars everywhere. **(2) Match between system and real world** — we use "flare" instead of "alert" to stay calm. **(5) Error prevention** — structured categories prevent vague reports, confirmation before exiting emergency mode. **(8) Aesthetic and minimalist design** — Calm Tech principles, low-stim mode strips the interface down. But every heuristic is covered — we can point to specific examples for any of them.

**"How did your design evolve from low-fi to high-fi?"**
> Low-fi wireframes were grayscale and focused on layout, hierarchy, and flow — where does the credibility chip go, where does the action button sit, what's the navigation structure. High-fi added the Concordia color system, real interaction states, conditional rendering for accessibility preferences, and polished transitions. The core structure stayed the same because the low-fi captured the right information architecture.

**"Why a mobile app?"**
> Because safety navigation requires real-time location awareness, push notifications, and offline capability — all things that need to be on the device students already carry. The platform choice was driven by user needs and context, not by our development skills.

**"How do you prevent misinformation in crowdsourced reports?"**
> Three mechanisms: (1) Structured categories force specificity. (2) The 4-stage credibility system makes trustworthiness visible. (3) Undo after submission lets users retract mistakes immediately. This combines **error prevention (H5)** with **visibility of system status (H1)**.

**"What happens when the user goes offline?"**
> The app caches recent flares and preferences. The header shows an orange "Offline" badge. Saved flares remain accessible. New reports queue locally and sync on reconnect. We never show blank screens or aggressive errors — just a calm indicator. This supports **H1 (visibility)** and **H9 (error recovery)**.

**"How does zone-of-interest detection work?"**
> The system monitors proximity to flagged areas. When a user enters or approaches a zone with an active high-severity flare, a calm prompt appears. It's dismissible and rate-limited to prevent alert fatigue. In severe cases it can auto-activate emergency mode. The trigger source is tracked — manual, flare, or zone — so the emergency steps are context-aware. This is **H7 (flexibility)** — the system adapts to context automatically.

**"What's the difference between normal mode and emergency mode?"**
> Normal mode is the full app — feed, routing, reporting, settings. Emergency mode strips the interface to three tabs: Steps, Safe Route, Updates. Non-essential features disappear. Touch targets get larger. Language stays calm. A persistent bottom bar keeps Campus Security, 911, and Quick Report always reachable. This is a direct application of **Calm Tech and Emergency UX principles** — reduce cognitive load when stakes are highest. It demonstrates **H8 (minimalist design)** and **H3 (user control)**.

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
- [ ] Second phone has the app as a backup
- [ ] A pre-created account exists (skip onboarding if something breaks)
- [ ] Slides are loaded on the laptop
- [ ] Printed script on the desk
- [ ] Groupmates have reviewed the Q&A section and the heuristics slide
- [ ] Team arrives 15 minutes early
