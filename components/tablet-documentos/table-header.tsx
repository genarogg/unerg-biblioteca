"use client"

import { Search } from "lucide-react"
import "./css/table-header.css"

import AddDocumento from "./modal-crud/AddDocumento"
import AdministrarAreas from "./modal-crud/AdministrarAreas"
import type { UseResponsiveViewReturn } from "./useResponsiveView"

interface TableHeaderProps {
  title?: string
  searchTerm: string
  searchPlaceholder?: string
  onSearch: (term: string) => void
  onAddUser?: () => void
  addButtonText?: string
  showAddButton?: boolean
  // Nuevos props para filtros adicionales

  dateFrom?: string
  dateTo?: string
  onDateFromChange?: (date: string) => void
  onDateToChange?: (date: string) => void
  showStatusFilter?: boolean
  statusOptions?: { value: string; label: string }[]
  selectedStatus?: string
  onStatusChange?: (status: string) => void
  // Props para el toggle de vista responsive
  showViewToggle?: boolean
  responsiveViewState?: UseResponsiveViewReturn
  showAutoToggle?: boolean
}

export default function TableHeader({
  title = "Gestión de Documentos",
  searchTerm,
  searchPlaceholder = "Buscar documentos...",
  onSearch,
  dateFrom = "",
  dateTo = "",
  onDateFromChange,
  onDateToChange,
  showStatusFilter = false,
  statusOptions = [
    { value: "todos", label: "Todos" },
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ],
  selectedStatus = "todos",
  onStatusChange,
  showViewToggle = true,
  responsiveViewState,
  showAutoToggle = true,
}: TableHeaderProps) {
  return (
    <div className="table-header-container">
      {/* Título principal */}
      <div className="table-header-title-section">
        <h1 className="table-title">{title}</h1>
      </div>

      {/* Línea separadora */}
      <div className="table-header-divider"></div>

      {/* Controles */}
      <div className="table-header-controls-section">
        <div className="table-search-container">
          <Search className="table-search-icon" size={20} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="table-search-input"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* New Modal Buttons */}
        <div className="table-modal-buttons-container">
        <div className="modal-button-wrapper">
            <AdministrarAreas />
          </div>
          <div className="modal-button-wrapper">
            <AddDocumento />
          </div>
        
        </div>
      </div>
    </div>
  )
}
