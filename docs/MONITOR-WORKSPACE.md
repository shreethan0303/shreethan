# Monitor workspace and the next steps

The monitor is centered on the desk. The paper sits left, the cube solver sits front-right, and the car sits farther right. Their horizontal bounds fit inside the tabletop without intersecting one another. The FRC robots remain on the floor.

Select the monitor to zoom toward its screen and open the portfolio workspace. A project tree, a central preview and bottom section tabs borrow the organization of the supplied Onshape screenshot. The working controls are Projects, About, Résumé, Read project and Back to desk. Project cards share the existing media and build stories. Closing a card returns to the workspace; closing the workspace returns to the desk. Keyboard focus follows those actions, and Escape closes the current layer.

The current workspace uses the existing approved intro and verified project data. Résumé content is still the same placeholder. Contact details, team contributions and polished personal stories remain pending. The computer case and extra decorations remain later additions.

See the [current desk arrangement](images/monitor-workshop.png) and [workspace preview](images/cad-workspace.png).

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
