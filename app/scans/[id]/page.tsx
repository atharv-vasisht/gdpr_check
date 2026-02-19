import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScoreCard } from "@/components/ScoreCard";
import { FindingsTable } from "@/components/FindingsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScanResult } from "@/lib/scanner/types";

export const dynamic = "force-dynamic";

export default async function ScanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: scan, error } = await supabase
    .from("scans")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !scan) {
    notFound();
  }

  const findings = scan.findings as ScanResult | null;

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            GDPR QuickScan
          </span>
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {scan.status === "error" && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Error</Badge>
                <span className="font-medium">Scan failed</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {scan.error || "An unknown error occurred during the scan."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                URL: {scan.url}
              </p>
            </CardContent>
          </Card>
        )}

        {scan.status === "running" && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="mt-4 font-medium">Scan in progress…</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crawling and analyzing {scan.url}
              </p>
            </CardContent>
          </Card>
        )}

        {scan.status === "done" && findings && (
          <>
            <ScoreCard
              score={scan.score ?? 0}
              summary={scan.summary ?? ""}
              url={scan.url}
            />

            <FindingsTable
              findings={findings.findings || []}
              limitations={findings.limitations}
            />
          </>
        )}

        <div className="text-center pt-4">
          <Link href="/dashboard">
            <Button variant="outline">Run Another Scan</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
