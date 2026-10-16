# Working on this portfolio

## One source of truth

Keep executable code and project history in `shreethan0303/shreethan` on GitHub. This workspace already has that origin and read access was verified with native Git. The local working branch is `codex/reference-baseline`; branch creation is not a push. Do not say changes are on GitHub until a push is confirmed. No new token is required just because a CLI asks to log in: this cloud machine uses a scoped HTTPS Git proxy.

Use small branches/PRs for the reference baseline, entrance, workbench/PC, project viewer and real content. Review before merging into main. Connect the hosting provider to the GitHub repository once. Use preview deployments for branches and production for main. The checked-in Vercel config installs both npm projects; it does not connect a hosting account, deploy or buy a domain.

## ChatGPT / Codex organization

Create one ChatGPT Project named “Shreethan Portfolio” for the design brief, reference screenshots, content drafts and decisions. Keep the current brief and asset list there, not multiple competing copies of the entire repository. Suggested chats: Design review; Project stories; Model preparation.

Use the repository-attached Codex task for actual implementation and debugging. GitHub owns the source; a ChatGPT GitHub connector is useful for reading context and does not automatically synchronize edited files. In each implementation request identify the branch, one intended change, acceptance criteria, and screenshot/device used to verify it. Ask for a screenshot comparison rather than another complete redesign.

If continuing in a new session, start by reading README, DECISIONS and UPSTREAM. State which checkpoint is active and which behavior already passed. Preserve work from other tasks.

## Three working days

1. **Baseline and entrance:** verify the original rendering and desktop bridge, capture screenshots, then change only the boot/garage-door reveal. Keep the room unchanged while the door/camera is tuned.
2. **Identity and real projects:** replace desk with workbench and modern black PC; import one actual project and write its contribution/results. Add profile/resume/contact facts. Defer the bike, games and achievements.
3. **Release:** project links, keyboard/direct desktop, portrait layout, loading failure, print PDF, rendering load and production build. Verify a real hosted preview on an actual phone. Then connect a domain if desired. The deadline depends on timely project facts/model delivery and hosting access.

## CAD and appearance

Send one export and a colored reference screenshot first. Prefer GLB/glTF when Onshape offers it. Preserve separate parts/names for an exploded view. Otherwise STEP needs tessellation/conversion; appearance survival depends on the converter. STL normally loses colors/materials. Zip `.gltf`, `.bin` and texture files together if not using GLB. Include approximate real dimensions, intended orientation, and your role in team projects.

Keep editable CAD private. Publish optimized copies under `public/models`. Record source, author, license/permission, conversion steps and measurements. The original renderer's `BakedModel` deliberately replaces materials with a shared baked texture: **do not run your colored CAD through that class**. Load your project as a separate glTF scene and preserve its materials; fit its scale/position into the reference scene. The existing reference uses large scene coordinates, so raw meter-scale CAD needs an explicit scale transform.

A convincing exploded view needs named components, sensible separation axes and explanations. Hover should identify/highlight; click/tap should open a stable detail view; a button or controlled scroll separates assemblies. Avoid opening documents merely because the cursor passes over them. Resume paper should reveal an affordance and provide access to the verified resume PDF/page.

## Reference roles

- [Henry Heffernan source](https://github.com/henryjeff/portfolio-website): actual working renderer baseline. Original models, baked environment, camera keyframes and CSS3D monitor were inspected and tested.
- [Bartosz Ciechanowski](https://ciechanow.ski/): explanatory engineering interactions; useful for component inspection.
- [Apple AirPods Pro](https://www.apple.com/airpods-pro/): product reveal and scroll pacing reference.
- [Bruno Simon](https://bruno-simon.com/): discovery and personality without hiding essential navigation.

The latter live sites could not be inspected through the current egress policy; they are reference leads, not newly verified examples. Do not claim a site implements an exact hover/explosion behavior without checking. Implement one representative assembly instead of collecting endless references.

## Testing and troubleshooting

- `npm ci` and `npm ci --prefix experience` reproduce the two lockfiles.
- `npm run build` must compile both parts without errors. Do not bypass type checks to make a build pass.
- Open `/` in a real browser, confirm assets complete loading, Start reveals the original room, and a click approaches the desk.
- Check the embedded `/desktop` loads with no external Henry OS or analytics calls. Exercise About, power on/off, Projects and Resume.
- Test `/desktop` directly on a narrow viewport. Keyboard users can focus the direct-desktop link at `/`.
- Print `/resume` to PDF and inspect extracted text. Generating an empty PDF is not a pass.
- Record console errors, 404s and model load errors. Confirm source materials load before diagnosing “lighting”.

The original renderer currently builds a roughly 908 KiB JS bundle and includes two screen videos totaling roughly 7 MiB; webpack emits size warnings. This is a visual baseline, not a measured mobile-performance target. Optimize/delay optional media after visual behavior is accepted. Do not assume the original site is efficient solely because it looks smooth.

Cloud localhost is reachable only inside this machine unless the host provides forwarding. The browser-open tool returned queued rather than a confirmed preview in this session. Do not keep sending localhost as if it were a public URL. Use a local checkout on your own machine or a confirmed hosted deployment. A Vercel account/domain is not needed for local development.
