# Shreethan Palla — portfolio

A personal portfolio adapted from Henry Heffernan’s licensed Three.js room. The current checkpoint has a visible asset loader, plain introduction and scroll-controlled garage entrance, a four-legged desk, an interactive résumé sheet and your actual cube-solving robot with hover feedback and a rounded project reader with a build-story timeline and real testing clips. The two supplied FRC robots now stand beside the desk, and the RC car sits beside the cube solver. Each opens the same project reader. The monitor workspace is available; the PC case and final personal content come next.

![Workshop with the centered monitor, résumé paper, cube solver, RC car and both FRC robots](docs/images/monitor-workshop.png)

See the [plain introduction](docs/images/intro-text.png), [garage-door entrance](docs/images/garage-door.png) and [validation evidence and limits](docs/VALIDATION.md).

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

To change your intro sentence or loading messages yourself, edit [portfolio-copy.ts](experience/src/portfolio-copy.ts). See [editing text and the proposed Onshape-inspired interface](docs/CONTENT-AND-INTERFACE.md) for the GitHub steps and next design direction.

## Where things live

- `experience/src/Application/`: original renderer, camera, scene and screen integration.
- `experience/src/portfolio-copy.ts`: editable entrance and loading text.
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

See the [workshop interaction guide](docs/WORKSHOP-INTERACTIONS.md) to change the authored zoom view or paper placement.

See the [PC asset brief](docs/PC-ASSET-BRIEF.md) for the Corsair 5000T/Gigabyte direction and a two-day CAD workflow. No PC placeholder has been added.

See [your cube robot’s CAD-to-web workflow](docs/CUBE-SOLVER-ASSET.md) for its colors, placement and reproducible conversion.

## Iterate

Change one visual concern per commit. Rebuild the renderer after changes under `experience`:

```bash
npm run build:experience
```

During a renderer editing session, run `npm run watch:experience` in another terminal while Next is running, then refresh the browser. This watcher rebuilds files; it does not run a second OS or require cross-origin hosting.

```bash
npm run typecheck
npm run format:check
npm run test:search
npm run build
```

CI runs formatting, the search configuration tests and the production build. Browser validation is described in the workflow doc. Current inherited size warnings are recorded there; they are not hidden.

## Status

The garage-door entrance, desk, interactive lined résumé paper and centered monitor work. The original computer, chair, plant and desk props are disabled; their original source assets remain in the repository. `/desktop` is available directly. `/projects` now lists the actual projects with readable HTML stories; the old illustrative `/projects/robotics` URL redirects to the FRC project. The supplied cube robot, FRC robot and RC car are connected to the room and shared project reader. The paper lifts/brightens on hover and opens a readable lorem ipsum placeholder with a PDF download. A modern PC, remaining verified project content and final résumé remain outstanding. Public deployment status must be verified in Vercel. Original branded assets require replacement before reintroducing them.

The [fundamentals guide](docs/FUNDAMENTALS.md) explains browser basics, the actual build/deployment pipeline, storage, the room and entrance code, Onshape exports, model integration, and hands-on exercises.

The previous procedural prototype is preserved in `/workspace/portfolio-backups/workshop-before-reference-rebuild.tar.gz` in this cloud machine. That archive is not a GitHub backup or a public asset.

## Credits

Adapted from [Henry Heffernan’s portfolio-website](https://github.com/henryjeff/portfolio-website), commit `c53c5a50183655eb83d70048403a5084f5d1214c`. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The separate inner OS repository was not copied.

The [cube media guide](docs/CUBE-MEDIA.md) records the imported recordings, their captions, conversion settings and remaining files.

See [adding FRC and RC models](docs/WORKSHOP-CAD.md) for exports, materials, placement, phone access and the remaining three-tire car decision.

The FRC models now preview their mechanisms on hover: the intake folds inward and the REEFSCAPE elevator rises. See [hover controls and dates](docs/WORKSHOP-CAD.md#hover-mechanisms-and-project-dates).

The centered monitor now opens a CAD-inspired portfolio workspace with Projects, About and Résumé sections. Project readers support Expand/Restore. See [the monitor workflow and next 48 hours](docs/MONITOR-WORKSPACE.md) for implementation details, the flicker fix and the media/dictation plan.

The [domain and search launch guide](docs/DOMAIN-AND-SEARCH.md) covers the recommended domain, purchase/DNS steps, SITE_URL, Google Search Console, shared project pages and usage limits.
