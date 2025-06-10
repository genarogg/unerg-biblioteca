// Definición de tipos para la configuración
export interface TableColumn {
  id: string
  header: string
  accessor: string
  sortable?: boolean
  hidden?: boolean
}

export interface TableConfig {
  select: boolean
  cuadricula: boolean
  columns: TableColumn[]
}

// Configuración por defecto de la tabla
const defaultConfig: TableConfig = {
  // Props de configuración
  select: true,
  cuadricula: false,

  // Columnas de la tabla
  columns: [
    {
      id: "id",
      header: "Id",
      accessor: "id",
      sortable: true,
    },
    {
      id: "nombre",
      header: "Nombre",
      accessor: "nombre",
      sortable: true,
    },
    {
      id: "correo",
      header: "Correo",
      accessor: "correo",
      sortable: true,
    },
    {
      id: "telefono",
      header: "Teléfono",
      accessor: "telefono",
      sortable: true,
    },
    {
      id: "cedula",
      header: "Cédula",
      accessor: "cedula",
      sortable: true,
    },
    {
      id: "rol",
      header: "Rol",
      accessor: "rol",
      sortable: true,
    },
    {
      id: "acciones",
      header: "Acciones",
      accessor: "",
      sortable: false,
    },
  ],
}

export default defaultConfig
