import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Scan {
  id: string;
  url: string;
  status: string;
  score: number | null;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    done: "default",
    running: "secondary",
    queued: "outline",
    error: "destructive",
  };

  return (
    <Badge variant={variants[status] || "outline"}>
      {status}
    </Badge>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-muted-foreground">—</span>;

  let color = "text-red-600";
  if (score >= 80) color = "text-green-600";
  else if (score >= 50) color = "text-yellow-600";

  return <span className={`font-bold ${color}`}>{score}/100</span>;
}

export function ScanList({ scans }: { scans: Scan[] }) {
  if (scans.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No scans yet. Enter a URL above to start your first scan.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scans.map((scan) => (
          <TableRow key={scan.id}>
            <TableCell>
              <Link
                href={`/scans/${scan.id}`}
                className="text-primary hover:underline font-medium"
              >
                {scan.url}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge status={scan.status} />
            </TableCell>
            <TableCell>
              <ScoreBadge score={scan.score} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(scan.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
