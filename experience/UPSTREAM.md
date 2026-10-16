# Reference renderer

Source: https://github.com/henryjeff/portfolio-website
Commit: c53c5a50183655eb83d70048403a5084f5d1214c
Author: Henry Heffernan
License: MIT-style grant in LICENSE.md (retained verbatim).

This is an adapted rendering baseline, not an independently authored scene.
The original GLB geometry and baked textures are included under the repository's license. No additional asset-specific license files were found in the selected source tree. Do not assume models downloaded elsewhere have the same terms.

Kept: Three.js renderer, original authored computer/environment/decor models, baked textures, screen effects, camera states, and asset-loading events.
Changed: garage-door entrance replacing the original BIOS screen; name/metadata; same-origin /desktop instead of Henry's OS; origin/source validation on iframe messages; build output path; HTML-loader asset handling; pinned compatible Node types. Removed Henry's analytics, contact-email server, personal biography metadata, and unused media. His separate inner OS repository was not copied.

The current checkpoint displays a bare tabletop and four legs, using the original desk dimensions and backdrop with regenerated shadows. The computer, decor, chair and monitor are disabled; their original assets remain available. The classic recessed-panel garage entrance is a screen-space HTML/CSS door using the existing camera event. Modern PC, paper interaction and custom project CAD remain future changes. The empty environment is reproducible with tools/build-empty-workbench.py and Blender; committed generated assets are used at runtime.

Install: npm ci --prefix experience --cache /workspace/.npm
Build: npm run build:experience from repository root.
Output: public/experience (generated and ignored).

Keep this directory's own package-lock.json and Three.js version isolated during the baseline phase. A wholesale library upgrade would change the rendering APIs and complicate visual comparison. Modernize separately after the baseline is accepted. Preserve LICENSE.md when copying or distributing this code.
