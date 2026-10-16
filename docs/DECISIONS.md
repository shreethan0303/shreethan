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

A flat white/off-white sectional door uses four sections with thin seams and no decorative recesses, gradients or shadows. A rounded rectangular card shows only Shreethan Palla, Start and Open without 3D. Each section follows the curved overhead track during the 2.4-second reveal. The room overlay keeps the name and live local clock, without a role subtitle. Reduced-motion skips the opening animation.

The entrance and room controls share CSS color variables: white `#ffffff`, off-white `#f5f5f3`, border `#dededb`, charcoal `#272725`, muted text `#71716d`. Existing desk materials and baked room lighting remain intact.

Camera framing uses the bounds of the tabletop and legs, excluding the backdrop. Both overview and close-up look at their center; close-up no longer depends on mouse position. Fit distance accounts for field of view and viewport aspect ratio so the desk stays visible on narrow screens.

The empty desk uses a generated GLB and baked atlas. Its backdrop samples the original texture; only the region containing obsolete prop shadows is cleared and shaded for the bare desk. Regenerate with `blender -b --factory-startup -t 8 --python experience/tools/build-empty-workbench.py`. Blender is an offline authoring tool and is not needed by Vercel.
