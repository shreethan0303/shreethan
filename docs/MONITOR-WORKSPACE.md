# Monitor workspace and the next steps

The monitor sits left of center on the desk, with a white-key mechanical keyboard and black gaming mouse in front. The paper sits farther left, the cube solver sits front-right, and the car sits farther right. Their horizontal bounds fit inside the tabletop without intersecting one another. The FRC robots remain on the floor.

Select the monitor to zoom toward its screen and open the portfolio workspace. A project tree, a central preview and bottom section tabs borrow the organization of the supplied Onshape screenshot. The working controls are Projects, About, Résumé, Read project and Back to desk. Project cards share the existing media and build stories. Closing a card returns to the workspace; closing the workspace returns to the desk. Keyboard focus follows those actions, and Escape closes the current layer.

The current workspace uses the existing approved intro and verified project data. Résumé content is still the same placeholder. Contact details, team contributions and polished personal stories remain pending. The computer case and extra decorations remain later additions.

See the [earlier desk arrangement](images/monitor-workshop.png) and [workspace preview](images/cad-workspace.png).

## How it works

- Three.js draws the physical monitor frame, stand and its static preview texture. The monitor is authored from lightweight geometry, with a hole through its bezel so its screen does not overlap a second front face.
- Selecting it moves the camera to a view framed around the actual screen. A normal HTML interface then opens over the room. This keeps the interface readable and keyboard/touch accessible instead of requiring visitors to interact with tiny projected text.
- The workspace and desk use the same `ProjectContent` objects. Changing photos, titles or stories updates both entry points. Opening a story from the workspace keeps its camera context and returns to the same selected project afterward.
- Expand/Restore changes the existing reader's dimensions with a short animation. Its media elements stay mounted, so expansion does not reload photos or restart video. Reduced-motion users get the final layout directly. This is a layout expansion inside the page, without a browser fullscreen permission flow.
- The future CAD viewer can add meaningful model controls such as rotate, reset and exploded groups. Keep those tied to actual geometry; additional editor-style buttons should only appear when they perform useful portfolio actions.

## What caused the flicker

The previous floor extension covered the same central area as the original baked floor, only one scene unit below it. At the distant overview, the depth buffer could not consistently distinguish the two surfaces. This is called z-fighting: different pixels alternate between nearly coincident surfaces as the camera moves. The extension is now a ring with an opening that matches the original floor. The two floors meet at their edges and do not overlap.

The inherited film grain also changed its noise seed every frame. It is now a fixed monochrome pattern at 3.5% soft-light opacity. Floor contact-shadow materials use a small depth bias to remain stable above their surfaces. The original desk shading, backdrop edge blend, lights and garage entrance remain.

## Files you can change

| Change                            | File                                                                        |
| --------------------------------- | --------------------------------------------------------------------------- |
| Monitor and project positions     | `experience/src/Application/World/WorkshopLayout.ts`                        |
| Physical monitor and preview      | `experience/src/Application/World/PortfolioMonitor.ts`                      |
| Workspace layout/navigation       | `experience/src/Application/UI/components/PortfolioWorkspace.tsx`           |
| Project titles, photos, stories   | `experience/src/workshop-projects.ts` and `experience/src/cube-project.ts`  |
| Expand/Restore and project reader | `experience/src/Application/UI/components/ProjectReader.tsx`                |
| Colors, spacing and phone layout  | `experience/src/Application/UI/style.css`                                   |
| Floor extension                   | `experience/src/Application/World/Environment.ts`                           |
| Static grain                      | `experience/src/Application/Shaders/screen/fragment.glsl` and `Renderer.ts` |

## Next 48 hours

1. **Robot media and facts.** Send the two robots' photos/videos in ZIPs or small batches. For each filename, a short spoken or written note is enough: what it shows, what failed, what changed, your own contribution, and work that came from teammates or existing designs. I can import, compress and organize the files into the existing galleries. Keep unknown results and exact dates unclaimed.
2. **Your voice.** Dictate each project naturally: what made you start, what you actually built, the frustrating part, what finally helped, what you learned, and what you would change. I will keep your wording and specific choices, tidy repetition/grammar, and align the story with the supplied media. The current story copy is unchanged in this monitor update.
3. **Personal essentials.** Supply the résumé, a short About description and the contact/GitHub/CAD links you want public. The monitor should make these easy to reach. The paper and workspace can point to the same final PDF.
4. **Finish and share.** Check the production deployment's commit and Ready status in Vercel, test the stable URL on an actual phone, and review text, links, video playback and navigation. A custom domain can be connected after the site works at `https://shreethan.vercel.app/`.

Day 1 can focus on importing the robot media and recording the facts. Day 2 can focus on your dictated copy, résumé/contact details and the final phone/public-deployment checks. CAD viewer refinements, the PC case and decorations can follow the first release without holding up a usable portfolio.

## Selection motion

Physical project selection now has three phases: finish the object's lift/mechanism preview, approach it with the camera, then reveal the reader. `World/SelectionMotion.ts` contains the shared 1,100 ms approach and 900 ms return durations. Preview completion uses the actual pose progress rather than a separate fixed delay, so an already-hovered robot does not repeat its preview. The reader waits until the final camera frame has rendered; it no longer covers the camera move. Selection locks prevent a second object from interrupting the sequence.

The cube stays lifted while selected, matching the other projects. Project and résumé readers fade out over 260 ms; a project starts its return camera move after that exit finishes. Reduced-motion preferences skip the pose wait and camera travel. The monitor uses the same approach/return pacing; its inside menus and content are unchanged.

## Keyboard, mouse and silent interface

`experience/src/Application/World/DeskPeripherals.ts` contains the original lightweight presentation geometry: a 75% mechanical board with white keycaps, a black frame, a ridged round dial and navigation/arrow keys; and a black ergonomic gaming mouse with separate curved buttons, a metal scroll wheel, thumb controls and a white rear LED strip. The designs are inspired by the requested Glorious and G502 X styles, rather than manufacturer CAD models. Keycaps and knob grips use instancing; all legends share one canvas atlas. No external model or texture downloads are added.

Move the monitor, keyboard or mouse in `WorkshopLayout.ts`. The monitor is at X=-1850; the keyboard sits at [-1850, -451.9, 700], and the mouse at [-700, -439.9, 650]. The keyboard and mousepad meet the tabletop at Y=-451.9, while the mouse rests on the 12-unit-thick pad. The project models on the right retain their placements. The résumé is farther left on the extended workbench; the new dirtbike is on the floor to the left. Camera fitting includes the new model. These are decorative objects; project and monitor selections retain their existing behavior.

The site no longer starts AudioManager or loads ambient, startup, typing or click recordings. The sound button is removed; the name, clock and free-camera control remain. Original audio source files remain archived in the repository but are excluded from the renderer's copied assets. Project videos retain their own native media controls. The browser title is the plain name, Shreethan Palla.
