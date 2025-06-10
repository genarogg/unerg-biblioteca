interface User {
  id: number
  nombre: string
  correo: string
  telefono: string
  cedula: string
  rol: string
  [key: string]: any
}

const defaultUsers: User[] = [
  {
    id: 1,
    nombre: "Ana García Rodríguez",
    correo: "ana.garcia@empresa.com",
    telefono: "04141234567",
    cedula: "12345678",
    rol: "ADMIN_DACE",
  },
  {
    id: 2,
    nombre: "Carlos Mendoza Silva",
    correo: "carlos.mendoza@empresa.com",
    telefono: "04267891234",
    cedula: "23456789",
    rol: "ADMIN_FUNDESUR",
  },
  {
    id: 3,
    nombre: "María Elena Vásquez",
    correo: "maria.vasquez@empresa.com",
    telefono: "04125678901",
    cedula: "34567890",
    rol: "SUPER_USUARIO",
  },
  {
    id: 4,
    nombre: "José Luis Herrera",
    correo: "jose.herrera@empresa.com",
    telefono: "04243456789",
    cedula: "45678901",
    rol: "ADMIN_DACE",
  },
  {
    id: 5,
    nombre: "Laura Patricia Morales",
    correo: "laura.morales@empresa.com",
    telefono: "04169876543",
    cedula: "56789012",
    rol: "ADMIN_FUNDESUR",
  },
  // Agregar más usuarios para demostrar la paginación
  ...Array.from({ length: 25 }, (_, i) => ({
    id: 100 + i,
    nombre: `Usuario Demo ${i + 1}`,
    correo: `usuario.demo${i + 1}@empresa.com`,
    telefono: `04${Math.floor(10000000 + Math.random() * 90000000)}`,
    cedula: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    rol: ["ADMIN_DACE", "ADMIN_FUNDESUR", "SUPER_USUARIO"][Math.floor(Math.random() * 3)],
  })),
]

interface Document {
  id: number
  titulo: string
  area: string
  autor: string
  [key: string]: any
}

const defaultDocuments: Document[] = [
  {
    id: 1,
    titulo: "Estrategias de Marketing Digital para PyMEs",
    area: "Marketing",
    autor: "Dra. Ana García Rodríguez",
  },
  {
    id: 2,
    titulo: "Implementación de Blockchain en Sistemas Financieros",
    area: "Fintech",
    autor: "Ing. Carlos Mendoza Silva",
  },
  {
    id: 3,
    titulo: "Sostenibilidad Ambiental en la Industria Manufacturera",
    area: "Medio Ambiente",
    autor: "Dra. María Elena Vásquez",
  },
  {
    id: 4,
    titulo: "Análisis de Big Data en el Sector Salud",
    area: "Salud Digital",
    autor: "Dr. José Luis Herrera",
  },
  {
    id: 5,
    titulo: "Innovación en Energías Renovables",
    area: "Energía",
    autor: "Ing. Laura Patricia Morales",
  },
  {
    id: 6,
    titulo: "Transformación Digital en Recursos Humanos",
    area: "Recursos Humanos",
    autor: "Lic. Roberto Fernández",
  },
  {
    id: 7,
    titulo: "Ciberseguridad en el Internet de las Cosas",
    area: "Ciberseguridad",
    autor: "Dr. Patricia López",
  },
  {
    id: 8,
    titulo: "Metodologías Ágiles en Gestión de Proyectos",
    area: "Gestión",
    autor: "Ing. Miguel Torres",
  },
  {
    id: 9,
    titulo: "Inteligencia Artificial en la Educación",
    area: "Educación",
    autor: "Dra. Carmen Ruiz",
  },
  {
    id: 10,
    titulo: "E-commerce y Comercio Electrónico Post-Pandemia",
    area: "Comercio Digital",
    autor: "Lic. Fernando Castro",
  },
  // Agregar más documentos para demostrar la paginación
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 50 + i,
    titulo: `Investigación Avanzada en ${["Biotecnología", "Nanotecnología", "Robótica", "Automatización", "Telecomunicaciones"][Math.floor(Math.random() * 5)]} ${i + 1}`,
    area: ["Tecnología", "Ciencias", "Ingeniería", "Innovación", "Desarrollo"][Math.floor(Math.random() * 5)],
    autor: `Dr. Investigador ${i + 1}`,
  })),
]

export { defaultUsers, defaultDocuments }
export type { User, Document }
