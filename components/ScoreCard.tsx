import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function ScoreCard({
  score,
  summary,
  url,
}: {
  score: number;
  summary: string;
  url: string;
}) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>GDPR Risk Score</span>
          <span className="text-sm font-normal text-muted-foreground truncate max-w-[300px]">
            {url}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                strokeWidth="10"
                className="stroke-muted"
              />
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={getScoreRingColor(score)}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {summary}
            </p>
            <p className="mt-3 text-xs text-muted-foreground italic">
              This is a compliance signal scan, not legal advice. Consult a
              qualified professional for legal guidance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
