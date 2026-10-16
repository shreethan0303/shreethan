# Corsair 5000T PC: find or build the right asset

The PC is deferred until a suitable model is selected. Do not fill the approved scene with an arbitrary case. The requested direction is a Corsair 5000T, a Gigabyte graphics card, a dark interior and red/white RGB. Gigabyte is a manufacturer, so choose the exact card model or a reference photo before detailing its visible shape.

## Visual direction and layout

Keep the room and UI in the existing white/off-white/charcoal palette. The PC is a physical object with a charcoal-black shell, smoked glass, and restrained red/white lighting. Starting material swatches: shell `#18191b`, red light `#d93632`, soft white light `#f5f5f0`. These are initial visual targets, not assertions about the real product's factory finish.

Place the tower at the back-right of the tabletop, with its window facing the visitor; leave the résumé at front-left and the center available for a monitor. Confirm that view in a screenshot before modeling small details. No PC geometry or new lights have been added yet.

## Path A: find an existing model

Set a 30–60 minute search limit for the first pass. Try these terms:

- `Corsair 5000T 3D model GLB`
- `Corsair iCUE 5000T CAD STEP`
- The exact Gigabyte card model followed by `3D model` or `STEP`.

Places to look: [Sketchfab](https://sketchfab.com/search?type=models&q=Corsair%205000T), [GrabCAD](https://grabcad.com/library?query=Corsair%205000T), [CGTrader](https://www.cgtrader.com/3d-models?keywords=corsair%205000t), and Corsair's official product/download pages. These are search leads, not verified downloadable 5000T assets. No suitable exact-case model has been selected in this task.

Before committing to a model, check:

1. You can download actual geometry, not just preview renders, and its license permits this public website use. Retain required attribution.
2. It is the 5000T variant you want. Compare the outline, front panel, glass and light-strip locations with official photos.
3. Its parts are separable enough to edit: shell, glass, fans, GPU and light strips should be identifiable.
4. Its size is practical for the web. Ask for a mesh/triangle count and texture sizes if the listing only shows a file size. A mechanical CAD assembly containing every fastener needs a simplified display copy.

Source the case and GPU separately, then assemble them in Blender with your own light-strip materials. This keeps each component replaceable.

Prefer a plain GLB. For a glTF export, keep the `.gltf`, `.bin` and textures together. STEP needs a CAD-capable tessellation/conversion tool before it becomes a browser mesh; standard Blender does not directly open STEP. Verify names, colors and dimensions after conversion. Exporters and converters differ, so do a small trial before committing to a detailed asset.

## Path B: author the exterior in Onshape

Use the actual Corsair product photos and technical dimensions as the engineering reference. Verify the manufacturer's width/depth/height for the chosen variant; do not infer dimensions from a perspective photo.

First build a block-out with the correct overall proportions, a window panel and the front silhouette. Share front, side and isometric views before detailing it. Then add only the visible parts that establish the PC's identity:

- `case_shell`: exterior frame and distinctive panels.
- `side_glass`: a separate thin panel for an independently adjustable material.
- `fan_front_01`, etc.: simple recognizable fan housings/blades matching the reference.
- `gpu`: the visible card body, with a separate logo/detail surface if useful.
- `led_red` and `led_white`: separate strip/diffuser bodies.
- `feet`: simple visible supports.

Use a named assembly with consistent units and origin. Keep moving/customizable pieces separate. Avoid modeling threads, hidden PSU internals and tiny cable connectors for the first web export. A millimeter-sized detail often occupies less than one screen pixel in the workshop view.

Onshape is for shape, dimensions and assembly. Blender is useful for mesh cleanup, roughness, transparency, UVs, baking and GLB packaging. In the website, red geometry does not automatically emit light: an emissive material makes a surface appear lit; lighting neighboring surfaces or casting shadows requires an additional lighting strategy. We can choose that after the actual asset is in the scene.

Provide the export, an assembled screenshot, real dimensions, which side is front/up and a parts list. Keep the editable engineering document; publish an optimized display copy.

## What we can reuse from other work

The following implementation patterns were inspected, rather than assuming they exist from screenshots:

- [Henry Heffernan's BakedModel](https://github.com/henryjeff/portfolio-website/blob/c53c5a50183655eb83d70048403a5084f5d1214c/src/Application/Utils/BakedModel.ts): one baked texture supplies the authored room's shading through a basic material. This is already the room's foundation. Keep it for the static room; preserve the PC's individual materials so its glass and RGB remain customizable.
- [Bruno Simon's object parser](https://github.com/brunosimon/folio-2019/blob/master/src/javascript/World/Objects.js): mesh names are used to select materials and processing. Borrow the convention of meaningful part names; it lets code find and recolor `side_glass` or `led_red` directly.
- [Bruno's resource manifest](https://github.com/brunosimon/folio-2019/blob/master/src/javascript/Resources.js): models, material textures and floor-shadow images are separate resources. Borrow the separation of geometry, appearance and scene placement.
- [glTF Transform CLI](https://github.com/donmccurdy/glTF-Transform/tree/main/packages/cli): provides inspection, texture resizing and geometry compression tools. Start with a working uncompressed GLB. Draco, Meshopt and KTX2 outputs need corresponding loader support; do not introduce compression or hierarchy-altering optimization blindly before the model renders correctly.

The live Onshape help, model-viewer editor and glTF Transform documentation sites were blocked from this cloud instance. The linked repository code/CLI documentation above was readable. Asset-library search results and an exact 5000T download have not been verified.

## Two-day scope

First day: choose/reference the exact case and GPU; find or block out one model; gather the final résumé/contact/project content; keep the existing interaction design stable. Review the PC silhouette at its actual desk size before adding detail.

Second day: integrate the prepared asset, tune its materials and placement, verify phones/keyboard/loading, replace approved content and check the actual Vercel deployment. A full hardware-accurate PC interior is a later iteration. Keep the first release focused on the résumé and project stories rather than adding multiple new interaction systems.
