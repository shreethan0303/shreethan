# Current decisions

## Active checkpoint: first interactive desk object

Build from Henry Heffernan's licensed 3D implementation. The current scene contains a tabletop, four legs and a lined résumé sheet, with the original desk dimensions, neutral backdrop, camera and color direction. Computer, decor, chair and plant are temporarily absent. The original assets remain available for adding selected objects back later.

Replace personal metadata and iframe content immediately, remove upstream analytics and email destinations, retain copyright. Reference branding baked into textures remains visibly upstream until those assets are replaced; do not call the baseline a finished personal site.

## Intended final direction

An empty, seamless white/cream studio with no visible wall edges or decorative page header. A workbench, computer and project objects are the focus. A full FRC robot sits beside the bench. Black PC, restrained white/red lighting. Rackets represent tennis. Bike/car are deferred.

Entrance: text directly on a garage door; scroll the text away, then reveal the already prepared rotating desk view. Approach the monitor smoothly. Projects returns to physical project objects; select an object to open a readable case study. Paper reveals résumé access. Essential content is also reachable as normal pages. A proposed Onshape-inspired monitor interface is described in [the content/interface guide](CONTENT-AND-INTERFACE.md); it is not implemented yet.

## Ordered changes

1. Accept reference rendering and camera/screenshots.
2. Replace only the loading/entrance with the garage-door sequence.
3. Replace desk/computer assets while preserving camera and screen integration.
4. Add one real project CAD and hover/detail/exploded-view interaction.
5. Add remaining verified content, profile/printable résumé and contact.
6. Validate responsiveness, fallback and performance; deploy a public preview.

No simultaneous redesign of all six steps. No claims of real robot accuracy without supplied CAD/photos. No games or vehicle-model search before core projects work.

## Garage entrance implemented

A flat white/off-white sectional door uses four sections with thin seams and no decorative recesses, gradients or shadows. The intro is one uniformly styled sentence: "Hey, I'm Shreethan Palla and I build robots and software and enjoy learning new things." Edit it in `experience/src/portfolio-copy.ts`. There is no card, Enter button or Open without 3D link. The first 30% of scroll moves/fades the sentence away; the remaining 70% opens the door. Reverse scroll restores earlier stages until entry completes. Page Down/arrow keys advance; End or keyboard Enter continues directly.

The circular loading indicator fills from real completed-asset progress and uses “Loading cool projects”, “Loading CAD” and “Loading graphics”. It waits for assets and the first rendered room frame, with no forced delay. The rotating overview is prepared behind the closed door, so opening reveals that view without a second distant-camera approach. Asset failure shows an error and Reload button. Reduced-motion skips entry animation. The transparent renderer and page use a neutral base instead of black so uncovered backdrop edges do not expose black corners. Baked desk lighting, shadows and grain remain unchanged.

The entrance and room controls share CSS color variables: white `#ffffff`, off-white `#f5f5f3`, border `#dededb`, charcoal `#272725`, muted text `#71716d`. Existing desk materials and baked room lighting remain intact.

Camera framing uses the bounds of the tabletop and legs, excluding the backdrop. Both overview and close-up look at their center; close-up no longer depends on mouse position. Fit distance accounts for field of view and viewport aspect ratio so the desk stays visible on narrow screens.

The empty desk uses a generated GLB and baked atlas. Its backdrop samples the original texture; only the region containing obsolete prop shadows is cleared and shaded for the bare desk. Regenerate with `blender -b --factory-startup -t 8 --python experience/tools/build-empty-workbench.py`. Blender is an offline authoring tool and is not needed by Vercel.

## Résumé interaction

Paper rests at front-left and lifts/brightens on hover or keyboard focus in the desk view. Click/tap opens a readable HTML sheet with a faint room behind it, a placeholder PDF download, and Back/Escape. The rest of the desktop stays empty. Camera and object placement settings live in `World/WorkshopLayout.ts`; see [the interaction guide](WORKSHOP-INTERACTIONS.md).

## Next PC asset

Use a suitable Corsair 5000T model with an exact Gigabyte GPU to be chosen later, dark shell/interior and red/white RGB. No temporary PC has been inserted. See [the asset/modeling brief](PC-ASSET-BRIEF.md) for references, search leads, named-part workflow and two-day scope. Résumé placeholder content is lorem ipsum only.
