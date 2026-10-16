# Current decisions

## Active checkpoint: first interactive desk object

Build from Henry Heffernan's licensed 3D implementation. The current scene contains a tabletop, four legs and a lined résumé sheet, with the original desk dimensions, neutral backdrop, camera and color direction. Computer, decor, chair and plant are temporarily absent. The original assets remain available for adding selected objects back later.

Replace personal metadata and iframe content immediately, remove upstream analytics and email destinations, retain copyright. Reference branding baked into textures remains visibly upstream until those assets are replaced; do not call the baseline a finished personal site.

## Intended final direction

An empty, seamless white/cream studio with no visible wall edges or decorative page header. A workbench, computer and project objects are the focus. A full FRC robot sits beside the bench. Black PC, restrained white/red lighting. Rackets represent tennis. Bike/car are deferred.

Entrance: plain introduction; scroll to the closed garage door, then scroll to reveal the already prepared rotating desk view. Approach the monitor smoothly. Projects returns to physical project objects; select an object to open a readable case study. Paper reveals résumé access. Essential content is also reachable as normal pages. The Onshape-inspired monitor direction, including a timeline of real build iterations, is accepted for the next phase after the entrance and desk flow are stable. The interface is described in [the content/interface guide](CONTENT-AND-INTERFACE.md); it is not implemented yet.

## Ordered changes

1. Accept reference rendering and camera/screenshots.
2. Replace only the loading/entrance with the garage-door sequence.
3. Replace desk/computer assets while preserving camera and screen integration.
4. Add one real project CAD and hover/detail/exploded-view interaction.
5. Add remaining verified content, profile/printable résumé and contact.
6. Validate responsiveness, fallback and performance; deploy a public preview.

No simultaneous redesign of all six steps. No claims of real robot accuracy without supplied CAD/photos. No games or vehicle-model search before core projects work.

## Garage entrance implemented

The entrance has four distinct stages: a visible progress ring, a plain text introduction, the closed garage door, and the rotating room. Its editable introduction is "Hey, I'm Shreethan Palla. I build robots and software and enjoy learning new things." All text uses one consistent style with balanced wrapping. The introduction has no visible door or scroll hint. There is no card, Enter button or Open without 3D link.

The circular loader uses “Loading cool projects”, “Loading CAD” and “Loading graphics”. Its displayed arc never leads real asset-count progress. It stays visible for at least 1.1 seconds on fast connections, waits for assets and the first room frame, then fades into the introduction over 320ms. Slow loads wait for actual readiness. Failed loading shows Reload.

The first scroll segment (40%) fades/moves the introduction away and reveals the closed door. A small Scroll to open prompt sits exactly in its center. A single large first gesture stops at the closed door; subsequent scrolling moves the four sections along their overhead track. Reverse scroll restores earlier stages until entry finishes. Page Down/arrow keys advance; End or keyboard Enter can continue directly. Reduced-motion removes the fades, text motion and animated door travel.

The rotating overview is prepared behind the closed door. Its clock is not restarted on reveal, preventing a camera-orbit jump. The room shows one complete Click anywhere to begin prompt immediately, without typing delays or synthetic keyboard events. One click approaches the desk; further clicks during travel are ignored. Name, live clock and controls appear together on arrival. Empty desk clicks do not reverse the camera; Back to room is explicit. Baked desk lighting, soft shadows and grain remain unchanged; the neutral base prevents uncovered edges from exposing a black background.

The entrance and room controls share CSS color variables: white `#ffffff`, off-white `#f5f5f3`, border `#dededb`, charcoal `#272725`, muted text `#71716d`. Existing desk materials and baked room lighting remain intact.

Camera framing uses the bounds of the tabletop and legs, excluding the backdrop. Both overview and close-up look at their center; close-up no longer depends on mouse position. Fit distance accounts for field of view and viewport aspect ratio so the desk stays visible on narrow screens.

The empty desk uses a generated GLB and baked atlas. Its backdrop samples the original texture; only the region containing obsolete prop shadows is cleared and shaded for the bare desk. Regenerate with `blender -b --factory-startup -t 8 --python experience/tools/build-empty-workbench.py`. Blender is an offline authoring tool and is not needed by Vercel.

## Résumé interaction

Paper rests at front-left and lifts/brightens on hover or keyboard focus in the desk view. Click/tap opens a readable HTML sheet with a faint room behind it, a placeholder PDF download, and Back/Escape. The rest of the desktop stays empty. Camera and object placement settings live in `World/WorkshopLayout.ts`; see [the interaction guide](WORKSHOP-INTERACTIONS.md).

## Next PC asset

Use a suitable Corsair 5000T model with an exact Gigabyte GPU to be chosen later, dark shell/interior and red/white RGB. No temporary PC has been inserted. See [the asset/modeling brief](PC-ASSET-BRIEF.md) for references, search leads, named-part workflow and two-day scope. Résumé placeholder content is lorem ipsum only.
