# Workshop layout and résumé paper

The first interactive object is the résumé sheet. Only that object has been added; the rest of the desk remains open for deciding the layout.

Suggested layout viewed from the front:

| Left         | Center/back                         | Right                  |
| ------------ | ----------------------------------- | ---------------------- |
| Résumé paper | Future computer / personal overview | Future project objects |

The paper is positioned toward the front-left for visibility. These are initial choices, not commitments about the eventual computer or robot.

## Change the authored click-to-zoom view

Free camera lets a visitor explore. The authored desk view is the destination used when someone clicks from the overview. Change its settings in `experience/src/Application/World/WorkshopLayout.ts`:

| Setting                 | Effect                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `deskView.direction`    | Direction from the desk toward the camera; increase Y for a more overhead view, change X to choose the side |
| `deskView.targetOffset` | Shift the point the camera aims at relative to the desk's computed center                                   |
| `deskView.fill`         | Fraction of the available frame used by the bounds; lower values leave more room                            |
| `deskView.duration`     | Camera transition length in milliseconds; 1000 is one second                                                |

These are scene coordinates, not browser pixels. X runs left/right, Y up/down, and positive Z points toward the front of the desk. The original scene uses a large unit scale, so a position of 900 does not mean 900 meters. The bounds-fitting calculation accounts for screen aspect ratio. Reduced-motion uses an immediate camera transition.

For example, change `direction` from `[-.35, .7, 1]` to `[0, 1, 1]` for a centered, more overhead direction. Leave `targetOffset` at `[0, 0, 0]` to keep the target at the desk's center. Change one setting, rebuild the renderer, then compare desktop and narrow-screen framing before committing it.

## Create and place paper

A paper model is a subdivided rectangle with a tiny curled edge. A canvas-generated texture supplies the off-white surface, ruled lines, name and résumé label. No external model download, Onshape document or asset license is needed.

The implementation is `experience/src/Application/World/ResumePaper.ts`. A separate, inexpensive transparent plane supplies a soft contact shadow; the existing desk's baked lighting is unchanged.

The `resume` settings in `WorkshopLayout.ts` control position, angle, width, height and hover lift. Initial position is `[-2400, -440, 450]`. To move it right, increase X. To move it toward the viewer, increase Z. Keep its resting Y just above the tabletop, whose surface is about -452, so it does not disappear inside or flicker against the desk.

Rotation is around the vertical axis and uses radians. A small angle keeps the sheet casually placed while its text stays oriented toward the front.

## Three interaction states

1. **Resting:** the sheet lies on the desk. It becomes interactive once the desk close-up completes.
2. **Hover/focus:** pointer coordinates become a ray through the camera. If the ray hits the paper mesh, its height and material brightness ease toward a raised state. Leaving the sheet returns them to rest. Keyboard focus uses the same state. The effect changes the mesh's transform and color; the whole room is not relit.
3. **Reading:** clicking/tapping the paper projects its corners into screen coordinates and opens a matching HTML sheet. That rectangle provides the starting position/size for the expansion animation. The room stays behind a faint, blurred overlay. The small 3D sheet is hidden while its large representation is open.

The text in the reading view is real HTML, so it remains selectable, responsive and readable rather than becoming an enlarged bitmap. Its component is `experience/src/Application/UI/components/ResumePaper.tsx`. The overlay contains the only résumé download control and a Back to desk button.

The original camera reacted to every scene press. It now uses a click and ignores UI controls; a captured paper click is consumed before reaching the generic camera handler. While the résumé is open, camera interactions are locked. Back to desk or Escape closes the sheet without changing the desk view.

Keyboard users can Tab to Open résumé after entering the desk view, press Enter, move among the reader controls, and press Escape. Focus stays inside the reader while open and returns to the desk object on close. On touch devices a tap opens the paper without requiring hover. Reduced-motion removes the lifting/expansion animation while preserving the actions.

## Placeholder and final résumé

The current HTML sheet, direct résumé page and PDF are explicitly labeled as placeholders. Their bodies contain only lorem ipsum; no project list, contact details, education or experience is shown.

The download is a real, one-page PDF at `public/resume/shreethan-palla-placeholder.pdf`, served as `/resume/shreethan-palla-placeholder.pdf`. The HTML and PDF are separate presentations. When the final résumé arrives, replace the download and update the readable sheet's content/labels together. Replacing the PDF alone will not rewrite the HTML.

## Try and validate

Run `npm run build:experience` after editing the layout or paper code, then refresh a running development server. The renderer watcher can do this during an editing session. For deployment, run the normal full build.

Check: scroll/swipe or Enter → click desk → hover/focus paper → click/Enter → read/download → Back/Escape → open again. Repeat on a phone or narrow viewport and with reduced motion. Confirm the downloaded PDF actually contains the expected résumé text. A functioning link alone does not validate the document.
