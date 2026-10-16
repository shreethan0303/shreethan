# Reference baseline validation

Verified in the current cloud instance. These results do not prove a hosting deployment or GitHub Actions run.

Passed:

- Production build of the isolated original renderer and Next application.
- Root TypeScript check and formatting check.
- Real Chromium: required assets finish loading, Start reveals the room, and clicking approaches the desk.
- Original CSS3D monitor loads the same-origin personal desktop.
- Hovering an embedded desktop button approaches the monitor; About opens; Projects navigates inside the monitor.
- Project list links to the cube-solver detail page.
- Direct desktop at 390×844: no horizontal overflow, About usable.
- Resume PDF generated and extracted text includes Shreethan Palla and profile draft content.
- Initial browser run: zero page errors, zero 400+ resource responses, zero external HTTP requests.
- Branch push confirmed by reading the matching remote commit.

Known limits:

- Original inherited assets/boot are intentionally still present. The screenshot is a licensed reference baseline, not a finished customized workbench.
- Original monitor textures/paper artwork contain upstream branding and content; replace before presenting the scene as a finished personal portfolio.
- Original renderer emits JS/media size warnings. No frame-rate, real-phone performance or broad-browser claim has been established.
- Original 3D accessibility and loading-failure behavior need further work. Direct content routes are available; the direct desktop mobile check is not a full 3D mobile test.
- No real robot CAD imported. No accurate exploded assembly verified.
- No public preview deployment. Browser-panel requests earlier returned queued; localhost is not a user-accessible cloud preview.

![Original reference scene with local integration](images/reference-overview.png)

![Embedded personal desktop inside the original monitor](images/reference-monitor.png)

## Scroll assembly / deployment preparation

- `/projects/robotics`: normalized scroll positions 0%, 50%, 100% map to component separation.
- Reverse scroll returns to assembled state.
- Keyboard End on the range control moves to fully separated state and corresponding scroll position.
- 390px viewport has no horizontal overflow; reduced-motion mode preserves direct scroll control.
- Chromium run reported zero page errors.
- These checks use explicitly illustrative geometry, not an accurate user robot.
- Next.js upgraded to 15.5.28 and its PostCSS dependency overridden to 8.5.30; npm audit no longer reports Next/PostCSS advisories in the root production dependency tree. This does not claim a complete audit of the inherited renderer/tooling.

![Illustrative assembly before scrolling](images/assembly-assembled.png)

![Illustrative assembly after scrolling](images/assembly-exploded.png)

## Garage intro validation

Production build passed. Chromium checks passed: Start disabled while an intentionally delayed asset loads; keyboard Start; door moves upward and is removed after reveal; original room remains visible; Skip; reduced-motion immediate camera event; aborted model load gives a working Open without 3D route; 390px entrance has no horizontal overflow. No page errors in that run. Final styled door/reveal captures are in the images folder. The final cosmetic pass also passed a fresh build and door/reveal check.

## Empty desk and classic garage door

Production build and final renderer build passed. Chromium checked the wider 390×232 entrance card, four individually tilting door sections with sixteen recessed panels, completed reveal, absence of the old monitor overlay, mobile layout/direct desktop link, and reduced-motion entry. No page errors or failed resource responses occurred in the final run. The exported scene contains exactly the original backdrop, one tabletop and four legs. Visual review confirmed the bare charcoal desk and soft floor shadows.

![Bare four-legged desk](images/empty-desk.png)

## Flat entrance and centered camera

Production build, final renderer build, formatting and whitespace checks passed. Final Chromium run verified flat door surfaces without background images or box shadows, independent sectional motion, completed reveal, name and ticking clock without a role subtitle, narrow entrance/desk views, and reduced-motion entry. It reported no page errors or failed asset responses. Camera projection checks against the actual keyframe classes passed at 1440×1000, 390×844 and 1920×1080; all desk bounds remain visible with horizontal centers within 1% of viewport width. Visual review of desktop and phone screenshots confirmed centered framing.

![Centered close-up with name and clock](images/desk-centered.png)

## Interactive résumé paper

The full production build and formatting/whitespace checks passed. Final Chromium checks passed: Enter reveals the room; clicking reaches the desk; the actual projected paper surface picks correctly; hovering raises/brightens it; clicking opens the readable sheet; the PDF download contains a valid one-page placeholder; Back and Escape preserve the desk view; keyboard opening, focus trapping, return focus and reopening work. Narrow 390×844 layout has no reader overflow. Touch-enabled Chromium opened and closed the sheet with taps. Reduced-motion opens without the expansion animation. The run reported no page errors or failed resource responses. PDF text extraction confirmed the user's name, placeholder label, supplied project names and GitHub URL.

![Paper resting on the desk](images/paper-resting.png)

![Readable résumé over the faint room](images/resume-paper-open.png)

![Phone résumé view](images/resume-paper-mobile.png)

## Scroll entrance and lorem ipsum placeholder

Full production build, final renderer build and formatting checks passed. Chromium verified greeting/copy, partial wheel opening, reverse scrolling back to closed, complete entry, Enter button/keyboard entry, PageDown entry, reduced-motion entry, mobile layout and the touch-event path. A separate native CDP touch swipe also opened the door. After resizing a partly open entrance from 1440×1000 to 390×844, panel dimensions updated, reverse scrolling closed it, and scrolling reopened it. The résumé still opens/closes with touch; its HTML body and direct route contain lorem ipsum without project/contact content. The downloaded PDF is valid; text extraction confirms lorem ipsum and no project/contact text. Regular functional runs reported no page errors or failed asset requests.

The PC remains deferred. Source research verified Henry's baked-model helper, Bruno's mesh-name/material parser and resource manifest, and the glTF Transform CLI README. No exact Corsair 5000T asset has been selected or verified.

## Text-only entrance and real asset loader

Full production build, formatting and whitespace checks passed. Chromium checks held actual scene assets to verify the circular progress UI and no greeting before readiness; after release, the loader cleared without an added delay. The card and Enter button are absent. Initial scroll moved/faded the text while all door panel rotations stayed at zero; further scroll hid the copy and tilted the door sections; reversing restored the text and closed door. End-key entry, reduced-motion entry, native touch swipe and narrow text layout passed. The existing résumé still opens by keyboard and contains lorem ipsum.

An intentionally aborted audio asset produced a short failure alert, removed the spinner and left a functioning direct desktop link. Regular functional runs reported no page errors or failed resource responses; that explicit failure scenario is separate.

![Actual workspace loader](images/workspace-loader.png)

![Text-only introduction](images/garage-door.png)

![Phone introduction](images/intro-mobile.png)

## Editable introduction and interface proposal

The full production build, formatting and whitespace checks passed. Entrance and loading copy now come from `experience/src/portfolio-copy.ts`; the intro no longer mentions RC cars. Chromium inspected the updated HTML at 1440×1000 and 390×844: the full greeting, description and hint fit within the viewport, with no horizontal overflow or page errors. Updated desktop/phone entrance screenshots are above. The existing entrance animation and scene geometry were not changed in this pass.

The content/interface guide records GitHub editing steps, branch/deployment distinctions and an Onshape-inspired monitor proposal. Public source retrieval verified Henry's separate room/inner-site structure and Brittany Chiang's v4 hero hierarchy. The proposed monitor interface has not been implemented. A local passing build is not a claim that Vercel has finished publishing this commit.
