import { NextResponse } from "next/server"
import { forceRefreshData } from "@/components/algolia/lib/data-service"

// This endpoint can be called by a cron job service like Vercel Cron
export async function GET() {
  try {
    // Verify this is being called at the right time (1 AM)
    const now = new Date()
    const hour = now.getHours()

    console.log(`🕐 Cron job triggered at ${now.toISOString()}`)

    // Only run between 1 AM and 2 AM to avoid multiple executions
    if (hour !== 1) {
      return NextResponse.json({
        skipped: true,
        message: `Cron job skipped - current hour is ${hour}, expected 1`,
        timestamp: now.toISOString(),
      })
    }

    const result = await forceRefreshData()

    console.log(`✅ Cron job completed - Source: ${result.source}, Items: ${result.itemCount}`)

    return NextResponse.json({
      success: true,
      source: result.source,
      itemCount: result.itemCount,
      timestamp: now.toISOString(),
      message: "Daily data refresh completed",
    })
  } catch (error) {
    console.error("❌ Cron job failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Cron job failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
