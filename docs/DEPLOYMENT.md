# Deploy a preview on Vercel

No domain purchase is needed. A successful deployment supplies an HTTPS `vercel.app` address. This file is setup guidance, not evidence that a deployment exists.

## First deployment

1. Create/sign into Vercel using GitHub.
2. Add New → Project, and import `shreethan0303/shreethan`. Grant access to this repository if requested.
3. Deploy the branch `codex/reference-baseline`. **Main still contains the original placeholder.** If the import screen offers a source/ref selector, choose this branch. If import starts from main, create the project, then open Deployments → Create Deployment and enter `codex/reference-baseline` to create its preview.
4. Root Directory: repository root. Framework: Next.js. The checked-in `vercel.json` provides:
   - Install: `npm ci && npm ci --prefix experience`
   - Build: `npm run build`
5. Deploy and open the successful deployment's generated HTTPS URL. If deployment protection requires login, adjust access for the intended preview audience in Vercel settings before sharing.
6. Test the room, monitor, Projects, `/projects/robotics`, and `/resume` on that public URL. Successful local tests do not replace this check.

For a production site later, review and merge the branch into main and use main as the production branch. Do not change GitHub's default branch merely to preview this work. The reference still includes Henry's baked branding and original assets, so use this as a development preview until customization is complete.

## Custom domain later

In the Vercel project, open Settings → Domains, add the purchased domain, and follow the exact DNS records Vercel provides for that domain. Wait for DNS and certificate validation. Never guess DNS values or edit existing mail records unnecessarily. Confirm both the canonical domain and redirects before handing out the address.

## Troubleshooting

- Original starter page appears: wrong branch deployed; use `codex/reference-baseline`.
- Missing GLBs, textures or renderer index: verify the build runs `build:experience` and the output `public/experience` is generated.
- Module missing under `experience`: verify the install command installs both lockfiles.
- Site works in cloud localhost but not your browser: localhost refers to the machine running the server. Use the actual hosted HTTPS URL.
- Build failure: share the error and surrounding log lines, without credentials. Avoid random retries or changing multiple settings together.

## Scroll exploded-view prototype

`/projects/robotics` includes a sample rover that separates across three assemblies as you scroll down and reassembles when scrolling up. This is illustrative geometry, not the user's actual FRC robot. The slider controls the same scroll position for keyboard/touch access. Actual CAD needs named components and separation offsets before adapting this interaction.

Implementation: `app/projects/[slug]/viewer.tsx` owns scroll progress; `app/components/assembly-scene.tsx` renders the components. The room's reference renderer is unchanged. Root Next.js is pinned to 15.5.28, the non-major patched release identified by npm audit during deployment preparation. Its PostCSS dependency is overridden to the compatible patched 8.5.30 release; the production build is checked with that override.
