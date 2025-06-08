import { NextResponse } from "next/server"
import { searchItems } from "@/components/algolia/lib/data-service"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("query") || ""
  const limit = Number.parseInt(url.searchParams.get("limit") || "20")
  const category = url.searchParams.get("category")

  try {
    // Search with options
    const options: any = {
      limit,
      fields: ["title", "description", "tags", "category"],
      boost: { title: 2, description: 1, tags: 1.5, category: 1.2 },
      fuzzy: true,
      prefix: true,
    }

    let results = searchItems(query, options)

    // Apply category filter if provided
    if (category) {
      results = results.filter((item) => item.category && item.category.toLowerCase() === category.toLowerCase())
    }

    return NextResponse.json({
      results,
      total: results.length,
      query,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Error processing search request" }, { status: 500 })
  }
}
