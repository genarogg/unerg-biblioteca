import { NextResponse } from "next/server"
import { getSuggestions } from "@/components/algolia/lib/data-service"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("query") || ""

  try {
    const suggestions = getSuggestions(query)

    return NextResponse.json({
      suggestions,
      total: suggestions.length,
      query,
    })
  } catch (error) {
    console.error("Suggestions error:", error)
    return NextResponse.json({ error: "Error processing suggestions request" }, { status: 500 })
  }
}
