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
- `width`: overall display width in those scene units.
- `lift`: distance it rises when hovered or keyboard focused.

The model is normalized to rest on its lowest point, then scaled and positioned on the tabletop. Its meter-based dimensions do not match this room's much larger scene units automatically.

`World/CubeRobot.ts` loads the GLB without replacing its materials. A pointer ray is tested against the robot's actual meshes. On a hit, the model eases up slightly, brightens, and shows its name. Tab focus uses the same feedback; a tap selects it. A robot click is consumed before the room's generic click-to-return camera handler. The résumé reader locks robot interactions while open.

This checkpoint adds the model and hover only. Video, GitHub link, project description, detail panel and exploded animation follow after you supply the content and approve the presentation. Existing named groups provide a starting point for authored separation directions; an exploded animation is not yet implemented for this model.

## Recreate or revise the export

Offline tools used: Python 3, cadquery-ocp (installed with CadQuery 2.7.0), Blender 4.3.2.

```bash
python3 experience/tools/convert-cube-step.py "/path/to/steprubicks cube robt.step" public/models/cube-solver/robot.glb
npm run build
```

The companion `robot.json` records geometry counts, dimensions, coloring checks and groups. The preparation script is specific to this assembly: it validates the expected cube components and 56 mm extent rather than guessing silently on a different export. A revised CAD structure may need updated part identification. Cube colors live in `experience/tools/prepare-cube-model.py`; change them there and reconvert.

Source: supplied by Shreethan Palla for his portfolio. No third-party robot model was substituted. Original STEP SHA-256: `eb0406785c2fb07e3c5c83175ac89d80a86f2f53c5fac20c277c89f397954ef7`.
