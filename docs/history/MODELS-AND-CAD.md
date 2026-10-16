# Choosing and importing workshop models

## What is already built

The room, garage door, workbench, cream monitor, PC tower, keyboard, racket pair, bike blockout, cube-solver blockout and robot blockouts are original procedural geometry. No third-party models or Henry Heffernan source have been copied into the application. The monitor entry label uses Drei Html. When opened, the desktop is a responsive HTML overlay while the camera approaches the monitor; it is not a separate iframe deployment. This keeps controls sharp and avoids transformed-DOM hit-testing issues.

The full-scale robot and bike indicate composition only. They are not accurate replicas or evidence of a particular real build. Replace them with verified project geometry before describing them as accurate.

## Places to choose assets

- Kenney Furniture Kit: https://kenney.nl/assets/furniture-kit — stylized furniture reference; check the pack contents and license before using.
- Poly Haven models: https://polyhaven.com/models — source of CC0 models; check the selected model and download size.
- Sketchfab model search: https://sketchfab.com/search?type=models&q=workbench&features=downloadable — downloadable workbench/model candidates. Downloadable does not automatically mean freely reusable: inspect the individual license, attribution, commercial-use conditions, and third-party branding.
- Quaternius: https://quaternius.com/ — low-poly asset packs; check each selected pack’s license and available formats.

These pages were blocked by the environment network during research; no individual model, license or availability has been verified live. Do not claim any particular asset is downloaded or included. Pick coherent visual styles; a detailed photoreal bike beside abstract toy furniture will look inconsistent. We can use the procedural workbench indefinitely if it fits the composition.

## What to send

1. One or more robot photos plus approximate overall width/length/height, and the relevant Onshape assembly/export. Explain your own contribution to the team robot.
2. RC car and cube robot photos or CAD files.
3. Dirt-bike model/year or a representative photo; it can remain a simple prop initially.
4. Any preferred model’s source link and license, if you find one you like.

Never supply private team CAD without permission. Avoid exporting unrelated project files or credentials. A photo is enough to refine a placeholder while CAD is being prepared.

## CAD path

- In Onshape, isolate the assembly intended for public display and hide unnecessary internals, fasteners and tiny details.
- Inspect the export options offered for that document. Prefer glTF/GLB when supported, with individual parts retained if an exploded view is required.
- If the export produces glTF plus .bin/textures, keep the folder together or convert to a single GLB. Converting must preserve texture references.
- STEP is an accurate interchange format but needs tessellation before Three.js can render it. Convert with a CAD-capable tool such as FreeCAD, then export a mesh format and prepare a GLB. Blender alone does not natively solve every STEP import workflow.
- STL can be displayed after conversion, but normally lacks materials and useful assembly hierarchy. Export separate components if all you have is STL and you need an exploded view.
- Use meters in the scene. Check imported bounding box, up axis, part names, normals, and material count. Optimize a public copy and keep the original source separately.

## Integration

Public GLB files belong in public/models/ and are loaded by URL such as /models/frc-robot.glb. CAD source files do not belong in that public folder. Add a small model component using Drei useGLTF inside the existing Suspense boundary, replacing the relevant procedural group in app/components/garage.tsx. Set position, rotation and uniform scale there; do not rescale individual parts destructively. Dispose or cache resources appropriately and verify missing-model fallback.

Before importing any file, record its source, license, author, attribution text, original filename, optimized filename and modifications here or in a dedicated asset manifest. Do not publish a model just because it was easy to download.

Measure geometry count, materials and transferred bytes after optimization. Aim initially for a modest total scene download (roughly 5–10 MB as a planning target, not a measured result). Defer detailed project models until selected. Preserve checksums/signatures when a provider supplies them.

## Current interactions

- Open garage or Skip intro → door rises and camera settles into overview.
- Open computer → camera moves toward the physical monitor.
- Projects inside the computer → camera returns to overview and project labels highlight.
- Scene labels and normal project cards → direct project URLs.
- About / Contact → readable desktop window.
- Shutdown / Power on → monitor interface off/on.
- Turn 3D off → normal project list remains available.

Full custom project content, résumé, real model imports, domain connection and deployment are still outstanding. No actual FRC team achievements, research claims, school details or contact email have been invented.

## Ready-to-use slots

Edit app/data/model-sources.ts after placing an approved optimized GLB under public/models. Set frc, rc or cube to its public URL, for example /models/cube-solver.glb. Null retains the existing placeholder. The loader preserves the imported materials, recenters the model, fits it to the slot size, and places its base at the slot origin. Slow or failed model loads retain the placeholder. Do not overwrite imported materials globally: that discards Onshape colors. Verify orientation and part appearance on one model before processing the whole collection.

Onshape appearance is best carried by a format that supports materials (glTF/GLB when available). STL does not preserve appearance. STEP appearance support depends on the export/converter path; do not assume it survives. Send a colored reference screenshot alongside the export. If necessary, map named parts to user-supplied color swatches after conversion. CAD appearance is not a substitute for realistic roughness, metalness and lighting. Official Onshape help was network-blocked during this research, so the exact export options for the user’s document must be checked in their UI.

Latest scene scope: seamless white studio, modern workbench and monitor, black PC with red/white lights. Bike deferred. FRC/cube/RC slots remain illustrative until actual project files are supplied. Ready-made furniture can be selected later, but no individual downloadable bike or workbench model has been verified or imported.
