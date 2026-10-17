# Your FRC robot and RC car

Your two supplied FRC assemblies are displayed beside the desk, and the RC car is on it. The cube robot and résumé remain in place. The camera frames the whole workshop so the floor robot is discoverable. Hover highlights and gently lifts a model; click or tap opens its project reader and frames the selected model. Keyboard users can Tab to each project and press Enter. Close or Escape returns to the workshop.

The new cards show actual CAD previews and provisional copy. Photos, testing videos, season, dates, your contribution and external links are pending. No speed claim is inferred from the driveshaft filename. The custom driveshaft is downloadable as a GLB in the RC card.

## Exporting the next model

1. Open the final top-level assembly in Onshape. Check that intended parts, wheel instances and configurations are present.
2. Export as STEP AP242, preserving part appearances where available. ZIP a large STEP before sharing. Your current exports worked; no replacement is needed.
3. Alternatively, send a GLB, or the complete glTF folder with its `.bin` and textures. A lone glTF may refer to missing files. STL generally loses colors and assembly structure.
4. Keep the original CAD yourself. We make a lighter display copy for the browser rather than putting the engineering STEP into the initial page download.

You can set appearances in Onshape, or adjust materials in the display model later. These copies preserve colored parts and use restrained metal and rubber finishes. Changes to the web copy do not change your CAD.

## Position and content

Edit `experience/src/Application/World/WorkshopLayout.ts`:

- `position`: `[left/right, height, front/back]`. Positive Z points toward the front of the desk.
- `rotation`: angle around the vertical axis, in radians.
- `length`: maximum unrotated horizontal dimension in scene units. It controls display size independently of the original engineering scale.
- `elevatorRobot`: the second FRC robot, imported from `Top Level Assembly.step`.
- `lift`: the small hover displacement in scene units. The shadows stay on the surface.
- `motions`: names of movable model groups, a local axis and an angle or distance.

The tabletop is approximately Y = -451.9 and the room floor is Y = -2984.19. The FRC export has a small protrusion below the four drive tires. `groundOffset` aligns the actual tire plane with the floor; the retained protrusion is hidden by the opaque floor. Contact shadows make wheel contact readable. This is display placement, not validation of the robot's mechanical clearances.

The RC export contains **three tires**, which differs from the requested four-wheel pose. The display preserves that assembly. A measured support plane puts all three tires on the table without floating or pushing the remaining geometry below it. A matching fourth wheel can be added after you confirm the configuration. No wheel was silently duplicated.

Edit `experience/src/workshop-projects.ts` for titles, dates, video URLs, CAD/GitHub links, chapters and reflections. `ProjectReader.tsx` is the shared interface; `WorkshopProject.ts` handles selection, highlighting and camera focus. The cube keeps its existing content file. Future projects reuse these pieces.

## What a phone downloads

The intake robot display is about 3.69 MB and 344,239 triangles, the elevator robot is about 2.68 MB and 302,788 triangles, and the car is about 0.74 MB and 68,610 triangles. All use Meshopt compression with a bundled decoder. The FRC meshes are batched by material inside separate mechanism groups, preserving movement while limiting draw calls. Original part names, group membership and conversion counts are retained in adjacent JSON manifests. A fully exploded view still needs finer component groups.

The small downloadable driveshaft stays uncompressed for compatibility with general model viewers. STEP originals are not included in the page download.

## Reproducing the conversion

These are offline tools, not dependencies needed by Vercel. STEP conversion needs `cadquery-ocp`; preparation needs Blender 4.3; the car support calculation needs NumPy and SciPy. Preserve uncompressed intermediates outside the repository.

```bash
python3 experience/tools/export-step-gltf.py source.step /tmp/raw.glb
blender -b --factory-startup --python experience/tools/prepare-workshop-model.py -- /tmp/raw.glb /tmp/prepared.glb frc
```

Use `rc` or `driveshaft` as the last argument for those assemblies. Preparation corrects this export's up axis, reduces detail per part, normalizes placement and batches the static mesh by material. It saves `/tmp/<kind>-prepared.blend`. These orientation and material rules are specific to the supplied files; inspect a different export before reusing them.

For this three-tire car, before compression:

```bash
python3 experience/tools/find-car-support.py /tmp/prepared.glb
blender -b --factory-startup --python experience/tools/apply-car-support.py -- /tmp/prepared.glb /tmp/prepared.support.json /tmp/rc-prepared.blend
```

Compress FRC/car display copies with glTF Transform 4.5.1 Meshopt at medium level and 16-bit position quantization. Update the adjacent manifest's byte sizes and compression description when replacing an asset. Inspect silhouette, colors and grounding before committing.

## Opening it on a phone

Open **https://shreethan.vercel.app/** in Safari or Chrome. This is the stable production address; old generated deployment URLs remain attached to old commits. The Vercel dashboard URL is for managing the site, not sharing it.

Pushing `main` triggers a build when the connected Vercel Git integration is enabled. Vercel installs dependencies, generates the room and Next.js output, then serves those files over HTTPS. A pushed commit is not proof that deployment finished. Confirm the matching commit is Ready in Vercel and test the production URL on the actual phone.

If visitors are asked to sign in, inspect Project → Settings → Deployment Protection and ensure the intended production deployment is public. Previews may have separate protection. The cloud environment could not check this URL because its network proxy rejected the connection; that does not diagnose the site's access settings.

Local checks covered the production build, real model decoding, project readers, résumé interaction and portrait layout. They do not measure frame rate or memory on a physical phone. Test those before treating mobile performance as verified.

## Hover mechanisms and project dates

The intake has a named `Intake` parent with its pivot placed at the approximate cross-robot hinge. Hover rotates it inward by -0.38 radians (about 22 degrees). The chassis stays fixed relative to the model. Elevator hover translates `ElevatorMiddle` by 0.18 meters and `ElevatorCarriage` by 0.36 meters in their local Z direction; the assembly maps local Z into world up. The carriage group includes the end-effector assembly.

These distances and the intake pivot are authored presentation settings. STEP geometry does not supply executable Onshape joints, and these are not validated stroke limits or a physics simulation. The motion smoothly reverses on leaving the model. Keyboard focus gives the same preview. Opening a project keeps its hover pose and frames the full pose so a moving elevator is not clipped. Closing restores normal interaction. Reduced-motion mode applies the pose immediately rather than easing through it.

`WorkshopProject.applyPose()` applies one eased amount from zero to one to the lift and local mechanism transforms. Chassis parts are outside the mechanism parents, so they do not move with the intake/elevator. The room, entrance and lighting are unchanged.

Cube date: March 2023, corrected by the user to seventh grade in 2022–2023, retaining the previously recalled March science-fair timing. Elevator: 2025 REEFSCAPE, named by the user. RC car: 2023, with a three-month build narrative supplied by the user; exact start/end months are unknown. The intake robot's 2026 season label is inferred from the user's earlier “last season with balls” description and the current October 2026 date.

The articulated FRC conversion uses `experience/tools/prepare-articulated-frc.mjs` after native STEP conversion. Its offline dependencies are glTF Transform 4.5.1 and meshoptimizer; set `CAD_TOOL_MODULES` to their installed node_modules directory. It preserves the named motion parents, batches their children and applies Meshopt compression. For the intake's final detail budget, `reduce-articulated-frc.py` applies a 0.43 Blender decimation ratio to the batched uncompressed copy while retaining its hierarchy, followed by Meshopt medium compression and 16-bit positions. Update the manifest after that optional reduction. The old static conversion is retained for the car and driveshaft.

Picking uses both the current and resting pose so that a hover animation cannot move a part away from its original click/tap target. For the isolated Three.js r137 renderer, normalized compressed positions are expanded to float positions once after loading: its older CPU raycaster otherwise reads raw integer values even though WebGL displays normalized coordinates. This leaves the rendered surface unchanged and keeps network transfer compressed. Normals remain in their original GPU-friendly representation.
