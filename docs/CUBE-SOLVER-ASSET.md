# Your cube-solving robot

The desk now displays the actual assembly you uploaded in `steprubicks cube robt.zip`. Your editable STEP remains outside the repository; the public website receives only `public/models/cube-solver/robot.glb`. A downloadable display mesh necessarily exposes its visible geometry to visitors.

## From CAD to the browser

STEP describes precise CAD surfaces. WebGL draws triangles. An offline OpenCascade conversion tessellates those surfaces, and Blender reduces the resulting mesh before exporting a self-contained GLB. Neither CAD software nor Blender runs in the visitor's browser or Vercel build.

This export preserves 111 mesh parts and named groups for the cube, frame and six motor assemblies. The original conversion produced 763,636 triangles; the display copy has 137,526 triangles and is 3,840,852 bytes. These are asset measurements, not a measured frame rate or phone-performance guarantee. Small internal details are simplified. Source units are retained in meters: the full assembly is about 208 mm across; the cube is 56 mm across.

The cube's existing outer flat CAD faces receive six colored materials. Its actual geometry stays intact, with dark plastic around the colored faces. Opposite pairs are white/yellow, red/orange and blue/green. This assumes a solved cube; it does not simulate turning or establish the physical robot's initial state. No CAD recoloring is required. The motor/frame palette comes from the supplied STEP, with matte material adjustments for browser lighting.

## Placement and hovering

Edit `experience/src/Application/World/WorkshopLayout.ts`, under `cubeRobot`:

- `position`: left/right, height, front/back in the reference room's scene units.
- `rotation`: turn around the vertical axis, in radians.
- `width`: size reference before tilting, in those scene units.
- `lift`: distance it rises when hovered or keyboard focused.

The model is normalized to rest on its lowest point, then scaled and positioned on the tabletop. Its meter-based dimensions do not match this room's much larger scene units automatically.

`World/CubeRobot.ts` loads the GLB without replacing its materials. A pointer ray is tested against the robot's actual meshes. On a hit, the model eases up slightly, brightens, and shows its name. Tab focus uses the same feedback; a tap selects it. A robot click is consumed before the room's generic click-to-return camera handler. The résumé reader locks robot interactions while open.

The first checkpoint added the model and hover. The rounded project reader is now implemented below; actual video, URLs, detailed project content and exploded animation remain to be supplied or authored. Existing named groups provide a starting point for authored separation directions; an exploded animation is not yet implemented for this model.

## Recreate or revise the export

Offline tools used: Python 3, cadquery-ocp (installed with CadQuery 2.7.0), Blender 4.3.2.

```bash
python3 experience/tools/convert-cube-step.py "/path/to/steprubicks cube robt.step" public/models/cube-solver/robot.glb
npm run build
```

The companion `robot.json` records geometry counts, dimensions, coloring checks and groups. The preparation script is specific to this assembly: it validates the expected cube components and 56 mm extent rather than guessing silently on a different export. A revised CAD structure may need updated part identification. Cube colors live in `experience/tools/prepare-cube-model.py`; change them there and reconvert.

Source: supplied by Shreethan Palla for his portfolio. No third-party robot model was substituted. Original STEP SHA-256: `eb0406785c2fb07e3c5c83175ac89d80a86f2f53c5fac20c277c89f397954ef7`.

## Project panel and three-point resting pose

The display scale is now 85% of the original (width setting 1147.5 versus 1350). A measured support plane touches vertices on three different motor ends. Its orientation lowers the assembly, and the runtime uses the tilted mesh's actual vertices to put its lowest point on the tabletop. Rotating a bounding box instead can leave an artificial gap, because its corners are not necessarily actual surfaces. Three small contact shadows supplement the soft base shadow. The hover still lifts deliberately; the resting pose touches the tabletop.

The support direction was found with an offline convex-hull calculation across the actual display geometry. This checks a flat geometric support plane; it does not simulate weight distribution, flexibility or physical stability. To recalculate after changing the model, with NumPy and SciPy installed:

```bash
python3 experience/tools/find-robot-support.py public/models/cube-solver/robot.glb
```

That prints a quaternion and three source-space contact points. The current values live in `WorkshopLayout.ts` as `restQuaternion` and `contactPoints`. The runtime normalizes the quaternion and grounds the actual geometry after applying it. A new export may require recalculating those values.

Click/tap or keyboard Enter now opens a rounded project card while the camera smoothly approaches the model. The room remains faintly visible behind it. Close, Escape or a backdrop click returns to the authored desk view and restores keyboard focus. The project reader traps keyboard focus and prevents background camera/object actions while open. Reduced-motion makes the transition immediate.

### Edit it yourself

For the content, edit `experience/src/cube-project.ts` in GitHub or your editor. It contains the name, displayed date, brief, placeholder paragraph, video source and CAD/GitHub links. Replace the lorem ipsum with your project story. Give `videoUrl` a direct MP4/WebM URL or a path such as `/videos/cube-solver.mp4`, with the file in `public/videos/`. It is not a YouTube embed field. Set `cadUrl` to your public Onshape document and `githubUrl` to your project repository. Until those arrive, the card shows honest, non-clickable placeholders.

The date is provisionally “Around March 2025”: the user recalled March in ninth grade, and a junior in the current 2026–27 school year would have been a freshman in 2024–25. No regional science-fair calendar was verified. Adjust this field if the school-year assumption is different.

For placement, edit only these values under `cubeRobot` in `WorkshopLayout.ts`:

- Move left/right: change the **first** number in `position`. More negative is left.
- Move toward/away from the front edge: change the **third** number. Larger is toward the front.
- Turn it on the tabletop: change `rotation`. This is yaw only, so it preserves the three-point contact pose. About `0.17` radians equals 10 degrees.
- Resize: change `width`. Keep the second position number at `-451.9`, the tabletop height, so the grounding calculation continues to rest the model there.

Save, rebuild with `npm run build`, then refresh your local preview. A GitHub commit/push triggers the connected Vercel build. Check the newest deployment rather than an older fixed preview URL.

## Build-story timeline and media handoff

The reader now has one vertical scroll with chapter links: one-axis testing, five-axis testing, alignment issues, six-axis testing, first solves and final prototype. The proposed order comes from the user's description and can be rearranged after reviewing the files. Reflections cover personal contribution, lessons, inspiration and future work. Missing notes and media remain explicit placeholders; no engineering results, fixes, skills or authorship claims are inferred from filenames.

`experience/src/project-story.ts` defines the reusable data format. `ProjectStory.tsx` renders it, so another project can use the same layout. Under `story` in `cube-project.ts`, each chapter accepts a `summary`, optional `challenge`, `change`, `learning`, and a `media` array. Each media item has `type` (`image` or `video`), `src`, `caption`, and optional `poster`. Reorder entries to change chronology. The `reflections` array holds the final narrative.

A chapter gallery displays one media item at a time, with previous/next controls and a caption. Video preload is `none`, autoplay is off, and switching items or closing the reader pauses its player. Images use lazy loading. The intro's optional final demonstration is separate from chapter clips. The header/close button remains visible while the story scrolls. There are no nested vertical scrolling galleries.

### Send source files

This cloud workspace cannot read a Windows Downloads folder from an Explorer screenshot. It can process uploaded attachments or accessible download links. The current attachment download tool has a 32 MiB per-file limit. Keep ZIP batches below 25 MB, or upload the individual smaller clips/images. Combining compressed phone videos into a ZIP generally saves little space. A view/download link to a OneDrive folder accessible without signing in is another option; the link must be checked for actual download access from the workspace.

Keep original filenames and originals. Send files first; a short note about a clip's stage is helpful, but not required for transfer. After review, identify chronology, the observed problem, the actual fix, what was learned, which work was original and any sources used. Screenshots' Download/Date modified timestamps do not establish the original project dates.

Before publishing, make smaller display copies: browser-compatible MP4 video, appropriately sized images and poster thumbnails. Put only selected web assets in `public/projects/cube-solver/`, using descriptive filenames and captions. Do not put the raw archive into the runtime loading list. Visitors should download a clip when they choose to play it, not during the garage intro.

## Received recordings

Five actual clips and the connector photo are now imported, with captions and a story drafted from the user’s explanations. The original five-axis placeholder has been replaced by the confirmed two-axis test with all six axes connected. The first-solve clip appears in the overview as well as its timeline stage. See [media provenance, conversion and remaining files](CUBE-MEDIA.md). The remaining single-axis and frame-assembly assets could not be transferred in the oversized ZIP.
