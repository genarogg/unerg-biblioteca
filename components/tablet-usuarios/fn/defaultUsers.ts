export interface User {
  id: number
  nombre: string
  correo: string
  telefono: string
  cedula: string
  rol: "SUPER_USUARIO" | "EDITOR"
}

export const defaultUsers: User[] = [
  {
    id: 1,
    nombre: "Ana García Rodríguez",
    correo: "ana.garcia@empresa.com",
    telefono: "0412-1234567",
    cedula: "V-12345678",
    rol: "SUPER_USUARIO",
  },
  {
    id: 2,
    nombre: "Carlos Mendoza Silva",
    correo: "carlos.mendoza@empresa.com",
    telefono: "0414-2345678",
    cedula: "V-23456789",
    rol: "EDITOR",
  },
  {
    id: 3,
    nombre: "María Elena Vásquez",
    correo: "maria.vasquez@empresa.com",
    telefono: "0416-3456789",
    cedula: "V-34567890",
    rol: "SUPER_USUARIO",
  },
  {
    id: 4,
    nombre: "José Luis Hernández",
    correo: "jose.hernandez@empresa.com",
    telefono: "0424-4567890",
    cedula: "V-45678901",
    rol: "EDITOR",
  },
  {
    id: 5,
    nombre: "Carmen Rosa Pérez",
    correo: "carmen.perez@empresa.com",
    telefono: "0426-5678901",
    cedula: "V-56789012",
    rol: "SUPER_USUARIO",
  },
  {
    id: 6,
    nombre: "Roberto Antonio López",
    correo: "roberto.lopez@empresa.com",
    telefono: "0412-6789012",
    cedula: "V-67890123",
    rol: "EDITOR",
  },
  {
    id: 7,
    nombre: "Luisa Fernanda Torres",
    correo: "luisa.torres@empresa.com",
    telefono: "0414-7890123",
    cedula: "V-78901234",
    rol: "SUPER_USUARIO",
  },
  {
    id: 8,
    nombre: "Miguel Ángel Ramírez",
    correo: "miguel.ramirez@empresa.com",
    telefono: "0416-8901234",
    cedula: "V-89012345",
    rol: "EDITOR",
  },
  {
    id: 9,
    nombre: "Patricia Isabel Morales",
    correo: "patricia.morales@empresa.com",
    telefono: "0424-9012345",
    cedula: "V-90123456",
    rol: "SUPER_USUARIO",
  },
  {
    id: 10,
    nombre: "Fernando José Castro",
    correo: "fernando.castro@empresa.com",
    telefono: "0426-0123456",
    cedula: "V-01234567",
    rol: "EDITOR",
  },
  {
    id: 11,
    nombre: "Gabriela Alejandra Ruiz",
    correo: "gabriela.ruiz@empresa.com",
    telefono: "0412-1357924",
    cedula: "V-13579246",
    rol: "SUPER_USUARIO",
  },
  {
    id: 12,
    nombre: "Diego Sebastián Vargas",
    correo: "diego.vargas@empresa.com",
    telefono: "0414-2468135",
    cedula: "V-24681357",
    rol: "EDITOR",
  },
  {
    id: 13,
    nombre: "Valentina Sofía Jiménez",
    correo: "valentina.jimenez@empresa.com",
    telefono: "0416-3691470",
    cedula: "V-36914702",
    rol: "SUPER_USUARIO",
  },
  {
    id: 14,
    nombre: "Andrés Felipe Guerrero",
    correo: "andres.guerrero@empresa.com",
    telefono: "0424-4815926",
    cedula: "V-48159263",
    rol: "EDITOR",
  },
  {
    id: 15,
    nombre: "Isabella Victoria Medina",
    correo: "isabella.medina@empresa.com",
    telefono: "0426-5927384",
    cedula: "V-59273841",
    rol: "SUPER_USUARIO",
  },
  // Usuarios adicionales para demostrar paginación
  ...Array.from({ length: 15 }, (_, index) => ({
    id: 16 + index,
    nombre: `Usuario ${16 + index}`,
    correo: `usuario${16 + index}@empresa.com`,
    telefono: `041${(index % 4) + 2}-${String(1000000 + index).slice(1)}`,
    cedula: `V-${String(10000000 + index).slice(1)}`,
    rol: (index % 2 === 0 ? "SUPER_USUARIO" : "EDITOR") as "SUPER_USUARIO" | "EDITOR",
  })),
]
