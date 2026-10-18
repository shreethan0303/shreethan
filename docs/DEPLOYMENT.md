# Deploy a preview on Vercel

No domain purchase is needed. A successful deployment supplies an HTTPS `vercel.app` address. This file is setup guidance, not evidence that a deployment exists.

## First deployment

1. Create/sign into Vercel using GitHub.
2. Add New → Project, and import `shreethan0303/shreethan`. Grant access to this repository if requested.
3. Use the `main` branch. The current implementation is being promoted from `codex/reference-baseline` so default-branch deployments receive the actual site. For subsequent changes, use branch previews before merging.
4. Root Directory: repository root. Framework: Next.js. The checked-in `vercel.json` provides:
   - Install: `npm ci && npm ci --prefix experience`
   - Build: `npm run build`
5. Deploy and open the successful deployment's generated HTTPS URL. If deployment protection requires login, adjust access for the intended preview audience in Vercel settings before sharing.
6. Test the room, monitor, Projects, `/projects/robotics`, and `/resume` on that public URL. Successful local tests do not replace this check.

For subsequent updates, review and merge development branches into main; keep main as the production branch. Do not change GitHub's default branch merely to preview this work. The reference still includes Henry's baked branding and original assets, so use this as a development preview until customization is complete.

## Custom domain later

In the Vercel project, open Settings → Domains, add the purchased domain, and follow the exact DNS records Vercel provides for that domain. Wait for DNS and certificate validation. Never guess DNS values or edit existing mail records unnecessarily. Confirm both the canonical domain and redirects before handing out the address.

## Troubleshooting

- Original starter page appears: check the deployed commit. The starter commit was `aa7a328`; deploy the latest `main` commit.
- Missing GLBs, textures or renderer index: verify the build runs `build:experience` and the output `public/experience` is generated.
- Module missing under `experience`: verify the install command installs both lockfiles.
- Site works in cloud localhost but not your browser: localhost refers to the machine running the server. Use the actual hosted HTTPS URL.
- Build failure: share the error and surrounding log lines, without credentials. Avoid random retries or changing multiple settings together.

## Scroll exploded-view prototype

`/projects/robotics` includes a sample rover that separates across three assemblies as you scroll down and reassembles when scrolling up. This is illustrative geometry, not the user's actual FRC robot. The slider controls the same scroll position for keyboard/touch access. Actual CAD needs named components and separation offsets before adapting this interaction.

Implementation: `app/projects/[slug]/viewer.tsx` owns scroll progress; `app/components/assembly-scene.tsx` renders the components. The room's reference renderer is unchanged. Root Next.js is pinned to 15.5.28, the non-major patched release identified by npm audit during deployment preparation. Its PostCSS dependency is overridden to the compatible patched 8.5.30 release; the production build is checked with that override.

## Current account diagnosis

The user opened a dashboard deployment under `shreethan-v474`. A public GitHub check for commit `719e2c7` links feedback to `shreethan-git-codex-reference-e3f1bd-shreethan-pallas-projects.vercel.app`, indicating another Vercel project named `shreethan` is connected. This is evidence of a preview address, not proof of its current runtime state. Avoid creating more duplicate projects. Choose one connected project and inspect its actual deployment status. Do not delete either project until the intended site works.

This agent cannot read the signed-in browser tab or Vercel logs with its current tools. GitHub public check pages can expose limited status/preview metadata. If deployment fails, the first error and deployed commit remain necessary evidence.

## Usage discipline

Publish each tested batch once to `main`. Do not also push the same commit to the reference branch; `vercel.json` disables automatic deployments for `codex/reference-baseline` as a second safeguard. Other development branches can still produce intentional previews. Use local builds/browser checks while iterating instead of repeated Vercel redeploys. GitHub Actions runs separately from Vercel and does not consume Vercel build time.

The main portfolio is statically generated; its Three.js rendering happens on the visitor's device. Unused original computer/decor models and textures are excluded from startup downloads (about 2.4 MB per uncached visit). Compressed display models and images reduce transfer, and project videos use `preload="none"` so clips download on demand. Static delivery still consumes transfer/request quotas, and repeated deployments consume build resources; client-side rendering does not make hosting unlimited.

Check the team's **Usage** page and any available usage/budget notifications against the actual plan. This workspace cannot inspect the signed-in account's live totals or configure its notifications. Keep one intended Vercel project connected to this repository: previous sessions identified multiple connected projects, which can build the same push separately. Inspect those connections before disconnecting an obsolete one; do not delete projects blindly. No quota values or account-wide monitoring are claimed by this repository configuration.
