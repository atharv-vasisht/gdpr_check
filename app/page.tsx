import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.05 9 11.25C17.25 22.05 21 17.25 21 12V7l-9-5z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReportIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Paste a URL",
    desc: "Enter any website address. We crawl the homepage and up to 5 internal pages automatically.",
  },
  {
    icon: ScanIcon,
    title: "AI-Powered Analysis",
    desc: "Our scanner checks for privacy policies, cookie banners, consent mechanisms, and data collection practices.",
  },
  {
    icon: ReportIcon,
    title: "Get Your Report",
    desc: "Receive a risk score, detailed findings with evidence snippets, and actionable recommendations.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-[13px] text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="text-[13px] rounded-lg shadow-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </Navbar>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,hsl(var(--primary)/0.06),transparent)]" />
          <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 text-center">
            <div className="animate-in mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Compliance signal scanner
            </div>
            <h1 className="animate-in stagger-1 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Spot GDPR compliance gaps{" "}
              <span className="text-primary">in&nbsp;seconds</span>
            </h1>
            <p className="animate-in stagger-2 mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              Paste any website URL and get an instant risk score with structured
              findings. We check for privacy policies, cookie consent, data
              collection practices, and user rights signals.
            </p>
            <div className="animate-in stagger-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="h-11 rounded-xl px-8 text-[15px] shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/25">
                  Start Scanning — Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-11 rounded-xl px-8 text-[15px]">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <div className="grid gap-10 md:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div key={i} className="group space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background shadow-sm transition-shadow group-hover:shadow-md">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-[15px] font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-t">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center">
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-4">
              {[
                ["5 pages", "Crawled per scan"],
                ["< 30s", "Average scan time"],
                ["6 checks", "Signal categories"],
                ["JSON", "Structured output"],
              ].map(([value, label], i) => (
                <div key={i}>
                  <p className="text-2xl font-bold tracking-tight">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            GDPR QuickScan — Compliance signal scanner. Not legal advice.
          </p>
          <p className="text-xs text-muted-foreground">
            Always consult a qualified professional for legal guidance.
          </p>
        </div>
      </footer>
    </div>
  );
}
