# Shreethan Palla — portfolio

A personal portfolio being rebuilt from Henry Heffernan’s licensed Three.js room. The first checkpoint preserves the reference rendering and camera behavior; subsequent changes will introduce Shreethan’s workshop and real projects.

![Current reference baseline](docs/images/reference-overview.png)

See the [garage-door entrance](docs/images/garage-door.png) and [validation evidence and limits](docs/VALIDATION.md).

## Run locally

Use Node 24 (the version verified in the cloud workspace).

```bash
npm ci
npm ci --prefix experience
npm run dev
```

Open the localhost address printed by Next **on the computer running these commands**. A localhost address from a remote cloud machine is not a public preview link.

For production:

```bash
npm run build
npm run start
```

The build generates `public/experience` before building Next. Install both dependency sets. Vercel settings are in `vercel.json`; importing the GitHub repository requires your hosting account. A saved config or a local server does not mean the site is deployed.

For a public preview, follow [the deployment guide](docs/DEPLOYMENT.md). Use `main` for the current deployment; `codex/reference-baseline` retains the development branch.

For a plain-language explanation, read [how the website works](docs/FUNDAMENTALS.md).

## Where things live

- `experience/src/Application/`: original renderer, camera, scene and screen integration.
- `experience/static/`: selected upstream GLB models, baked textures and media.
- `experience/UPSTREAM.md`, `experience/LICENSE.md`: exact upstream commit, attribution and adaptations.
- `app/desktop/`: same-origin personal desktop route shown inside the monitor.
- `app/components/desktop.tsx`: desktop windows and controls.
- `app/data/portfolio.ts`: verified project facts; expand this before adding claims.
- `app/projects/`, `app/about/`, `app/resume/`: readable pages and printable profile draft.
- `public/models/`: optimized public copies of your actual models, once supplied. Keep source CAD outside this folder.
- `docs/WORKFLOW.md`: GitHub, ChatGPT, CAD and three-day workflow.
- `docs/DECISIONS.md`: current direction and next changes.
- `docs/history/`: superseded procedural-prototype plans.

## Iterate

Change one visual concern per commit. Rebuild the renderer after changes under `experience`:

```bash
npm run build:experience
```

During a renderer editing session, run `npm run watch:experience` in another terminal while Next is running, then refresh the browser. This watcher rebuilds files; it does not run a second OS or require cross-origin hosting.

```bash
npm run typecheck
npm run format:check
npm run build
```

CI runs formatting and the production build. Browser validation is described in the workflow doc. Current inherited size warnings are recorded there; they are not hidden.

## Status

The reference scene and local desktop integration work. `/projects/robotics` now includes an illustrative scroll-controlled exploded assembly. The original baked models still contain Henry’s visual branding and paper artwork. This is a development baseline, not a finished Shreethan portfolio. The garage-door introduction now works. Replacement workbench/PC, real project models, physical project/paper interactions and final résumé are outstanding. Public deployment status must be verified in Vercel. Do not publish someone else’s résumé artwork as your own.

The previous procedural prototype is preserved in `/workspace/portfolio-backups/workshop-before-reference-rebuild.tar.gz` in this cloud machine. That archive is not a GitHub backup or a public asset.

## Credits

Adapted from [Henry Heffernan’s portfolio-website](https://github.com/henryjeff/portfolio-website), commit `c53c5a50183655eb83d70048403a5084f5d1214c`. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The separate inner OS repository was not copied.
