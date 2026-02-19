import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crawlSite } from "@/lib/scanner/crawl";
import { extractPages } from "@/lib/scanner/extract";
import { evaluateBundle } from "@/lib/scanner/evaluate";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const normalizedUrl = parsedUrl.href;

    const { data: scan, error: insertError } = await supabase
      .from("scans")
      .insert({
        user_id: user.id,
        url: normalizedUrl,
        status: "running",
      })
      .select()
      .single();

    if (insertError || !scan) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create scan" },
        { status: 500 }
      );
    }

    try {
      const crawlResult = await crawlSite(normalizedUrl);
      const bundle = extractPages(
        crawlResult.pages,
        crawlResult.discoveredPolicyLinks,
        normalizedUrl
      );
      const result = await evaluateBundle(bundle);

      await supabase
        .from("scans")
        .update({
          status: "done",
          score: result.score,
          summary: result.summary,
          findings: result as unknown as Record<string, unknown>,
          completed_at: new Date().toISOString(),
        })
        .eq("id", scan.id);

      return NextResponse.json({
        id: scan.id,
        status: "done",
        score: result.score,
        summary: result.summary,
        findings: result,
      });
    } catch (scanError) {
      const message =
        scanError instanceof Error ? scanError.message : "Scan failed";
      console.error("Scan error:", scanError);

      await supabase
        .from("scans")
        .update({
          status: "error",
          error: message,
        })
        .eq("id", scan.id);

      return NextResponse.json(
        {
          id: scan.id,
          status: "error",
          error: message,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
