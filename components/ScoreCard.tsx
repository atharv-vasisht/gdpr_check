import { Card, CardContent } from "@/components/ui/card";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Low Risk Signals";
  if (score >= 50) return "Moderate Risk Signals";
  if (score >= 20) return "Significant Risk Signals";
  return "Major Risk Signals";
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return "stroke-green-500";
  if (score >= 50) return "stroke-yellow-500";
  return "stroke-red-500";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 50) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
}

export function ScoreCard({
  score,
  summary,
  url,
}: {
  score: number;
  summary: string;
  url: string;
}) {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col items-center gap-8 p-8 sm:flex-row sm:items-start">
          {/* Score ring */}
          <div className={`flex-shrink-0 rounded-2xl border p-5 ${getScoreBg(score)}`}>
            <div className="relative">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r="52"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-black/5"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="52"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className={`${getScoreRingColor(score)} transition-all duration-1000 ease-out`}
                  transform="rotate(-90 65 65)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold tabular-nums ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  out of 100
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                GDPR Risk Score
              </h2>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                score >= 80
                  ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
                  : score >= 50
                  ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200"
                  : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
              }`}>
                {getScoreLabel(score)}
              </span>
            </div>

            <p className="mt-1 text-[13px] text-muted-foreground truncate">
              {url}
            </p>

            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              {summary}
            </p>

            <div className="mt-5 rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-[12px] text-muted-foreground">
                <span className="font-medium">Disclaimer:</span>{" "}
                This is a compliance signal scan, not legal advice. Consult a
                qualified professional for legal guidance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
