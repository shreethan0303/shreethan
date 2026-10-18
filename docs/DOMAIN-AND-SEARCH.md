# Domain and search launch

Recommended name: **shreethanbuilds.com**. “Builds” describes the actual robotics, CAD and software work more specifically than “creates.” Availability and current pricing have not been verified. Porkbun is a reasonable independent registrar; compare the normal renewal price and final checkout total, not just the first-year promotion. Buy only the domain, in the owner's account, with two-factor authentication, included domain privacy and auto-renewal. No hosting or paid SSL add-on is needed for Vercel.

The registrar, DNS and website hosting are independent. A future rebuild can keep the same domain and page paths. Moving hosting requires updating DNS; moving registrars is optional and subject to transfer rules. Preserve redirects if project URLs change.

## Purchase and connect

1. Search for the exact spelling `shreethanbuilds.com` at the registrar. Confirm availability, first-year and renewal costs. Payment and registration details must be supplied by the owner; nothing has been purchased by this workspace.
2. In Vercel, choose the one project that serves the latest working site and deploys from this repository's main branch. Several project names appeared in earlier previews, so a new project is not needed. Inspect duplicate Git connections before disabling obsolete ones.
3. Add the purchased root domain and its `www` version under that project's Settings → Domains. Choose the root as primary and redirect `www` to it. Enter the exact DNS records Vercel provides in the registrar's DNS settings. Preserve existing mail records if present. Vercel supplies HTTPS after verification.
4. In the chosen Vercel project's **Production** environment variables, set `SITE_URL=https://shreethanbuilds.com` only after purchase and connection. The code expects an HTTPS origin with no path, query or fragment. Do not put a preview URL there. Batch that change with the next needed deployment. Without SITE_URL, the site still works and the project pages are readable, but no domain-specific canonical links, structured-data URLs or sitemap entries are emitted.
5. Test the root and www versions in an incognito window and on a phone over cellular data. Check that public production access does not require a Vercel login. Open `/projects`, `/projects/cube-solver`, `/projects/rc-car`, `/about`, `/robots.txt` and `/sitemap.xml` on the purchased domain.

## Google Search Console

After DNS is connected, open https://search.google.com/search-console and add a **Domain property** for `shreethanbuilds.com`. Google gives an exact TXT record: add that record to DNS without removing the website records. Verify ownership, then submit `https://shreethanbuilds.com/sitemap.xml`. Use URL Inspection to request indexing of the homepage and completed project pages. Verification tokens are account-specific and cannot be invented. A URL-prefix property is an alternative; if Google supplies an HTML verification token, the optional Production `GOOGLE_SITE_VERIFICATION` variable emits its meta tag after a deployment.

Search Console measures search impressions, queries, clicks and indexing. It is separate from visitor analytics. Search ranking and indexing are not guaranteed or instantaneous. A full-name search is a realistic primary target; first-name-only searches have more competition. No paid SEO package, keyword stuffing or purchased backlinks is needed. Link the domain from the owner's actual GitHub/LinkedIn or team profiles when appropriate; no external profiles have been edited by this workspace.

## What is ready in the repository

- The homepage retains the 3D workshop and its plain-name title. A keyboard reading link and no-JavaScript fallback make the project pages accessible without manipulating 3D objects.
- `/projects` and the five project pages are static HTML. They use the same project data as the workshop readers; each reader links to its full page in a new tab, preserving the workshop state.
- The cube and RC car pages include the existing supplied stories and media. Videos use `preload="none"`, images below the hero load lazily, and these HTML pages do not download the workshop's GLBs.
- The FRC and dirtbike pages remain shareable but have `noindex` until their real stories are supplied. Placeholder résumé and legacy desktop routes are also not indexed. Old illustrative project routes redirect to the actual project or project list. Existing prototype source files remain in Git.
- Titles, descriptions and sharing metadata describe the actual projects. Canonicals, Person/CreativeWork structured data and the sitemap use SITE_URL; nothing assumes ownership of a contemplated domain. The sitemap omits thin project placeholders. Preview deployments carry noindex metadata and emit no sitemap entries.
- Update facts/media in `experience/src/cube-project.ts` or `experience/src/workshop-projects.ts`; the HTML and 3D readers stay in sync. No unprovided school, awards, employment, dates or project contributions are invented.

## Usage discipline

Build and check a complete batch locally, then push to main once. Do not publish the same batch to the reference branch. Keep project videos on demand; there are no new analytics scripts, external fonts, paid services, runtime APIs or background polling in this search update. Static delivery still counts against transfer and request allowances. Live quotas and account notifications must be checked in Vercel's Usage dashboard.
