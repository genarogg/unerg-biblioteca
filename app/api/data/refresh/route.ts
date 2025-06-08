import { NextResponse } from "next/server"
import { forceRefreshData } from "@/components/algolia/lib/data-service"

export async function POST() {
  try {
    console.log("🔄 Manual data refresh requested")

    const result = await forceRefreshData()

    return NextResponse.json({
      success: result.success,
      source: result.source,
      itemCount: result.itemCount,
      timestamp: new Date().toISOString(),
      message: result.success
        ? "Data refreshed from external source"
        : "External source unavailable, using fallback data",
    })
  } catch (error) {
    console.error("Error refreshing data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { getCacheInfo } = await import("@/components/algolia/lib/data-service")
    const cacheInfo = getCacheInfo()

    return NextResponse.json({
      cacheInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting cache info:", error)
    return NextResponse.json({ error: "Failed to get cache info" }, { status: 500 })
  }
}
