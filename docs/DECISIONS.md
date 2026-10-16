# Current decisions

## Active checkpoint: reference baseline

Start from Henry Heffernan's licensed 3D implementation. Preserve the original environment, desk/computer meshes, baked textures, screen layers, camera states and loading behavior before introducing replacements. It is intentionally not yet the modern workbench scene.

Replace personal metadata and iframe content immediately, remove upstream analytics and email destinations, retain copyright. Reference branding baked into textures remains visibly upstream until those assets are replaced; do not call the baseline a finished personal site.

## Intended final direction

An empty, seamless white/cream studio with no visible wall edges or decorative page header. A workbench, computer and project objects are the focus. A full FRC robot sits beside the bench. Black PC, restrained white/red lighting. Rackets represent tennis. Bike/car are deferred.

Entrance: garage door and centered Start card; open and pan once to overview. Approach the monitor smoothly. Projects returns to physical project objects; select an object to open a readable case study. Paper reveals résumé access. Essential content is also reachable as normal pages.

## Ordered changes

1. Accept reference rendering and camera/screenshots.
2. Replace only the loading/entrance with the garage-door sequence.
3. Replace desk/computer assets while preserving camera and screen integration.
4. Add one real project CAD and hover/detail/exploded-view interaction.
5. Add remaining verified content, profile/printable résumé and contact.
6. Validate responsiveness, fallback and performance; deploy a public preview.

No simultaneous redesign of all six steps. No claims of real robot accuracy without supplied CAD/photos. No games or vehicle-model search before core projects work.

## Garage entrance implemented

The reference room is now revealed by a lightweight white sectional-door overlay. Its centered nameplate shows actual asset-loading progress, Start, Skip intro and a direct desktop link. Start lifts the door in 1.7 seconds while the existing room camera glides for 2.5 seconds. Skip/reduced-motion snap the camera to the overview. Model load errors show the direct content route. Physical door tracks and panel bending are not simulated. The rest of the reference scene remains the next asset-replacement checkpoint.
