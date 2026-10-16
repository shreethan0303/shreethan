# White workshop — three-day release plan

## Locked direction

Warm-white, nearly seamless room. A workbench is the central object; real projects sit on it. A full FRC robot sits on the floor beside the bench. A dirt bike stands behind and to the other side, angled so it remains visible. Two tennis rackets lean against the bench. No full car in v1. Robot and bike are floor-scale objects, not miniatures. Preserve clear negative space and readable silhouettes.

Desktop composition, seen from a slightly elevated three-quarter camera:

```
                    DIRT BIKE (rear right)
           WORKBENCH + CREAM RETRO COMPUTER
       cube robot / RC car / keyboard / mouse
 FULL FRC ROBOT                         TENNIS RACKETS
 (front left)                          (right end)
```

Use approximate real dimensions to establish scale; final positioning depends on provided robot and bike references. Keep the back wall distant and omit a ceiling. Use warm-white floor/walls, cream hardware, charcoal text, and muted blue UI selection. Actual projects supply accent colors. Soft contact shadows distinguish white objects; do not use pure-white unlit materials everywhere.

## Opening and camera states

States: loading → door opening → short camera arc → overview ↔ computer. Project pages have independent URLs.

A closed pale sectional garage door fills the first frame. Small nameplate: “Shreethan Palla / The Workshop”. Show real asset-loading status; do not manufacture percentage progress. Once critical geometry is ready, lift the door and glide forward with a small lateral arc into the overview. The entry frame must not intersect the raised door or room geometry. Block out the door opening first with boxes. A two-to-three-second reveal is a design target, not a forced loading delay.

Pan once, then settle. No continuous orbit. Overview shows the bench, whole robot, bike, and rackets at once. Clicking the computer moves to a readable front view; Back to workshop restores overview. Support Skip intro, reduced motion, and a remembered intro preference. Avoid blank screens if WebGL or model loading fails. Mobile uses its own framing and a direct Open desktop button; do not squeeze the desktop camera into portrait unchanged.

## Content and interface

Computer applications: Projects, About, Skills, Résumé, Contact. Physical objects link to the same content. Desktop windows use accessible HTML/CSS, not text drawn into textures. Build as components in the existing Next.js app; a separate deployment or cross-origin iframe is unnecessary. Keep ordinary navigation available outside the canvas.

Projects: middle-school RC car, freshman-year cube-solving robot, FRC robotics, tennis/software algorithm. Titles are provisional. Obtain the user’s exact contribution, dates, photos, and claims before writing case studies. Do not imply sole ownership of an FRC team robot. Résumé uses only user-supplied facts and has a print stylesheet plus Print / Save as PDF action. Distinguish this from a pre-generated PDF download.

## Technical workflow

Use existing Next.js / TypeScript / React Three Fiber / Drei. Procedural room, desk, monitor, door, and simple props first. A single camera controller owns camera position and target. Start with rough objects, fit all silhouettes into the overview, then animate between explicit states. Disable competing camera controls during scripted motion. Render on demand when stationary; temporarily invalidate during animation. Use capped device pixel ratio, modest textures, no default postprocessing, and deferred loading of detailed project assets. Measure actual asset transfer size and frame behavior before asserting performance.

One representative project may have an exploded assembly. This is a stretch goal after content and navigation. Games, achievements, complete vehicle simulation, multiple rooms, and realistic door tracks are outside the launch scope.

## Research: Henry Heffernan

Inspected public source on this run (2026-10-15), rather than the live site, which the environment network blocks:

- https://github.com/henryjeff/portfolio-website
- https://github.com/henryjeff/portfolio-inner-site
- https://github.com/henryjeff/portfolio-website/blob/master/src/Application/World/MonitorScreen.ts
- https://github.com/henryjeff/portfolio-website/blob/master/src/Application/Camera/CameraKeyframes.ts
- https://github.com/henryjeff/portfolio-website/blob/master/src/Application/sources.ts
- https://github.com/henryjeff/portfolio-website/blob/master/src/Application/Renderer.ts
- https://github.com/henryjeff/portfolio-website/blob/master/LICENSE.md

Findings:

1. Outer site uses Three.js, TypeScript, React, Webpack, camera-controls, GSAP and tween.js dependencies.
2. Computer screen is a CSS3DObject containing an iframe pointing to a separate React OS app. It is real HTML, not only a screen texture. Monitor code relays input events from the iframe.
3. Camera has explicit loading, desk, monitor, idle, and orbit-start keyframes, with viewport-dependent framing.
4. Resource manifest loads separate GLB computer/environment/decor models and baked JPG textures. This is evidence of baked appearance assets; no claim about the exact modeling tool is made.
5. Inner app includes js-dos and emulator dependencies; a game is additional functionality, not a prerequisite for the portfolio.
6. package.json says UNLICENSED, but the repository’s LICENSE.md explicitly grants MIT-style reuse subject to retaining copyright and permission notices. Check asset-specific notices and inner-site licensing before copying those materials. No third-party source or assets have been incorporated into our app during this research.

Borrow the architecture and interaction principles. Reuse licensed helpers selectively only if it saves integration time; do not import the entire older stack. Never reuse Henry’s biography, project claims, branding, contact information, or résumé content.

## Three working days

### Day 1: usable composition and computer

- Build white room, workbench/monitor, full-scale robot blockout, bike silhouette and rackets.
- Lock desktop/mobile camera framing; screenshot review of all objects visible together.
- Implement overview ↔ computer transitions and direct project navigation.
- Build desktop shell and working windows with factual provisional content.

Exit criterion: every essential destination works without the entrance animation or 3D exploration.

### Day 2: entrance, identity and content

- Add actual loading state, garage door reveal, short camera arc, Skip and reduced-motion behavior.
- Replace selected blockouts with optimized models; use licensed temporary assets only with provenance.
- Add user photos, project contributions, About/contact and printable résumé.
- Optional: one explained exploded assembly if the required content is finished.

Exit criterion: complete story and contact information; entry can be skipped and replayed safely.

### Day 3: validation and release

- Test phone/desktop layouts, keyboard navigation and focus, history/deep links, print/PDF, WebGL failure, slow loading and model errors.
- Measure and reduce initial transfer and graphics load; prevent continuous rendering while idle.
- Run production build and representative browser flows.
- Deploy preview; verify its real URL and asset paths. Connect domain when supplied and access is available.

Exit criterion: a public URL with real user content and no known blocking navigation defects. No guaranteed deployment or domain activation before hosting access is established.

## What the user supplies

Now, for accurate geometry: one reference screenshot of the intended room (none was received in this conversation), FRC robot photo and approximate dimensions or CAD export, dirt-bike model/year or a representative photo. These refine visuals; rough geometry can proceed without them.

By the end of Day 1: public contact destination, short bio, project names and each personal contribution. By Day 2: available photos/video/CAD, education/experience/skills for résumé. Domain and hosting preference if any; a hosting preview URL is sufficient initially.

Onshape is sufficient to supply CAD. Check the actual export formats available. Prefer a separated glTF/GLB assembly if available; otherwise STEP needs tessellation/conversion. STL is geometry-only and may lose useful assembly structure. Keep originals private and optimize publishable copies. Blender is optional for conversion, simplification and material cleanup; not a required learning task before launch.

## Implementation status

Existing prototype: older cutaway garage, procedural placeholder rover, mechanisms/research links, direct project routes, assembly toggle, 3D-off control. Production build and representative browser interactions passed in the previous implementation run. The white workstation, full FRC robot, dirt bike, garage door, camera transition, computer desktop and résumé described here are planned and not yet implemented. Research and planning do not constitute deployment.

## Implementation update

The white room, procedural workbench, cream monitor, PC tower, keyboard, rackets, full-scale illustrative FRC robot, dirt-bike blockout, and bench project placeholders are now implemented. The door entry, overview/computer camera transitions, HTML desktop, About/Contact, shutdown/restart and Projects-return-to-overview behavior are implemented. The entry is user-triggered once the procedural scene is ready; there is no fabricated asset percentage. The camera uses a smooth interpolated move, not yet a bespoke cinematic spline path. The earlier “not yet implemented” status above describes the previous prototype, not this update. Real model imports, résumé, complete project content and public deployment remain outstanding. See MODELS-AND-CAD.md for asset sources and import requirements.

## Latest visual revision: minimal room

The latest user direction supersedes the decorative header, hero, project grid and floating navigation from earlier versions. The landing view is now a closed door with a centered square containing Shreethan Palla and Start. After entry, the white room contains only scene objects. Labels appear on hover/focus or when Projects is selected. Normal scrolling smoothly approaches the monitor; at the end it reveals a responsive HTML desktop overlay. The desktop’s Projects application returns to the physical project objects. Interests frames the bike/rackets. A desk paper and a desktop application open a printable profile draft. No education, skills proficiency, team contributions or achievements have been invented. Resume facts remain pending.

The PC tower now has a dark interior/front with red and white emissive fan rings. These are procedural stand-ins, not an imported high-detail PC model. Full FRC CAD and other accurate models remain pending. The current opening is a smooth door lift and camera interpolation, not a fully authored cinematic path. Desktop screen controls use a normal HTML overlay on camera approach to avoid perspective-transformed DOM hit-testing failures found during browser testing. No third-party code or assets were copied.

## Studio quality pass

Latest priority is matching the restraint and finish of the reference, not filling the room. The bike is removed until the central workstation is convincing. Replaced the box furniture with a beveled white workbench, aluminum rails and feet, slim modern display, individual keyboard keys, and a black tower with modeled fan rings/blades and white/red strips. Removed the room wall/floor-box corner in favor of a white seamless floor and white background. Added locally generated softbox environment lighting (no external HDRI download). FRC/RC/cube geometry is still provisional. Added material-preserving, locally configured GLB slots for those projects.

Three-day focus: finish this one composition and camera/desktop first; replace and explain the user’s actual projects second; performance, fallback/mobile, final résumé and deployed public preview third. No vehicle modeling or games before those are complete. Authoring quality and model preparation remain separate work from choosing Three.js. Blender is optional but useful for asset cleanup/baking; Onshape is suitable for supplying engineering geometry. Official Onshape export documentation and public model marketplaces were network-blocked; do not claim verified bike downloads or guaranteed color preservation in every export path.
