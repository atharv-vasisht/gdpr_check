import type { EvidenceBundle, ScanResult } from "./types";

const SYSTEM_PROMPT = `You are a GDPR compliance signal scanner. You analyze website evidence bundles and produce structured findings.

IMPORTANT DISCLAIMERS:
- This is NOT legal advice. You are identifying signals, not making legal determinations.
- Label everything as "signals" and note limitations honestly.
- Be helpful and specific, but never claim certainty about compliance status.

Analyze the provided evidence bundle and return a JSON object with this exact schema:
{
  "score": <number 0-100, where 0 = many risk signals, 100 = few risk signals>,
  "summary": "<max 80 words summarizing key findings>",
  "findings": [
    {
      "category": "<one of: Privacy Policy, Cookies/Consent, Data Collection, User Rights, Security/Transfers, Other>",
      "severity": "<low|medium|high>",
      "title": "<short title>",
      "description": "<what was found or not found>",
      "evidence": [{"url": "<page URL>", "snippet": "<relevant text snippet from the site, max 200 chars>"}],
      "recommendation": "<actionable suggestion>"
    }
  ],
  "limitations": ["<things the scanner could not check>"]
}

SCORING GUIDE:
- 80-100: Few risk signals found; basic compliance signals present
- 50-79: Some gaps or missing signals
- 20-49: Significant gaps in compliance signals
- 0-19: Major compliance signals missing

CHECK FOR THESE SIGNALS:
A) Privacy Policy: presence, controller identity, contact info, purposes, lawful basis, retention, sharing, transfers, rights mentions, complaint authority
B) Cookie Consent: banner present, manage preferences option, categories, non-essential scripts before consent
C) Data Collection: forms present, consent/purpose near forms, "Do not sell/share" links
D) User Rights: access/deletion/rectification/portability/objection mentions, contact method for requests
E) Security/Transfers: HTTPS, mentions of international transfers, data protection measures

Return ONLY valid JSON. No markdown, no explanation outside the JSON.`;

export async function evaluateBundle(bundle: EvidenceBundle): Promise<ScanResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const compactBundle = {
    input_url: bundle.inputUrl,
    scanned_pages: bundle.scannedPages.map((p) => ({
      url: p.url,
      title: p.title,
      text_excerpt: p.textExcerpt.slice(0, 3000),
      signals: p.signals,
    })),
    discovered_policy_links: bundle.discoveredPolicyLinks,
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions: SYSTEM_PROMPT,
      input: `Analyze this website evidence bundle and return the JSON assessment:\n\n${JSON.stringify(compactBundle, null, 2)}`,
      text: {
        format: {
          type: "json_schema",
          name: "gdpr_scan_result",
          schema: {
            type: "object",
            properties: {
              score: { type: "number" },
              summary: { type: "string" },
              findings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: {
                      type: "string",
                      enum: [
                        "Privacy Policy",
                        "Cookies/Consent",
                        "Data Collection",
                        "User Rights",
                        "Security/Transfers",
                        "Other",
                      ],
                    },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                    title: { type: "string" },
                    description: { type: "string" },
                    evidence: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          url: { type: "string" },
                          snippet: { type: "string" },
                        },
                        required: ["url", "snippet"],
                        additionalProperties: false,
                      },
                    },
                    recommendation: { type: "string" },
                  },
                  required: [
                    "category",
                    "severity",
                    "title",
                    "description",
                    "evidence",
                    "recommendation",
                  ],
                  additionalProperties: false,
                },
              },
              limitations: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["score", "summary", "findings", "limitations"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  const outputText =
    data.output?.find((o: { type: string }) => o.type === "message")
      ?.content?.find((c: { type: string }) => c.type === "output_text")
      ?.text;

  if (!outputText) {
    throw new Error("No text output from OpenAI Responses API");
  }

  const result: ScanResult = JSON.parse(outputText);

  result.score = Math.max(0, Math.min(100, Math.round(result.score)));

  return result;
}
