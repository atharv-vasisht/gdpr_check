import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { ScoreCard } from "@/components/ScoreCard";
import { FindingsTable } from "@/components/FindingsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen bg-muted/20">
      <Navbar href="/dashboard">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="h-8 text-[13px] text-muted-foreground hover:text-foreground">
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Button>
        </Link>
      </Navbar>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Link href="/dashboard" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-foreground">Scan Report</span>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            GDPR Compliance Signal Report
          </h1>
          {scan.completed_at && (
            <p className="mt-1 text-[13px] text-muted-foreground">
              Completed {new Date(scan.completed_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        {/* Error state */}
        {scan.status === "error" && (
          <Card className="border-red-200 bg-red-50/50 shadow-sm">
            <CardContent className="flex items-start gap-3 p-6">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-red-800">Scan Failed</h2>
                <p className="mt-1 text-[13px] text-red-700">
                  {scan.error || "An unknown error occurred during the scan."}
                </p>
                <p className="mt-2 text-[13px] text-red-600/70">
                  Target: {scan.url}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Running state */}
        {scan.status === "running" && (
          <Card className="shadow-sm border-border/60">
            <CardContent className="flex flex-col items-center py-20">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
              </div>
              <p className="mt-6 text-[15px] font-medium">Scan in progress</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Crawling and analyzing{" "}
                <span className="font-medium text-foreground">
                  {scan.url.replace(/^https?:\/\//, "")}
                </span>
              </p>
              <p className="mt-4 text-[12px] text-muted-foreground">
                This typically takes 10–30 seconds. Refresh the page to check for results.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Done state */}
        {scan.status === "done" && findings && (
          <div className="space-y-6">
            <ScoreCard
              score={scan.score ?? 0}
              summary={scan.summary ?? ""}
              url={scan.url}
            />
            <FindingsTable
              findings={findings.findings || []}
              limitations={findings.limitations}
            />
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-10 flex justify-center">
          <Link href="/dashboard">
            <Button variant="outline" className="h-9 rounded-lg text-[13px]">
              <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Run Another Scan
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
