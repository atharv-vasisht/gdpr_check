import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { ScanForm } from "@/components/ScanForm";
import { ScanList } from "@/components/ScanList";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: scans } = await supabase
    .from("scans")
    .select("id, url, status, score, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar href="/dashboard">
        <span className="hidden text-[13px] text-muted-foreground sm:block">
          {user.email}
        </span>
        <LogoutButton />
      </Navbar>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Scan websites for GDPR compliance signals and review past reports.
          </p>
        </div>

        <div className="space-y-8">
          <ScanForm />
          <ScanList scans={scans || []} />
        </div>
      </main>
    </div>
  );
}
