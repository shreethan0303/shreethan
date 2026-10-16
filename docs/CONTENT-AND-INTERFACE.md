# Edit your text and plan the monitor interface

## Change the intro yourself

The entrance text lives in one file: [`experience/src/portfolio-copy.ts`](../experience/src/portfolio-copy.ts). `intro` is the entire sentence, rendered with one consistent text style. The other fields control the scroll hint and three loading messages.

On GitHub:

1. Open [the file on main](https://github.com/shreethan0303/shreethan/blob/main/experience/src/portfolio-copy.ts).
2. Click the pencil to edit. Change the words between double quotes, keeping the quotes and commas.
3. Preview your changes, then commit to `main` for the production workflow, or a branch for a preview/review.
4. Vercel's connected Git integration starts a build. Open the deployment for that branch and commit. Wait for **Ready**, then visit its website URL and refresh.

Use the branch that supplies the URL you are viewing. A `main` commit does not change the `codex/reference-baseline` preview. Codex currently pushes this task's changes to both branches; an edit you make on GitHub changes only your chosen branch. Prefer the main production URL for routine text edits. A deployment-specific URL remains tied to that deployment; a branch alias advances to its newer successful deployments.

A commit records a version of the source. A push sends local commits to GitHub; editing directly on GitHub already saves them there. A build compiles source into files a browser can run. A deployment publishes a build. While a newer build is running, an existing alias may still show the previous successful deployment. A failed build does not prove your change was published.

The copy file exports a JavaScript object: labels on the left, strings on the right. `LoadingScreen.tsx` imports that object and inserts the strings into HTML through React. The text is real HTML on top of the 3D scene, so changing it needs no CAD export or texture editing. React treats these strings as text; do not put HTML tags in them.

For local editing, save the file with `npm run dev` running and `npm run watch:experience` in a second terminal. Wait for the renderer to recompile and refresh. The initial `dev` command builds the renderer once; the separate watcher rebuilds it on later saves. Do not edit `public/experience`: it is generated and overwritten.

Current introduction:

> Hey, I'm Shreethan Palla and I build robots and software and enjoy learning new things.

The loader's circle fills from actual asset-count progress, then the entrance appears after the first room frame has rendered. The rotating desk view is prepared behind the door. There is no Open without 3D link on the entrance; `/desktop` remains a direct route. Failed loading shows a Reload button.

## Proposed direction: a portfolio document inspired by CAD

This is a design proposal, not an implemented replacement for the current desktop. Keep the white room, existing paper and entrance. Add the computer when a suitable asset is ready. Its screen can present your work as a lightweight engineering document, using your own name and visual identity.

| Area          | What visitors see                                            | Purpose                                             |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Top bar       | Shreethan Palla · Projects · About · Résumé · Contact        | Direct access without CAD knowledge                 |
| Left panel    | Actual project names and a small preview                     | Choose a project in one click                       |
| Main viewport | A real model or photo, project summary and your contribution | Understand what you built before exploring          |
| Project tabs  | Overview · Assembly · Build notes · Results                  | Move between evidence and explanation               |
| Model control | Explode / Assemble, plus an optional scroll-controlled view  | Explain components only where the model supports it |
| Back control  | Back to desk                                                 | Return to the physical scene without getting lost   |

The Part Studio / Assembly idea works best as a visual reference: a neat component tree, a generous viewport and document tabs. Use familiar portfolio labels for essential navigation. Each control needs a real job. Feature-history entries could become real build milestones with a photo and one design decision; do not add pretend tools or an empty toolbar just to resemble CAD software.

At launch, choose either a project list or project tabs as the primary project selector. Avoid two competing selectors. On phones, put the project chooser above the content instead of squeezing in a permanent sidebar. Keep hover highlighting optional; taps and keyboard activation must open the same content.

## How it would work technically

The room uses Three.js to render meshes from a camera viewpoint. The computer's visible screen can carry an HTML interface positioned with the existing CSS3D integration. Buttons, text and navigation stay ordinary HTML. That makes readable content much easier than drawing letters onto a 3D texture.

Next.js supplies the direct content routes. Use one shared source of project data for the monitor and direct pages; do not maintain separate biographies. A project URL should open the same case study without requiring the entrance or a 3D-capable device. Keep `/resume` and `/desktop` accessible directly. The current desktop is an older, simple window interface; this proposed CAD-document layout would replace its presentation after review.

Onshape is where you author geometry and assembly structure. It is not required at runtime: export a model, optimize a public copy, then load it in the website. A GLB is a packaged mesh/material file, not the original editable feature history or constraint solver. The website can rotate, highlight and separate named meshes without reproducing a CAD application. We author exploded directions and distances separately so they explain the actual assembly. See [the interaction guide](WORKSHOP-INTERACTIONS.md) and [CAD workflow](WORKFLOW.md#cad-and-appearance).

For scrolling, map progress from 0 to 1 to each part's assembled position plus an authored separation offset. Interpolate positions, not the original CAD dimensions. Reverse scroll brings parts back together. Keep a visible Assemble control and a readable description. Select one assembly section for this behavior; leave the rest of the page's scrolling predictable.

Do not embed a full live Onshape editor for the launch. A portfolio needs fast reading and navigation; authentication, editing toolbars and a CAD session introduce requirements the portfolio does not need. A link to a deliberately public Onshape document can supplement the case study later.

## Two-day order

1. Settle the monitor layout with one reusable case-study template and direct navigation. Add the real short bio, project facts, links and résumé when supplied. Continue using lorem ipsum in the résumé until then.
2. Import one real named-part CAD export and implement its inspection/exploded behavior. Validate phone layout, direct routes, keyboard access and the hosted deployment. A good photo and clear case study can ship first if the export is not ready.

The proper PC asset remains deferred, with no new placeholder inserted. Bike, games, a CAD constraint solver and elaborate fake OS interactions stay outside this launch scope.

## References inspected for this direction

- [Henry Heffernan's room README](https://github.com/henryjeff/portfolio-website): explicitly separates the 3D room and inner 2D site into two repositories. Reuse that separation of responsibilities, retaining the license credit for adapted code.
- [Brittany Chiang's v4 hero source](https://github.com/bchiang7/v4/blob/master/src/components/sections/hero.js): name, specific work statement and short explanatory paragraph are distinct. Borrow the clarity and hierarchy, not another person's biography. This is a source reference to v4, not a claim about the current live homepage.

These public repository sources were retrieved. No live interactive Onshape-themed portfolio was verified in this research, and this proposal is not a claim that the concept is unprecedented.
