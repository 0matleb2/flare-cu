# Alpha Demo Script — Flare CU (~12 min)

**Format:** Solo presenter, live on device (screen-shared), ~9 min demo + ~3 min Q&A
**Deliverable:** Alpha System & Demo (5%)

---

## Rubric Coverage Matrix

This table maps every graded criterion and user goal to the exact demo segment where it appears.

### Rubric Criteria

| Criterion | Weight | Covered in segment |
|---|---|---|
| Double diamond design (or similar) for prototypes | /0.5 | 1 — Context & Design Process |
| Low- and high-fidelity prototypes | /1 | 1 — Context & Design Process |
| All UI elements presented in prototypes | /0.5 | 2–7 (walkthrough covers all screens) |
| Each UI element explained in the pdf file | /0.5 | Covered by Alpha Demo Report PDF |
| Demo with marker | /2.5 | Entire live walkthrough |

### User Goals

| # | User Goal | Covered in segment | Key moment |
|---|---|---|---|
| 1 | Create a user account | 2 — Onboarding | Create Account screen |
| 2 | Apply Emergency UX | 6 — Emergency Mode | Full EmergencyShell walkthrough |
| 3 | Label crowdsourced data | 3 — Feed & Detail | CredibilityChip on cards + detail timeline |
| 4 | Show thread progress bar | 3 — Feed & Detail | Timeline section in FlareDetailScreen |
| 5 | Design for offline mode | 7 — Accessibility & Offline | Offline toggle in Settings, offline banner, Saved tab offline pack |
| 6 | Zone of interest detection | 7 — Accessibility & Offline | Verbal explanation of zone-triggered emergency activation |
| 7 | Report a safety issue quickly | 4 — Raise a Flare | 3-step reporting flow |
| 8 | Receive calm, actionable alerts | 3 + 7 | Calm language on cards, alert intensity setting |
| 9 | Follow a recommended action plan | 5 — Route Planning | ActionPlanScreen step-by-step walkthrough |
| 10 | Set personalized accessibility/calm preferences | 2 + 7 | Quick Setup + Settings screen |

---

## Timed Outline

| # | Segment | Target | Cumulative |
|---|---|---|---|
| 1 | Context & Design Process | 0:45 | 0:45 |
| 2 | Onboarding | 1:00 | 1:45 |
| 3 | Nearby Feed & Flare Detail | 2:00 | 3:45 |
| 4 | Raise a Flare | 1:00 | 4:45 |
| 5 | Route Planning | 1:00 | 5:45 |
| 6 | Emergency Mode | 1:30 | 7:15 |
| 7 | Accessibility, Offline & Wrap-up | 1:00 | 8:15 |
| — | Q&A buffer | 3:45 | 12:00 |

---

## Script

### 1 — Context & Design Process (0:45)

- So Flare CU is a safety app for Concordia SGW students — it helps you navigate disruptions like protests, blockades, crowds, construction
- Where Google Maps optimizes for speed, we're optimizing for safety, accessibility, and staying calm under stress
- We designed for three groups: students with mobility needs, students with anxiety, and students who are new to campus
- Process-wise we used Double Diamond — went from research and personas to low-fi wireframes, then refined into this high-fi prototype in React Native
- All the UI elements are documented in the Alpha Demo Report

→ "Let me walk you through the app."

---

### 2 — Onboarding (1:00)

- So here's the welcome screen — you can log in, create an account, or just continue as a guest
- Guest mode is nice because you can browse alerts right away without signing up
- I'll go ahead and create an account to show the full flow
- **Tap Create account** — it's just email and password, takes a few seconds *(UG1 — Create account)*
- I'll fill this in and submit
- **Tap Create account → Quick Setup appears**
- So now we get Quick Setup — here you can turn on mobility-friendly routing, which prioritizes ramps and elevators
- Low-stim mode tones things down — less motion, simpler alerts
- And alert intensity controls how much shows up in your feed
- All of this is optional and you can change it anytime in Settings *(UG10 — Personalized preferences)*

→ "Let's see the main feed."

---

### 3 — Nearby Feed & Flare Detail (2:00)

- This is the Nearby screen, it's the main feed
- Up top you've got SGW Campus and whether you're online or offline
- **Tap between the sort chips** — you can sort by Priority, Nearest, or Recent
- Each card here is a flare — basically a reported disruption
- See this credibility label? This one says Verified in green, meaning campus safety confirmed it *(UG3 — Label crowdsourced data)*
- There are four levels — Reported, Confirmed, Verified, Resolved — each with its own color
- Let me tap into one so you can see the detail view
- **Tap a flare card**
- So here you get the full info, how many people confirmed it — 21 here — and you can confirm it yourself
- If I scroll down there's a Timeline section
- **Scroll down to the Timeline** — this is the progress bar showing the whole lifecycle *(UG4 — Thread progress bar)*
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
- Structured categories keep reports specific and cut down on noise
- I'll pick blocked entrance
- **Select Blocked entrance → Next**
- Step 2 is the location — these chips make it quick
- **Tap Hall → Next**
- Step 3 is just an optional note if you want to add detail
- And that's it, I'll submit
- **Tap Raise flare** — that whole thing was under 30 seconds *(UG7 — Report quickly)*
- And we're back on the feed — see the snackbar at the bottom saying "Flare raised" with an Undo button in case you made a mistake

→ "Say I need to get to EV safely."

---

### 5 — Route Planning (1:00)

- Let me hop over to the Route tab
- **Tap the Route tab**
- It defaults to your current location for the starting point
- These toggles let you avoid high-tension areas, stick to accessible paths, or reduce stimulation
- And there's a quick grid for common SGW buildings — I'll pick EV
- **Tap EV**
- So you get a few options — Safest, Accessible, Fastest safe
- The top one gets a "Best match" badge based on whatever preferences you set
- Let me start this one
- **Tap Start plan** — now you've got a step-by-step walkthrough *(UG9 — Follow action plan)*
- Progress bar at the top, current instruction front and center, all steps listed below
- **Tap Next step** a couple times
- When you're done it says "You've arrived" and prompts you to check the feed

→ "Now imagine something serious happens."

---

### 6 — Emergency Mode (1:30)

- So let me go back to that flare we saved earlier and enter emergency mode from there
- **Navigate to the flare detail → Tap "Enter emergency mode"**
- Right away you can see everything looks different — there's a red banner at the top, and you can always exit right from here *(UG2 — Emergency UX)*
- Since we came in from an actual flare, the app knows what's going on and gives you specific instructions

- So on the Steps tab, it's telling me the area is restricted — that's based on the flare we came from
- Nice short steps, never more than 2 to 4
- **Tap Next step**

- Let me swipe over to Safe route
- **Swipe to Safe route**
- This gives you pre-built options like nearest safe building or just get away from the area
- And if you have accessibility turned on, there's a badge showing it's ramp-friendly

- And then there's Updates
- **Swipe to Updates**
- You can see the flare that triggered all this, what else is active nearby, and you can refresh manually

- Down at the bottom you've always got Campus Security, 911, and Quick Report no matter which tab you're on
- Let me open Quick Report
- **Tap Quick report** — so you can report something new without leaving emergency mode
- And when you're ready to leave
- **Tap Exit** — it checks with you first, asks "Are you safe?" before going back to normal

→ "Last thing — accessibility and offline."

---

### 7 — Accessibility, Offline & Wrap-up (1:00)

- Let me go to Settings
- **Tap Settings**
- Alert intensity on Low hides unconfirmed flares so there's less noise
- Accessibility bumps accessible routes to the top
- Low-stim mutes colors, cuts animations, and collapses sections by default *(UG10 — Personalized preferences)*

- I'll turn on offline mode here and go back to the feed
- **Toggle Offline mode on → go back to Nearby**
- See the badge switched to Offline in orange — everything still works off cached data *(UG5 — Offline mode)*
- And if I check the Saved tab
- **Tap the Saved tab** — there's an offline pack showing last sync and how many flares are cached
- Anything you report offline gets queued and syncs when you reconnect
- That matters on SGW campus where the tunnels and corridors have spotty signal

- There's also a zone detection feature — let me show that
- **Toggle Offline mode off → go back to Settings → Tap "Simulate zone alert"**
- So this is what you'd see if you walked near a flagged area *(UG6 — Zone detection)*
- It's a calm prompt — you can dismiss it, snooze it, or tap View guidance to go straight into emergency mode
- **Tap "View guidance"** — and now we're in emergency mode, triggered by the zone this time
- **Tap Exit → confirm**

- So that's all 10 user goals — everything is documented in the Alpha Demo Report. Happy to take questions

---

## Q&A Preparation

Likely TA questions with suggested answers:

**"How does the credibility progression work?"**
> Flares start as "Reported" when submitted by a user. When enough community members tap "Confirm," it moves to "Confirmed." Campus safety can mark it "Verified" — that's the official stamp. When the disruption clears, it's marked "Resolved." Each level has a distinct color: orange, blue, green, grey.

**"What happens when the user goes offline?"**
> The app caches recent flares and user preferences in AsyncStorage. The header switches to an orange "Offline" badge. Saved flares remain accessible. New reports are queued locally and sync when connectivity returns. The app never shows blank states or aggressive error messages — just a calm offline indicator.

**"How does zone-of-interest detection work?"**
> The EmergencyContext monitors proximity to flagged areas. When a user enters or approaches a zone with an active high-severity flare, a calm prompt appears with a recommended action. It's rate-limited and dismissible. In severe cases, the system can auto-activate Emergency mode. The trigger source is tracked — "manual," "flare," or "zone" — so the emergency steps are context-aware.

**"Which usability heuristics guided your design?"**
> All 10, with emphasis on four: (1) Visibility of system status — online/offline badges, credibility labels, progress bars. (2) Match between system and real world — we use "flare" instead of "alert" to reduce panic. (3) Error prevention — confirmation before high-impact reports, snackbar undo after submission, "Are you safe?" before exiting emergency. (4) Aesthetic and minimalist design — calm tech principles, low-stim mode, only essential information visible.

**"How did low-fi prototypes differ from the final?"**
> Low-fi wireframes established the screen hierarchy, navigation flows, and information layout. They were grayscale sketches focused on placement — where the credibility chip goes, where the action button sits. The high-fi prototype added the Concordia burgundy color system, Material Design 3 components via React Native Paper, real interaction states, and conditional rendering for accessibility preferences.

**"Why React Native / Expo?"**
> Mobile is the right platform because safety navigation requires real-time location awareness, push notifications, and offline functionality. React Native with Expo gives us cross-platform iOS and Android support from a shared codebase, plus simple access to device APIs. React Native Paper provides pre-built accessible components following Material Design.

**"How do you prevent misinformation in crowdsourced reports?"**
> Three mechanisms: (1) Structured categories force specificity instead of vague reports. (2) The 4-stage credibility system (Reported → Confirmed → Verified → Resolved) makes trustworthiness visible. (3) A snackbar with an Undo button appears after submission so users can retract mistakes immediately.

**"What's the difference between normal mode and emergency mode?"**
> Normal mode is the full app — feed, routing, reporting, settings. Emergency mode strips the interface down to three focused tabs: Steps (what to do), Safe Route (where to go), and Updates (what's happening). Non-essential features disappear. Touch targets get larger. Language stays calm. A persistent bottom bar keeps Campus Security, 911, and Quick Report always reachable.
