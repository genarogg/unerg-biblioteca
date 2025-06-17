import type { DataTable } from "../context/types"

const defaultData: DataTable[] = [
  {
    id: 707,
    nombre: "Miguel Reyes",
    correo: "reyesolivares2024@gmail.com",
    cedula: "17251549",
    rol: "super",
    status: "activo",
  },
  {
    id: 6,
    nombre: "Francisco Torrealba",
    correo: "franktorre180@gmail.com",
    cedula: "18972206",
    rol: "editor",
    status: "activo",
  },
  {
    id: 118,
    nombre: "Eyerlin Santana",
    correo: "santanaeyerlin@gmail.com",
    cedula: "16804638",
    rol: "estudiante",
    status: "inactivo",
  },
  {
    id: 3,
    nombre: "Carlos Villasmil",
    correo: "villasalavrez@gmail.com",
    cedula: "17062927",
    rol: "editor",
    status: "activo",
  },
  {
    id: 1,
    nombre: "Genaro Gonzalez",
    correo: "solicitudes@unerg.edu.ve",
    cedula: "12345678",
    rol: "super",
    status: "activo",
  },
  // Agregar más usuarios para demostrar la paginación
  ...Array.from({ length: 25 }, (_, i) => ({
    id: 1000 + i,
    nombre: `Usuario Ejemplo ${i + 1}`,
    correo: `usuario${i + 1}@ejemplo.com`,
    cedula: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    rol: ["estudiante", "editor", "super"][Math.floor(Math.random() * 3)],
    status: ["activo", "inactivo"][Math.floor(Math.random() * 2)],
  })),
]

export { defaultData }
