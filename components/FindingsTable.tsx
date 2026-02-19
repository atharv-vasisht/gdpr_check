import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Finding } from "@/lib/scanner/types";

function SeverityBadge({ severity }: { severity: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  };

  return (
    <Badge variant={variants[severity] || "outline"}>
      {severity}
    </Badge>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="outline" className="text-xs">
      {category}
    </Badge>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div className="space-y-3 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severity={finding.severity} />
          <CategoryBadge category={finding.category} />
          <h3 className="font-medium">{finding.title}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{finding.description}</p>

      {finding.evidence.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Evidence
          </p>
          {finding.evidence.map((ev, i) => (
            <div
              key={i}
              className="rounded-md bg-muted/50 p-3 text-sm border border-border"
            >
              <p className="text-xs text-muted-foreground mb-1 truncate">
                {ev.url}
              </p>
              <p className="text-foreground italic">&ldquo;{ev.snippet}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-md bg-primary/5 p-3 text-sm">
        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Recommendation
        </p>
        <p>{finding.recommendation}</p>
      </div>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Findings</span>
          <span className="text-sm font-normal text-muted-foreground">
            {findings.length} finding{findings.length !== 1 ? "s" : ""}
            {highFindings.length > 0 && (
              <span className="ml-2 text-destructive">
                ({highFindings.length} high severity)
              </span>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No findings to display.
          </p>
        ) : (
          <div className="divide-y">
            {sorted.map((finding, index) => (
              <FindingCard key={index} finding={finding} />
            ))}
          </div>
        )}

        {limitations && limitations.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Scan Limitations
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
