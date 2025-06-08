import { NextResponse } from "next/server"
import { getSearchData } from "@/components/algolia/lib/data-service"

interface CareerStat {
  categoria: string
  cantidad: number
  porcentaje: number
  color: string
}

export async function GET() {
  try {
    const { data } = await getSearchData()

    // Calculate statistics from the search data
    const totalItems = data.length

    // Group by careers
    const careerMap = new Map<string, number>()
    data.forEach((item) => {
      if (item.carrera) {
        const count = careerMap.get(item.carrera) || 0
        careerMap.set(item.carrera, count + 1)
      }
    })

    // Define colors for each career
    const careerColors = [
      "#8B5CF6", // Purple - Ingeniería de Sistemas
      "#EC4899", // Pink - Medicina
      "#06B6D4", // Cyan - Derecho
      "#10B981", // Emerald - Psicología
      "#F59E0B", // Amber - Administración de Empresas
      "#EF4444", // Red - Arquitectura
      "#6366F1", // Indigo - Contaduría Pública
      "#84CC16", // Lime - Enfermería
      "#F97316", // Orange - Ingeniería Civil
      "#8B5CF6", // Purple variant - Comunicación Social
    ]

    // Create career stats array
    const careerStats: CareerStat[] = Array.from(careerMap.entries())
      .map(([name, count], index) => ({
        categoria: name,
        cantidad: count,
        porcentaje: Math.round((count / totalItems) * 100),
        color: careerColors[index % careerColors.length],
      }))
      .sort((a, b) => b.cantidad - a.cantidad)

    // Add total items as first card with special styling
    const totalItemsStat: CareerStat = {
      categoria: "Total Trabajos",
      cantidad: totalItems,
      porcentaje: 100,
      color: "#7C3AED", // Main purple
    }

    const stats = {
      totalItems,
      careerStats: [totalItemsStat, ...careerStats],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error generating dashboard stats:", error)
    return NextResponse.json({ error: "Error generating dashboard statistics" }, { status: 500 })
  }
}
