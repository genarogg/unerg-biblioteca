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
  cuadricula: true,

  // Columnas de la tabla
  columns: [
    {
      id: "id",
      header: "ID",
      accessor: "id",
      sortable: true,
    },
    {
      id: "titulo",
      header: "Título",
      accessor: "titulo",
      sortable: true,
    },
    {
      id: "area",
      header: "Área",
      accessor: "area",
      sortable: true,
    },
    {
      id: "autor",
      header: "Autor",
      accessor: "autor",
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
