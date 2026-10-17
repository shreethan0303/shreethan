# Your FRC robot and RC car

Your supplied STEP assemblies are displayed beside the desk (FRC) and on it (RC). The cube robot and résumé remain in place. The camera frames the whole workshop so the floor robot is discoverable. Hover highlights a model; click or tap opens its project reader and frames the selected model. Keyboard users can Tab to each project and press Enter. Close or Escape returns to the workshop.

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
- `nextFrcRobot`: a reserved location only; nothing renders there yet. Frame the camera again after adding that model.

The tabletop is approximately Y = -451.9 and the room floor is Y = -2984.19. The FRC export has a small protrusion below the four drive tires. `groundOffset` aligns the actual tire plane with the floor; the retained protrusion is hidden by the opaque floor. Contact shadows make wheel contact readable. This is display placement, not validation of the robot's mechanical clearances.

The RC export contains **three tires**, which differs from the requested four-wheel pose. The display preserves that assembly. A measured support plane puts all three tires on the table without floating or pushing the remaining geometry below it. A matching fourth wheel can be added after you confirm the configuration. No wheel was silently duplicated.

Edit `experience/src/workshop-projects.ts` for titles, dates, video URLs, CAD/GitHub links, chapters and reflections. `ProjectReader.tsx` is the shared interface; `WorkshopProject.ts` handles selection, highlighting and camera focus. The cube keeps its existing content file. Future projects reuse these pieces.

## What a phone downloads

The FRC display is about 3.45 MB and 351,410 triangles; the car is about 0.74 MB and 68,610 triangles. Both use Meshopt compression with a bundled decoder. They are static meshes batched by material, reducing draw calls. Original part names and conversion counts are retained in neighboring JSON manifests. Individual part motion or exploded views require an export that preserves movable groups.

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
