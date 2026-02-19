export type FindingCategory =
  | "Privacy Policy"
  | "Cookies/Consent"
  | "Data Collection"
  | "User Rights"
  | "Security/Transfers"
  | "Other";

export type Severity = "low" | "medium" | "high";

export interface Evidence {
  url: string;
  snippet: string;
}

export interface Finding {
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  evidence: Evidence[];
  recommendation: string;
}

export interface ScanResult {
  score: number;
  summary: string;
  findings: Finding[];
  limitations: string[];
}

export interface PageSignals {
  hasCookieBanner: boolean;
  hasPrivacyPolicyLink: boolean;
  hasForms: boolean;
  trackers: string[];
  cookieKeywords: string[];
  rightsKeywords: string[];
}

export interface ScannedPage {
  url: string;
  title: string;
  textExcerpt: string;
  signals: PageSignals;
}

export interface EvidenceBundle {
  inputUrl: string;
  scannedPages: ScannedPage[];
  discoveredPolicyLinks: string[];
}
