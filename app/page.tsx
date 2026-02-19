import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            GDPR QuickScan
          </span>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-24 text-center max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Spot GDPR compliance gaps
            <br />
            <span className="text-muted-foreground">in seconds</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Paste any website URL and get an instant risk score with structured
            findings. We check for privacy policies, cookie consent, data
            collection practices, and user rights signals.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base px-8">
                Log in
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-xs text-muted-foreground italic">
            This is a compliance signal scanner, not legal advice. Always
            consult a qualified professional for legal guidance.
          </p>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                1
              </div>
              <h3 className="font-semibold text-lg">Paste a URL</h3>
              <p className="text-sm text-muted-foreground">
                Enter any website address. We&apos;ll crawl the homepage and up
                to 5 internal pages.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                2
              </div>
              <h3 className="font-semibold text-lg">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our scanner checks for privacy policies, cookie banners, consent
                mechanisms, and data collection practices.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                3
              </div>
              <h3 className="font-semibold text-lg">Get Your Report</h3>
              <p className="text-sm text-muted-foreground">
                Receive a risk score, detailed findings with evidence snippets,
                and actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          GDPR QuickScan — Compliance signal scanner. Not legal advice.
        </div>
      </footer>
    </div>
  );
}
