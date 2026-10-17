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

Preserve Henry's in-room black bars, monospace typography, typing animations and sound/camera controls. The previous flat replacement was unwanted. Changes to the entrance do not authorize restyling the room interface.

The entrance has four stages: a visible progress ring, a plain introduction with a small pulsing down chevron, a closed garage door with no text, then the room. The editable intro is "Hey, I'm Shreethan Palla. I build robots and software and enjoy learning new things." All intro text has one consistent style and balanced wrapping. There is no card, Enter button or Open without 3D link. The chevron is decorative; scroll/swipe and keyboard navigation still work. Reduced-motion keeps it static.

The circular loader uses “Loading cool projects”, “Loading CAD” and “Loading graphics”. Its displayed arc never leads real asset-count progress. It stays visible for at least 1.1 seconds on fast connections, waits for assets and the first room frame, then fades into the introduction over 320ms. Slow loads wait for actual readiness. Failed loading shows Reload.

The first scroll segment (40%) fades/moves the intro and arrow away to reveal the closed door. A single large first gesture stops there; later scrolling moves the four sections along their overhead track. Reverse scroll restores earlier stages until entry finishes. Page Down/arrow keys advance; End or keyboard Enter can continue directly. There is no Scroll to open text on the garage. Clicking or tapping anywhere on the introduction plays the transition to the closed door; another click/tap opens it. These inputs use the same animation progress as scrolling. The entrance consumes its click before unlocking the room, preventing that click from also approaching the desk. Asset loading cannot be bypassed.

The rotating overview is prepared behind the door. Its clock is not restarted on reveal. Henry's black Click anywhere to begin prompt then types once, with timer cleanup to prevent trailing typing after approach. One click approaches the desk; repeated clicks during travel are ignored. The original name and clock bars type in sequence, followed by the sound/camera controls. Keyboard entry triggers the same sequence. Reduced-motion shows complete text without typing delays. Scene clicks toggle overview/desk as before; résumé clicks remain consumed by the paper. Baked desk lighting, soft shadows, grain and existing models are unchanged.

The entrance and room controls share CSS color variables: white `#ffffff`, off-white `#f5f5f3`, border `#dededb`, charcoal `#272725`, muted text `#71716d`. Existing desk materials and baked room lighting remain intact.

Camera framing uses the bounds of the tabletop and legs, excluding the backdrop. Both overview and close-up look at their center; close-up no longer depends on mouse position. Fit distance accounts for field of view and viewport aspect ratio so the desk stays visible on narrow screens.

The empty desk uses a generated GLB and baked atlas. Its backdrop samples the original texture; only the region containing obsolete prop shadows is cleared and shaded for the bare desk. Regenerate with `blender -b --factory-startup -t 8 --python experience/tools/build-empty-workbench.py`. Blender is an offline authoring tool and is not needed by Vercel.

## Résumé interaction

Paper rests at front-left and lifts/brightens on hover or keyboard focus in the desk view. Click/tap opens a readable HTML sheet with a faint room behind it, a placeholder PDF download, and Back/Escape. The rest of the desktop stays empty. Camera and object placement settings live in `World/WorkshopLayout.ts`; see [the interaction guide](WORKSHOP-INTERACTIONS.md).

## Next PC asset

Use a suitable Corsair 5000T model with an exact Gigabyte GPU to be chosen later, dark shell/interior and red/white RGB. No temporary PC has been inserted. See [the asset/modeling brief](PC-ASSET-BRIEF.md) for references, search leads, named-part workflow and two-day scope. Résumé placeholder content is lorem ipsum only.
