import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Scan {
  id: string;
  url: string;
  status: string;
  score: number | null;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 ring-1 ring-inset ring-green-200">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Complete
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
        Running
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 ring-1 ring-inset ring-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Error
      </span>
    );
  }
  return (
    <Badge variant="outline" className="text-[11px]">
      {status}
    </Badge>
  );
}

function ScorePill({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[13px] text-muted-foreground">—</span>;

  let bg = "bg-red-50 text-red-700 ring-red-200";
  if (score >= 80) bg = "bg-green-50 text-green-700 ring-green-200";
  else if (score >= 50) bg = "bg-yellow-50 text-yellow-700 ring-yellow-200";

  return (
    <span className={`inline-flex min-w-[3rem] justify-center rounded-md px-2 py-0.5 text-[12px] font-semibold tabular-nums ring-1 ring-inset ${bg}`}>
      {score}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-border">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/60">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <p className="text-[14px] font-medium text-foreground">No scans yet</p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Enter a URL above to run your first compliance scan.
      </p>
    </div>
  );
}

export function ScanList({ scans }: { scans: Scan[] }) {
  if (scans.length === 0) return <EmptyState />;

  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-[15px]">Scan History</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0 pt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-2.5 pl-6 pr-3 text-left">URL</th>
                <th className="px-3 pb-2.5 text-left">Status</th>
                <th className="px-3 pb-2.5 text-center">Score</th>
                <th className="pb-2.5 pl-3 pr-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr
                  key={scan.id}
                  className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="py-3 pl-6 pr-3">
                    <Link
                      href={`/scans/${scan.id}`}
                      className="block max-w-[320px] truncate text-[13px] font-medium text-foreground transition-colors group-hover:text-primary"
                    >
                      {scan.url.replace(/^https?:\/\//, "")}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={scan.status} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <ScorePill score={scan.score} />
                  </td>
                  <td className="py-3 pl-3 pr-6 text-right text-[13px] text-muted-foreground tabular-nums">
                    {new Date(scan.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
