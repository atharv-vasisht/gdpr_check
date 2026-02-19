import type { ScannedPage, PageSignals, EvidenceBundle } from "./types";

const COOKIE_KEYWORDS = [
  "cookies",
  "consent",
  "preferences",
  "accept all",
  "reject all",
  "accept cookies",
  "cookie settings",
  "manage cookies",
  "cookie policy",
  "cookie notice",
];

const RIGHTS_KEYWORDS = [
  "right to access",
  "right to erasure",
  "right to deletion",
  "right to rectification",
  "right to portability",
  "right to object",
  "data subject",
  "withdraw consent",
  "do not sell",
  "do not share",
  "opt out",
  "request deletion",
  "request access",
];

const TRACKER_PATTERNS = [
  "google-analytics",
  "googletagmanager",
  "gtag(",
  "ga(",
  "fbq(",
  "facebook.net",
  "segment.com",
  "segment.io",
  "hotjar",
  "doubleclick",
  "adsbygoogle",
  "clarity.ms",
];

const PRIVACY_LINK_PATTERNS = [
  /privacy\s*policy/i,
  /data\s*protection/i,
  /privacy\s*notice/i,
  /privacy\s*statement/i,
];

const MAX_TEXT_LENGTH = 4000;

function stripHtmlToText(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length > MAX_TEXT_LENGTH) {
    text = text.slice(0, MAX_TEXT_LENGTH) + "…";
  }
  return text;
}

function findKeywords(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw.toLowerCase()));
}

function detectTrackers(html: string): string[] {
  const lower = html.toLowerCase();
  return TRACKER_PATTERNS.filter((t) => lower.includes(t.toLowerCase()));
}

function hasFormElements(html: string): boolean {
  return /<form[\s>]/i.test(html) &&
    (/<input[^>]+type=["']?(email|text|tel)/i.test(html) ||
     /<input[^>]+name=["']?(email|name|phone)/i.test(html));
}

function hasPrivacyPolicyLink(html: string): boolean {
  return PRIVACY_LINK_PATTERNS.some((p) => p.test(html));
}

function hasCookieBannerSignals(html: string): boolean {
  const lower = html.toLowerCase();
  const bannerKeywords = [
    "cookie-banner",
    "cookie-consent",
    "cookie-notice",
    "cookieconsent",
    "cookie_banner",
    "cc-banner",
    "consent-banner",
    "gdpr-banner",
  ];
  const hasMarker = bannerKeywords.some((kw) => lower.includes(kw));
  const hasCookieText = lower.includes("we use cookies") ||
    lower.includes("this website uses cookies") ||
    lower.includes("this site uses cookies");

  return hasMarker || hasCookieText;
}

function extractSignals(html: string, text: string): PageSignals {
  return {
    hasCookieBanner: hasCookieBannerSignals(html),
    hasPrivacyPolicyLink: hasPrivacyPolicyLink(html),
    hasForms: hasFormElements(html),
    trackers: detectTrackers(html),
    cookieKeywords: findKeywords(text, COOKIE_KEYWORDS),
    rightsKeywords: findKeywords(text, RIGHTS_KEYWORDS),
  };
}

export function extractPages(
  crawlResults: { url: string; html: string; title: string }[],
  discoveredPolicyLinks: string[],
  inputUrl: string
): EvidenceBundle {
  const scannedPages: ScannedPage[] = crawlResults.map((page) => {
    const text = stripHtmlToText(page.html);
    const signals = extractSignals(page.html, text);

    return {
      url: page.url,
      title: page.title || "Untitled",
      textExcerpt: text,
      signals,
    };
  });

  return {
    inputUrl,
    scannedPages,
    discoveredPolicyLinks,
  };
}
