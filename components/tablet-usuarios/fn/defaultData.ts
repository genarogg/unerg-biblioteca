import type { DataTable } from "../context/types"

const nombres = [
  "Ana", "Luis", "María", "Pedro", "Lucía", "Carlos", "Elena", "Jorge", "Laura", "Andrés",
  "Valentina", "Miguel", "Camila", "Sebastián", "Gabriela", "Ricardo", "Daniela", "Sofía",
  "Raúl", "Isabel"
]

const apellidos = [
  "Pérez", "González", "Rodríguez", "Fernández", "López", "Martínez", "Díaz", "Ramírez",
  "Torres", "Sánchez", "Morales", "Vargas", "Reyes", "Mendoza", "Silva", "Castillo"
]

const generarNombreCompleto = () => {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)]
  const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]
  return `${nombre} ${apellido}`
}

const generarCorreo = (nombreCompleto: string, i: number) => {
  const base = nombreCompleto.toLowerCase().replace(" ", ".")
  const dominio = ["gmail.com", "hotmail.com", "outlook.com", "unerg.edu.ve"][Math.floor(Math.random() * 4)]
  return `${base}${i}@${dominio}`
}

const generarCedula = () => `${Math.floor(10000000 + Math.random() * 90000000)}`

const defaultData: DataTable[] = [
  {
    id: 707,
    nombre: "Luisana Torres",
    correo: "luisana.torres@gmail.com",
    cedula: "24789123",
    rol: "super",
    status: "activo",
  },
  {
    id: 6,
    nombre: "Andrés Salazar",
    correo: "andres.salazar@outlook.com",
    cedula: "23156789",
    rol: "editor",
    status: "activo",
  },
  {
    id: 118,
    nombre: "Camila Fernández",
    correo: "camila.fernandez@hotmail.com",
    cedula: "25678123",
    rol: "estudiante",
    status: "inactivo",
  },
  {
    id: 3,
    nombre: "Ricardo Mendoza",
    correo: "ricardo.mendoza@gmail.com",
    cedula: "21456389",
    rol: "editor",
    status: "activo",
  },
  {
    id: 1,
    nombre: "Daniela Ríos",
    correo: "daniela.rios@unerg.edu.ve",
    cedula: "22558974",
    rol: "super",
    status: "activo",
  },
  // Usuarios adicionales generados aleatoriamente
  ...Array.from({ length: 25 }, (_, i) => {
    const nombreCompleto = generarNombreCompleto()
    return {
      id: 1000 + i,
      nombre: nombreCompleto,
      correo: generarCorreo(nombreCompleto, i),
      cedula: generarCedula(),
      rol: ["estudiante", "editor", "super"][Math.floor(Math.random() * 3)],
      status: ["activo", "inactivo"][Math.floor(Math.random() * 2)],
    }
  }),
]

export { defaultData }
