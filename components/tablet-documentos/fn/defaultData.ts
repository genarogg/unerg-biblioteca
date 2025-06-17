import type { DataTable } from "../context/types"

const defaultData: DataTable[] = [
  {
    id: 1,
    titulo: "Análisis de Algoritmos de Machine Learning en Agricultura",
    lineaInvestigacion: "Inteligencia Artificial",
    autor: "Dr. Miguel Reyes",
    estado: "VALIDADO",
  },
  {
    id: 2,
    titulo: "Implementación de Blockchain en Sistemas de Votación",
    lineaInvestigacion: "Ciberseguridad",
    autor: "Dra. Ana García",
    estado: "PENDIENTE",
  },
  {
    id: 3,
    titulo: "Desarrollo de Aplicaciones Móviles con React Native",
    lineaInvestigacion: "Desarrollo de Software",
    autor: "Ing. Carlos Mendoza",
    estado: "PENDIENTE",
  },
  {
    id: 4,
    titulo: "Optimización de Bases de Datos NoSQL",
    lineaInvestigacion: "Bases de Datos",
    autor: "Dr. Luis Fernández",
    estado: "VALIDADO",
  },
  {
    id: 5,
    titulo: "Redes Neuronales para Procesamiento de Imágenes",
    lineaInvestigacion: "Inteligencia Artificial",
    autor: "Dra. María López",
    estado: "PENDIENTE",
  },
  // Agregar más reportes para demostrar la paginación
  ...Array.from({ length: 45 }, (_, i) => ({
    id: 100 + i,
    titulo: `Reporte de Investigación ${i + 1}: ${["Análisis de Datos", "Desarrollo Web", "Inteligencia Artificial", "Ciberseguridad", "Redes"][i % 5]}`,
    lineaInvestigacion: [
      "Inteligencia Artificial",
      "Desarrollo de Software",
      "Ciberseguridad",
      "Bases de Datos",
      "Redes de Computadores",
    ][i % 5],
    autor: `Investigador ${String.fromCharCode(65 + (i % 26))}. ${["Pérez", "González", "Rodríguez", "Martínez", "Sánchez"][i % 5]}`,
    estado: i % 3 === 0 ? "VALIDADO" : ("PENDIENTE" as "PENDIENTE" | "VALIDADO"),
  })),
]

export { defaultData }
