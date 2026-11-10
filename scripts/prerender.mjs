// Prerenders every public page of the built SPA into static HTML so search
// engines, AI crawlers and social previews see real content.
//
// Usage: node scripts/prerender.mjs   (run after `vite build`)
// Env:   CHROME_PATH   optional path to a Chrome/Chromium binary
//        SITE_URL      canonical origin (default https://kundalinidentalclinic.com.np)
//
// Output: dist/index.html, dist/<route>.html (Cloudflare Pages / Apache style),
//         dist/404.html, dist/sitemap.xml

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const DIST = path.resolve("dist");
const SITE_URL = (process.env.SITE_URL || "https://kundalinidentalclinic.com.np").replace(/\/$/, "");
const PORT = 4789;
const ORIGIN = `http://127.0.0.1:${PORT}`;

// Seeds; everything else is discovered by following internal links.
const SEEDS = [
  "/", "/services", "/about", "/doctors", "/dental-tourism", "/pricing",
  "/reviews", "/contact", "/faq", "/privacy", "/terms", "/refund",
];
const EXCLUDE = [/^\/admin/, /^\/api/];
const MAX_PAGES = 300;

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
// Untouched app shell for client-side-only routes such as /admin.
fs.writeFileSync(path.join(DIST, "app-shell.html"), template);

const MIME = {
  ".js": "text/javascript", ".css": "text/css", ".html": "text/html",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon",
  ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml",
  ".woff2": "font/woff2",
};

// Static server with SPA fallback that always serves the ORIGINAL template,
// never a prerendered file, so every page renders from a clean state.
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, ORIGIN).pathname);
  const file = path.join(DIST, urlPath);
  if (urlPath !== "/" && file.startsWith(DIST) && fs.existsSync(file) && fs.statSync(file).isFile()
      && !file.endsWith(".html")) {
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(template);
});

function normalise(href) {
  try {
    const u = new URL(href, ORIGIN);
    if (u.origin !== ORIGIN && u.origin !== SITE_URL) return null;
    let p = u.pathname.replace(/\/+$/, "") || "/";
    if (path.extname(p)) return null;
    if (EXCLUDE.some((re) => re.test(p))) return null;
    return p;
  } catch {
    return null;
  }
}

function outFile(route) {
  if (route === "/") return path.join(DIST, "index.html");
  return path.join(DIST, `${route.slice(1)}.html`);
}

async function renderRoute(page, route) {
  await page.goto(ORIGIN + route, { waitUntil: "networkidle", timeout: 60000 });
  // Scroll through the page so scroll-triggered animations (framer-motion
  // whileInView) reach their visible state before the snapshot.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  // Give React Query / Helmet / animations a moment to settle.
  await page.waitForTimeout(800);
  return page.evaluate(() => {
    const robots = document.querySelector('meta[name="robots"][data-rh]')?.getAttribute("content") || "";
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    // Entrance animations start hidden; make the static HTML fully visible.
    // The live app re-renders on load, so users still see the animations.
    document.querySelectorAll('[style*="opacity"]').forEach((el) => {
      if (el.style.opacity === "0") {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      }
    });
    // Drop runtime-only nodes so the snapshot stays clean.
    document.querySelectorAll('script:not([type="application/ld+json"]):not([data-keep]), link[rel="modulepreload"]')
      .forEach((n) => { if (!n.hasAttribute("data-template")) n.remove(); });
    return { html: "<!doctype html>\n" + document.documentElement.outerHTML, robots, links };
  });
}

// Puts the template's original <script> tags (entry bundle, analytics) back
// in, since the snapshot strips every executable script.
function restoreScripts(html) {
  const scripts = template.match(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g) || [];
  return html.replace("</head>", scripts.join("\n") + "\n</head>");
}

// Remove template meta tags that Helmet has overridden, to avoid duplicates.
function dedupeHead(html) {
  const keyOf = (tag) => {
    const m = tag.match(/\b(name|property)="([^"]+)"/);
    if (m) return `${m[1]}:${m[2]}`;
    if (/rel="canonical"/.test(tag)) return "canonical";
    return null;
  };
  const tags = html.match(/<(meta|link)\b[^>]*>/g) || [];
  const helmetKeys = new Set(tags.filter((t) => /data-rh="true"/.test(t)).map(keyOf).filter(Boolean));
  const seen = new Set();
  // Walk from the end so the Helmet tag (added last) wins.
  const keep = new Set();
  for (const t of [...tags].reverse()) {
    const k = keyOf(t);
    if (!k) { keep.add(t); continue; }
    if (seen.has(k)) continue;
    if (helmetKeys.has(k) && !/data-rh="true"/.test(t)) continue;
    seen.add(k);
    keep.add(t);
  }
  return html.replace(/<(meta|link)\b[^>]*>/g, (t) => (keep.has(t) ? t : ""));
}

async function main() {
  await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    channel: process.env.CHROME_PATH ? undefined : "chrome",
  });
  const context = await browser.newContext({ userAgent: "KundaliniPrerender/1.0", viewport: { width: 1280, height: 900 } });
  // Never fire analytics or load the chat widget during prerender.
  await context.route(/google-analytics\.com|googletagmanager\.com|doubleclick\.net/, (r) => r.abort());
  await context.addInitScript(() => { window.__PRERENDER__ = true; });
  const page = await context.newPage();

  const queue = [...SEEDS];
  const done = new Set();
  const indexable = [];
  const failures = [];

  while (queue.length && done.size < MAX_PAGES) {
    const route = queue.shift();
    if (done.has(route)) continue;
    done.add(route);
    try {
      const { html, robots, links } = await renderRoute(page, route);
      if (/noindex/.test(robots)) {
        // A page we reached by following an internal link should never be a
        // 404. This catches broken links and, in CI, a database outage that
        // would otherwise silently drop pages from the site.
        if (!SEEDS.includes(route) && !process.env.PRERENDER_ALLOW_MISSING) {
          failures.push(route);
          console.error(`FAIL  ${route}: linked page rendered as 404/noindex`);
        } else {
          console.log(`skip  ${route} (noindex)`);
        }
        continue;
      }
      const final = restoreScripts(dedupeHead(html));
      const out = outFile(route);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, final);
      indexable.push(route);
      console.log(`ok    ${route}`);
      for (const l of links) {
        const n = normalise(l);
        if (n && !done.has(n) && !queue.includes(n)) queue.push(n);
      }
    } catch (e) {
      failures.push(route);
      console.error(`FAIL  ${route}: ${e.message}`);
    }
  }

  // Real 404 page for unknown URLs (Cloudflare Pages serves 404.html with status 404).
  const nf = await renderRoute(page, "/__not-found__");
  fs.writeFileSync(path.join(DIST, "404.html"), restoreScripts(dedupeHead(nf.html)));

  // Fresh sitemap from what actually rendered as indexable.
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable.sort().map((r) => `  <url><loc>${SITE_URL}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);

  await browser.close();
  server.close();
  console.log(`\nPrerendered ${indexable.length} pages, ${failures.length} failures.`);
  if (failures.length) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
