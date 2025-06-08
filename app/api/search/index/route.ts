import { NextResponse } from "next/server"
import { addItemToIndex, resetSearchIndex } from "@/components/algolia/lib/data-service"
import type { SearchItem } from "@/components/algolia/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newItem: SearchItem = {
      id: body.id || crypto.randomUUID(),
      title: body.title,
      description: body.description || "",
      ...body,
    }

    addItemToIndex(newItem)

    return NextResponse.json({
      success: true,
      item: newItem,
    })
  } catch (error) {
    console.error("Error adding item to index:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    resetSearchIndex()

    return NextResponse.json({
      success: true,
      message: "Search index reset to default data",
    })
  } catch (error) {
    console.error("Error resetting index:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}
