"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Finding } from "@/lib/scanner/types";

function severityConfig(severity: string) {
  switch (severity) {
    case "high":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        ring: "ring-red-200",
        dot: "bg-red-500",
        icon: (
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case "medium":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        ring: "ring-yellow-200",
        dot: "bg-yellow-500",
        icon: (
          <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    default:
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        ring: "ring-green-200",
        dot: "bg-green-500",
        icon: (
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
  }
}

function FindingRow({ finding, defaultOpen }: { finding: Finding; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const config = severityConfig(finding.severity);

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30"
      >
        <div className="mt-0.5 flex-shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-medium">{finding.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
              {finding.severity}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {finding.category}
            </span>
          </div>
          {!open && (
            <p className="mt-1 truncate text-[13px] text-muted-foreground">
              {finding.description}
            </p>
          )}
        </div>
        <svg
          className={`mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="animate-in px-5 pb-5 pl-12">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {finding.description}
          </p>

          {finding.evidence.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Evidence
              </p>
              {finding.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/60 bg-muted/30 px-3.5 py-3"
                >
                  <p className="truncate text-[12px] font-medium text-muted-foreground">
                    {ev.url}
                  </p>
                  <p className="mt-1.5 text-[13px] italic text-foreground/80">
                    &ldquo;{ev.snippet}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-lg border border-primary/10 bg-primary/[0.03] px-3.5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/70">
              Recommendation
            </p>
            <p className="mt-1 text-[13px] leading-relaxed">{finding.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SeveritySummary({ findings }: { findings: Finding[] }) {
  const high = findings.filter((f) => f.severity === "high").length;
  const medium = findings.filter((f) => f.severity === "medium").length;
  const low = findings.filter((f) => f.severity === "low").length;

  return (
    <div className="flex items-center gap-4">
      {high > 0 && (
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          {high} high
        </span>
      )}
      {medium > 0 && (
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-yellow-600">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          {medium} medium
        </span>
      )}
      {low > 0 && (
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-600">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {low} low
        </span>
      )}
    </div>
  );
}

export function FindingsTable({
  findings,
  limitations,
}: {
  findings: Finding[];
  limitations?: string[];
}) {
  const highFindings = findings.filter((f) => f.severity === "high");
  const mediumFindings = findings.filter((f) => f.severity === "medium");
  const lowFindings = findings.filter((f) => f.severity === "low");
  const sorted = [...highFindings, ...mediumFindings, ...lowFindings];

  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[15px]">
            Findings
            <span className="ml-2 text-[13px] font-normal text-muted-foreground">
              ({findings.length})
            </span>
          </CardTitle>
          <SeveritySummary findings={findings} />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0 pt-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <svg className="mb-3 h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[14px] font-medium text-foreground">No findings</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              No compliance signal issues were detected.
            </p>
          </div>
        ) : (
          <div>{sorted.map((finding, i) => (
            <FindingRow key={i} finding={finding} defaultOpen={i < 2} />
          ))}</div>
        )}

        {limitations && limitations.length > 0 && (
          <div className="border-t border-border/40 bg-muted/20 px-5 py-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Scan Limitations
            </p>
            <ul className="space-y-1">
              {limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/40" />
                  {lim}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
