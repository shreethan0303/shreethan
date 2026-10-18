const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const site = require("../app/lib/site.ts");

function withDomain(value, run) {
  const previous = process.env.SITE_URL;
  if (value === undefined) delete process.env.SITE_URL;
  else process.env.SITE_URL = value;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
  }
}

test("an unpurchased domain is never assumed", () => {
  withDomain(undefined, () => {
    assert.equal(site.siteUrl(), undefined);
    const metadata = site.pageMetadata("Name", "Description", "/projects");
    assert.equal(metadata.alternates, undefined);
    assert.equal(metadata.openGraph.url, undefined);
  });
});

test("canonical and sharing URLs use the configured origin", () => {
  withDomain("https://portfolio.example", () => {
    const metadata = site.pageMetadata("Project", "Story", "/projects/rc-car");
    assert.equal(
      metadata.alternates.canonical,
      "https://portfolio.example/projects/rc-car",
    );
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  });
});

test("bad domain configuration fails rather than publishing misleading URLs", () => {
  for (const value of [
    "http://portfolio.example",
    "https://name:secret@portfolio.example",
    "https://portfolio.example/projects",
    "https://portfolio.example?preview=1",
    "https://portfolio.example#page",
    "not-a-url",
  ]) {
    withDomain(value, () => assert.throws(() => site.siteUrl()));
  }
});

test("preview and thin-page indexing safeguards hold", () => {
  assert.equal(
    site.pageMetadata("Placeholder", "Pending", "/resume", false).robots.index,
    false,
  );
  const result = execFileSync(
    process.execPath,
    [
      "-e",
      "const s=require('./app/lib/site.ts'); process.stdout.write(JSON.stringify(s.pageMetadata('Name','Description','/').robots));",
    ],
    {
      cwd: require("node:path").resolve(__dirname, ".."),
      env: {
        ...process.env,
        VERCEL_ENV: "preview",
        SITE_URL: "https://portfolio.example",
      },
      encoding: "utf8",
    },
  );
  assert.deepEqual(JSON.parse(result), { index: false, follow: true });
});

test("structured data cannot terminate its script element", () => {
  const value = { name: "</script><script>example</script>" };
  const serialized = site.jsonLd(value);
  assert(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), value);
});
