# PRODUCT.md

## What It Is

A shared travel map where users mark countries they've visited or want to visit, attach personal notes to each country, and share the map with others via a link. Each person on a shared map maintains their own independent set of marks and notes. No account required — identity is established by entering a name when first opening a map.

---

## The Problem It Solves

Couples and friend groups who travel together have no simple, frictionless way to visualize and compare their travel histories and wishlists. Existing tools require sign-up, are too complex, or don't support shared, multi-person views. The result: people use static screenshots, verbal lists, or nothing at all. This tool makes it instant — one link, no account, start marking in seconds.

---

## Who Uses It

**Persona 1 — The Initiator (e.g., Ana, 29, travels with her partner)**
Ana and her partner are planning a trip and want to compare where they've each been. She creates a map, marks her countries, and sends the link on WhatsApp. She expects her partner to open it immediately and start adding his own marks without asking her how to use it.

**Persona 2 — The Recipient (e.g., Tomek, 31, receives a link on WhatsApp)**
Tomek opens a link on his phone. He has never seen this app before. He needs to understand what to do in under 30 seconds and start marking countries without creating an account or reading instructions.

**Persona 3 — A Friend Group (3–6 people planning a trip together)**
A group uses a single shared map to see who's been where and build a collective wishlist. Each person's marks are visually distinguishable. They refer back to the map during trip planning conversations.

---

## Core User Flows

### Flow 1 — Create and populate a map
1. User opens the app (no account, no login screen).
2. User is prompted to enter their name.
3. An interactive world map is shown with all countries.
4. User clicks a country — a modal or panel appears with options: mark as "Visited", mark as "Wishlist", or leave unmarked.
5. User optionally writes a note for that country (personal, not visible to others as their note).
6. Country is colored to reflect status (e.g., green = visited, yellow = wishlist).
7. User repeats for as many countries as desired.
8. A shareable link is generated automatically (or on demand).

### Flow 2 — Share the map
1. User copies the share link from the app.
2. User pastes it into WhatsApp (or any channel).
3. Recipient opens the link — no app install, no account creation.
4. Recipient enters their name to establish identity.
5. Recipient sees the map with the original user's marks visible.
6. Recipient adds their own marks and notes independently.
7. Both users' marks coexist on the same map, visually distinguishable.

### Flow 3 — Return to a map
1. User reopens the app in the same browser they used before.
2. Their identity (name) and all their marks are restored from local storage.
3. They can continue marking or editing notes.

> **Edge case — different browser or device:** If a user opens the shared link from a different browser or device, their previous identity and marks are NOT restored. They must re-enter their name and will appear as a new participant on the map. This is an accepted MVP limitation (see Known Limitations below).

---

## Key Domain Concepts and Terminology

| Term | Meaning |
|---|---|
| **Map** | A shared instance identified by a unique URL. All participants on the map see each other's marks. |
| **Participant** | A named person who has entered their name on a map. Identity is stored in browser localStorage. |
| **Mark / Status** | A country's state for a given participant: `visited`, `wishlist`, or unmarked (default). |
| **Note** | Free-text annotation attached to a country by a specific participant. Not shared as "their note" — each person's note is their own. |
| **Share link** | A URL that, when opened, joins the viewer to the same map as a participant. |
| **Identity** | A participant's name, stored in localStorage. Scoped to one browser/device. No account, no email. |

---

## User Stories with Acceptance Criteria

### US-1: Create a map and establish identity
**As a new user, I want to enter my name and start marking countries so that my marks are attributed to me.**

Acceptance criteria:
- Given I open the app for the first time, I am prompted to enter my name before accessing the map.
- Given I enter a name and confirm, I land on the interactive world map.
- Given I have previously used the app in the same browser, my name is pre-filled and I go directly to the map (no re-prompt).
- My name persists in localStorage across page reloads in the same browser.

---

### US-2: Mark a country with a status
**As a participant, I want to click a country and mark it as Visited or Wishlist so that my travel history and intentions are visible.**

Acceptance criteria:
- Given I click a country on the map, a panel or modal appears with options: Visited, Wishlist, Clear.
- Given I select Visited, the country changes color to indicate "visited" status (e.g., green).
- Given I select Wishlist, the country changes color to indicate "wishlist" status (e.g., yellow/orange).
- Given I select Clear, any existing mark is removed and the country returns to its default appearance.
- My marks are saved immediately (no explicit save button required).
- My marks persist across page reloads in the same browser.

---

### US-3: Write a personal note for a country
**As a participant, I want to write a note about a country so that I can capture memories or plans.**

Acceptance criteria:
- Given I have clicked a country, a text area is available in the panel or modal for personal notes.
- Given I type a note and close the panel, the note is saved.
- **Design decision:** Notes are private to each participant. Other participants on the shared map see their own note field for a country, not mine. Notes are not cross-visible. (If this should change — e.g., notes attributed to each person but visible to all — this must be revisited before building the notes feature.)
- Notes persist across page reloads in the same browser.
- Notes can be edited or deleted at any time.

---

### US-4: Share the map with others
**As a participant, I want to copy a link and share it so that friends can join the same map and add their own marks.**

Acceptance criteria:
- Given I am on the map, a share link is visible or accessible with a single click/tap.
- Given I copy the link and share it, the recipient can open it in any modern browser without installing anything.
- Given the recipient opens the link, they are prompted to enter their name.
- Given the recipient enters their name, they land on the same map and can see my marks.
- The recipient's marks do not overwrite or affect my marks.

---

### US-5: View all participants' marks on a shared map
**As a participant, I want to see everyone's marks on the map so that I can compare travel histories and wishlists.**

Acceptance criteria:
- Given multiple participants have marked countries, all marks are visible simultaneously on the map.
- Given two participants have marked the same country differently (e.g., one Visited, one Wishlist), both statuses are visually represented (e.g., split color or stacked indicator).
- Given I click a country that has marks from multiple participants, I can see who marked it and with what status.
- Participant names are shown next to their marks or in the country detail panel.

---

## Success Metrics

| Metric | Target |
|---|---|
| Time to first mark (new user via shared link) | Under 30 seconds from link open to first country marked |
| No-friction sharing | Recipient can join and mark countries with zero account creation |
| Map load time | Interactive map with 200+ countries renders in under 2 seconds |
| Identity persistence | Returning user in same browser sees their marks immediately, no re-entry required |
| Share link works cross-browser | Link opened in any modern browser (Chrome, Safari, Firefox, mobile) works without errors |
| WhatsApp preview | Share link generates a usable preview when pasted into WhatsApp |

---

## Known Limitations (Accepted for MVP)

**Identity is browser-local.** A participant's name and marks are stored in localStorage, scoped to a single browser on a single device. If a user opens the shared link from a different browser or device, they will appear as a new participant and their previous marks will not be accessible.

This is a deliberate MVP tradeoff — no login means no cross-device identity. This limitation must be clearly communicated to users (e.g., a brief tooltip or note: "Your marks are saved in this browser. Use the same browser to return to your map.").

> Open design question for v2: Introduce optional account/email-based identity to enable cross-device persistence, without making it required.

---

## Out of Scope for MVP

- User accounts, passwords, or email-based login
- Photo uploads or media attachments (deferred to v2)
- Real-time collaborative editing / live cursors
- Trip itinerary planning or booking integrations
- City-level or region-level granularity (countries only for MVP)
- Social features (following, feed, likes, comments on others' notes)
- Private maps (all maps accessible to anyone with the link)
- Map export to PDF or image
