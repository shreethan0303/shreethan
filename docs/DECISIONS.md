# Current decisions

## Active checkpoint: empty desk

Build from Henry Heffernan's licensed 3D implementation. The current scene contains only an empty tabletop and four legs, with the original desk dimensions, neutral backdrop, camera and color direction. Computer, decor, chair and plant are temporarily absent. The original assets remain available for adding selected objects back later.

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

A white sectional door has four rows of recessed panels, following the supplied reference. A rounded rectangular card shows Shreethan Palla, Portfolio, Start, and Open without 3D. Each row follows the curved overhead track during the 2.4-second reveal. Reduced-motion skips the opening animation. The desktop route remains available during loading or failure.

The empty desk uses a generated GLB and baked atlas. Its backdrop samples the original texture; only the region containing obsolete prop shadows is cleared and shaded for the bare desk. Regenerate with `blender -b --factory-startup -t 8 --python experience/tools/build-empty-workbench.py`. Blender is an offline authoring tool and is not needed by Vercel.
