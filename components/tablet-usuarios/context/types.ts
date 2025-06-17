import type React from "react"
interface DataTable {
  id: number
  nombre: string
  correo: string
  telefono: string
  cedula: string
  rol: string
  [key: string]: any
}

interface TableColumn {
  id: string
  header: string
  accessor: string
  sortable?: boolean
  hidden?: boolean
}

interface TableConfig {
  select: boolean
  cuadricula: boolean
  columns: TableColumn[]
}

interface TableState {
  // Estados principales
  items: DataTable[]
  searchTerm: string
  currentPage: number
  selectedItems: number[]
  filteredItems: DataTable[]
  currentItems: DataTable[]
  totalPages: number
  itemsPerPage: number

  // Funciones de búsqueda
  handleSearch: (term: string) => void
  clearSearch: () => void

  // Funciones de paginación
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  getPageNumbers: () => (number | string)[]

  // Funciones de selección
  handleSelectItem: (itemId: number) => void
  handleSelectAll: () => void
  clearSelection: () => void
  selectAllItems: () => void
  getSelectAllState: () => "none" | "some" | "all"
  getSelectedItems: () => DataTable[]

  // Funciones de datos
  addItem: (newItem: DataTable) => void
  updateItem: (itemId: number, updatedItem: Partial<DataTable>) => void
  deleteItem: (itemId: number) => void
  deleteSelectedItems: () => void
  setItems: React.Dispatch<React.SetStateAction<DataTable[]>>

  // Funciones de configuración
  updateTableConfig: (newConfig: Partial<TableConfig>) => void
  updateItemsPerPage: (newItemsPerPage: number) => void

  // Información adicional
  hasItems: boolean
  hasFilteredItems: boolean
  selectedCount: number
  totalItems: number
  filteredCount: number
  dataLoading: boolean
  dataError: string | null
  refetchData: () => Promise<void>
  isUsingFallback: boolean
}

export type { DataTable, TableColumn, TableConfig, TableState }
