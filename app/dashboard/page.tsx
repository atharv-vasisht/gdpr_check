import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            GDPR QuickScan
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Paste a website URL to scan for GDPR compliance signals
          </p>
        </div>

        <ScanForm />

        <div>
          <h2 className="text-xl font-semibold mb-4">Previous Scans</h2>
          <ScanList scans={scans || []} />
        </div>
      </main>
    </div>
  );
}
