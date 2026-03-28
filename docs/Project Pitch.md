# **Project Pitch**

## SOEN 6751 – Human Computer Interface Design – Winter 2026  – Group 5

## Tahina Andriantomanga (40313407), Harshavardhan Anbuchezhian Gowri (40323293), Akhilesh Ranjit Kanbarkar (40301665), Mathieu Leblanc (29557695), Joshua Onyema (40293065)

# **1\. Problem and Motivation**

Navigating Concordia’s SGW campus becomes difficult during disruptions such as protests, dense crowds, blockades, temporary entrance closures, and construction. Because SGW is an open urban campus spread across downtown streets and multiple buildings, conditions can change quickly at the street and building level. Students may arrive at a blocked entrance, encounter a crowd that makes a route unsafe or inaccessible, or face sudden access restrictions that force detours.

Existing tools do not fully support this scenario. Google Maps optimizes for time and distance, not safety, accessibility constraints, or calm decision-making under stress. Concordia’s official channels (emails, alerts, and tools like Rave Guardian) communicate emergency information, but they are not designed to support street level, building to building navigation during evolving disruptions, or to translate updates into actionable routing guidance for students moving across SGW. Students therefore lack a single, calm place to understand what is happening nearby, how credible it is, whether it is improving or worsening, and what to do next (avoid, reroute, wait, move indoors). This is especially important for students with mobility constraints, anxiety or sensory sensitivity, and students with low familiarity with SGW.

Flare CU is a one stop, SGW focused safety and navigation system that links to official alerts and complements them with campus specific, location based disruption information. It provides calm guidance, credibility cues, and incident progress at a glance so students can move between SGW buildings more safely during protests and other disruptions, without information overload.

# **2\. Users, Context and Design Approach**

## **2.1 Users and Context**

Flare CU is designed for Concordia students navigating SGW during disruptions. Primary user groups include mobility-constrained students, anxiety-sensitive students, and students with low familiarity with campus layouts. Key constraints include accessibility barriers, stress and time pressure, incomplete information, and rapidly changing conditions.

*Stakeholder map shows who affects SGW safety navigation, students are the primary users, official sources provide trusted context.*

*These personas capture key student types, their goals and constraints drive Flare CU’s core flows and Calm Tech and Emergency UX decisions.*

## **2.2 Design Approach: Double Diamond**

Flare CU follows a Double Diamond design process to ensure a user-centered approach aligned with course requirements.

### **Discover — Understanding the problem and user needs**

Review public sources (Concordia safety pages, emergency resources, Rave Guardian info pages, campus maps, building access and accessibility resources, and public updates about disruptions) to identify real constraints.

### **Define — Refining the problem and requirements**

Translate findings into design constraints, finalize personas, and specify required goals (account, Emergency UX, credibility labels, thread progress, offline mode, zone of interest) plus additional goals.

### **Develop — Ideation and prototyping**

Produce low-fi to high-fi prototypes, including Normal mode and Emergency UX mode, plus key user flows (route guidance, reporting, credibility labels, incident status, offline behavior).

### **Deliver — Prototype implementation and evaluation**

Prepare an alpha prototype demo and evaluate using the 10 usability heuristics, emphasizing clarity under stress, accessibility, error prevention, and trust cues.

## **2.3 Why this is important for Concordia students**

During disruptions, students must make quick navigation decisions with limited, fragmented information. A wrong turn can cause missed classes, unsafe exposure to high-tension zones, or inaccessible detours. Flare CU is important because it reduces uncertainty by combining disruption awareness with calm, actionable guidance tailored to accessibility and stress constraints.

# **3\. User Goals and Tasks**

## **3.1 Create a user account**

**Goal:** Enable fast yet intuitive account creation so students can access safety features with low effort.

**Tasks:** Open app, choose sign up method, enter minimal details, confirm, continue to home.

**Requirements:** The system must request only essential information, must allow skipping non critical profile steps, must confirm success clearly, must not block access to safety features during onboarding.

## **3.2 Apply emergency UX**

**Goal:** Reduce cognitive load during high tension situations by simplifying the interface automatically.

**Tasks:** Enter or approach a flagged zone, view emergency screen, choose a recommended action, return to normal mode when safe.

**Requirements:** The system must switch to Emergency UX based on zone status, must hide non essential features, must present no more than 2 primary actions, must avoid alarming language and excessive motion.

## **3.3 Label crowdsourced data**

**Goal:** Help users judge trustworthiness of flares quickly.

**Tasks:** View flare feed, open a flare, read credibility label and timestamp, decide to avoid or continue.

**Requirements:** The system must label each flare (Reported, Confirmed, Verified (official), Resolved), must show last updated time, must summarise status to avoid conflicting information, must keep labels consistent and unobtrusive.

## **3.4 Show thread progress**

**Goal:** Show incident lifecycle clearly so users understand whether it is new, active, or resolved.

**Tasks:** Open flare thread, check current stage, review updates, close and return later.

**Requirements:** The system must display a simple progress indicator (reported → confirmed → verified → resolved), must show current stage prominently, must preserve context across sessions, must keep the same indicator placement across screens.

## **3.5 Design for offline mode**

**Goal:** Keep core safety information usable when connectivity is weak, especially in SGW indoor corridors and tunnels.

**Tasks:** Open app offline, view cached flares and zone status, view saved guidance, draft a flare for later sync.

**Requirements:** The system must cache recent flares and zone status, must show a clear offline indicator, must allow queued reports, must prevent blank states and repeated error prompts.

## **3.6 Detect zone of interest**

**Goal:** Notify users calmly when they are inside or approaching an affected area.

**Tasks:** Enter or approach a zone, receive prompt, dismiss or open details, follow recommendation.

**Requirements:** The system must detect proximity to flagged areas, must present a calm prompt with one recommended action, must allow dismissal, must rate limit prompts to avoid alert fatigue.

## **3.7 Report a safety issue quickly and safely**

**Goal:** Let students report issues fast without escalating panic or misinformation.

**Tasks:** Tap report, choose category, confirm location, add optional short note, submit, optionally retract shortly after.

**Requirements:** The system must support structured categories (blockade, crowding, construction, access restriction), must keep reporting under 30 seconds, must confirm before posting high tension categories, must allow edits or retraction within a short window.

## **3.8 Receive calm, actionable alerts**

**Goal:** Provide guidance that supports safe decisions without increasing anxiety.

**Tasks:** Receive alert, understand recommended action, follow or snooze, adjust alert intensity if needed.

**Requirements:** The system must send alerts only for relevant zones and chosen severity, must phrase alerts as guidance (avoid, wait, go indoors, recheck), must support low stimulation mode, must provide snooze and mute controls.

## **3.9 Review and follow a recommended action plan**

**Goal:** Offer a short step plan for common scenarios so users know what to do next.

**Tasks:** Start plan, complete steps, view progress, confirm safe or recheck status.

**Requirements:** The system must provide 2 to 4 step plans, must show progress clearly, must allow exit at any time without losing state, must keep instructions short and scannable.

## **3.10 Set personalised accessibility and calm preferences**

**Goal:** Tailor guidance for mobility needs and anxiety or sensory sensitivity.

**Tasks:** Set preferences, update anytime, see recommendations adapt, reset to defaults.

**Requirements:** The system must support mobility friendly guidance and low stimulation alerts, must keep preferences optional, must explain effects in simple language, must store preferences locally for offline use.

# **4\. Design and Usability**

Flare CU follows Calm Tech and Emergency UX principles for high-tension navigation. In Normal Mode, users view nearby disruptions (“flares”), credibility labels, timestamps, and suggested safer routing between SGW buildings and entrances. When the user enters or approaches a Zone of Interest, the interface can switch to Emergency UX Mode, reducing the UI to essential information with large touch targets, minimal text, and one clear recommended action (avoid, reroute, wait, move indoors, recheck). Offline tolerant behavior keeps recent flares and guidance available and allows reports to be queued. “Verified (official)” is presented as an in-app status representing trusted confirmation, without detailing back-office processes.

Usability components are addressed as follows. Learnability is supported through familiar feed-first layout with clear cards, consistent icons aligned with Concordia visual patterns, and short, predictable flows for core actions. Efficiency is supported through at-a-glance status (credibility labels plus incident progress indicator) and minimal steps to report or decide. Memorability is supported through consistent placement of labels, actions, and the progress indicator across screens. Error handling is supported through confirmation for high-impact reports, clear offline indicators, and recovery paths (queue, retry, edit or retract within a short window). Satisfaction is supported through low stimulation visuals, limited notification intensity, and calm language that reduces panic and decision fatigue.

# **5\. Technical and Team Requirements**

## **5.1	Platform and tech stack**

The primary platform for Flare CU will be a cross-platform mobile application. A mobile app is necessary for this project because it provides the necessary real-time location awareness, push notifications, and offline functionality required during a dynamic safety event.

For this project, we will use the following core stack:

1. **React Native with Expo:** Supports rapid cross-platform development for iOS and Android using a shared codebase. Expo simplifies access to common device capabilities such as location services and notifications through managed APIs, reducing setup complexity and allowing the team to focus on user experience and interaction design.

2. **React Native Paper:** Provides a set of pre-built, accessible UI components that follow Material Design principles and can be customized to fit the application’s visual language. Using a consistent component library supports interface consistency and predictable interactions, helping reduce cognitive load while enabling faster iteration on UX design.

3. **AsyncStorage:** Provides simple, key-value persistent storage on the device, allowing essential user data and application state (e.g., preferences or cached context) to persist across sessions and support basic offline functionality.

## **5.2	Required team skills**

The successful execution of this project requires various skills. Our team composition and required competencies are as follows:

1. **Front-End and Mobile Development:** Experience in React Native development with TypeScript to implement screens, user flows, and integrating device APIs.

2. **UI/UX and Interaction Design:** Knowledge of design tools such as Figma and solid understanding of HCI principles. These skills are needed to create low and high-fidelity wireframes, user flow diagrams, and ensure all design artifacts adhere to the double-diamond process.

3. **Systems Design & Data Modeling:** Ability to design the application's high-level data structures and system architecture to ensure a coherent and seamless implementation.

4. **Technical Documentation:** Explain design rationale and system features clearly in project reports.

