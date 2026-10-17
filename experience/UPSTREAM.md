# Reference renderer

Source: https://github.com/henryjeff/portfolio-website
Commit: c53c5a50183655eb83d70048403a5084f5d1214c
Author: Henry Heffernan
License: MIT-style grant in LICENSE.md (retained verbatim).

This is an adapted rendering baseline, not an independently authored scene.
The original GLB geometry and baked textures are included under the repository's license. No additional asset-specific license files were found in the selected source tree. Do not assume models downloaded elsewhere have the same terms.

Kept: Three.js renderer, original authored computer/environment/decor models, baked textures, screen effects, camera states, and asset-loading events.
Changed: garage-door entrance replacing the original BIOS screen; name/metadata; same-origin /desktop instead of Henry's OS; origin/source validation on iframe messages; build output path; HTML-loader asset handling; pinned compatible Node types. Removed Henry's analytics, contact-email server, personal biography metadata, and unused media. His separate inner OS repository was not copied.

The current checkpoint displays a bare tabletop and four legs, using the original desk dimensions and backdrop with regenerated shadows. The computer, decor, chair and monitor are disabled; their original assets remain available. The flat sectional garage entrance is a screen-space HTML/CSS door using the existing camera event. A real asset-loading ring precedes a text-only introduction; scroll moves the copy away before opening the door. There is no intro card or Enter button. A procedural lined résumé sheet now lifts and brightens on hover and opens a same-origin HTML reader with a placeholder PDF. The authored desk view and paper placement are configured in World/WorkshopLayout.ts. The owner’s supplied cube-solving robot is now a separate material-preserving GLB on the tabletop, with gentle hover/focus feedback. A modern PC remains a future change. The empty environment is reproducible with tools/build-empty-workbench.py and Blender; committed generated assets are used at runtime.

Install: npm ci --prefix experience --cache /workspace/.npm
Build: npm run build:experience from repository root.
Output: public/experience (generated and ignored).

Keep this directory's own package-lock.json and Three.js version isolated during the baseline phase. A wholesale library upgrade would change the rendering APIs and complicate visual comparison. Modernize separately after the baseline is accepted. Preserve LICENSE.md when copying or distributing this code.

The owner-supplied FRC and RC STEP assemblies are separate optimized Meshopt GLBs, with source hashes and part manifests beside the display files. Their selection and camera focus reuse the cube interaction through WorkshopProject and a shared ProjectReader. The room camera now frames the desk and floor robot together. The original entrance, bars and environment lighting remain. See ../docs/WORKSHOP-CAD.md for conversion and placement limitations.

The FRC display copies now preserve named intake and elevator motion parents. WorkshopProject adds reversible hover/focus lift and local mechanism transforms; the project reader frames the full hovered pose. The second robot comes from the owner’s Top Level Assembly STEP. These are authored presentation motions, not exported CAD constraints. The original room interface, entrance and lighting remain intact.
