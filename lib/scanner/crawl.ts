import { chromium, type Browser, type Page } from "playwright";

const POLICY_PATH_PATTERNS = [
  /\/privac/i,
  /\/cookie/i,
  /\/terms/i,
  /\/legal/i,
  /\/gdpr/i,
  /\/data-protection/i,
  /\/impressum/i,
];

const MAX_PAGES = 5;
const PAGE_TIMEOUT = 15_000;

export interface CrawlResult {
  pages: { url: string; html: string; title: string }[];
  discoveredPolicyLinks: string[];
}

export async function crawlSite(inputUrl: string): Promise<CrawlResult> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      javaScriptEnabled: true,
    });

    const baseUrl = new URL(inputUrl);
    const visited = new Set<string>();
    const results: { url: string; html: string; title: string }[] = [];
    const policyLinks: string[] = [];

    const loadPage = async (url: string): Promise<{ html: string; title: string } | null> => {
      const page: Page = await context.newPage();
      try {
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: PAGE_TIMEOUT,
        });
        await page.waitForTimeout(2000);
        const html = await page.content();
        const title = await page.title();
        return { html, title };
      } catch {
        return null;
      } finally {
        await page.close();
      }
    };

    const homepageResult = await loadPage(inputUrl);
    if (!homepageResult) {
      throw new Error(`Failed to load ${inputUrl}`);
    }

    visited.add(baseUrl.pathname);
    results.push({ url: inputUrl, html: homepageResult.html, title: homepageResult.title });

    const linkRegex = /href=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;
    const candidateLinks: string[] = [];

    while ((match = linkRegex.exec(homepageResult.html)) !== null) {
      try {
        const href = match[1];
        const resolved = new URL(href, inputUrl);

        if (resolved.hostname !== baseUrl.hostname) continue;

        const isPolicy = POLICY_PATH_PATTERNS.some((p) => p.test(resolved.pathname));
        if (isPolicy && !policyLinks.includes(resolved.href)) {
          policyLinks.push(resolved.href);
        }
        if (isPolicy && !visited.has(resolved.pathname)) {
          candidateLinks.unshift(resolved.href);
        } else if (!visited.has(resolved.pathname)) {
          candidateLinks.push(resolved.href);
        }
      } catch {
        // invalid URL
      }
    }

    const uniqueCandidates: string[] = [];
    const seenPaths = new Set<string>();
    for (const link of candidateLinks) {
      const path = new URL(link).pathname;
      if (!seenPaths.has(path) && !visited.has(path)) {
        seenPaths.add(path);
        uniqueCandidates.push(link);
      }
    }

    for (const link of uniqueCandidates.slice(0, MAX_PAGES - 1)) {
      const path = new URL(link).pathname;
      if (visited.has(path)) continue;
      visited.add(path);

      const result = await loadPage(link);
      if (result) {
        results.push({ url: link, html: result.html, title: result.title });
      }
    }

    return { pages: results, discoveredPolicyLinks: policyLinks };
  } finally {
    if (browser) await browser.close();
  }
}
