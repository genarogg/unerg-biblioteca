"use client"

import { useState } from "react"
import "./css/user-management-table.css"

import { Edit, Eye, Check, Minus, FileText, Info } from "lucide-react"
import defaultConfig, { type TableConfig } from "./config"
import { useTable, type UseTableReturn } from "./useTable"
import type { Document } from "./fn/defaultUsers"
import { useResponsiveView } from "./useResponsiveView"
import TableHeader from "./table-header"
import TablePagination from "./pagination/table-pagination"
import TableCardView from "./table-card-view"

interface DocumentManagementTableProps {
  config?: Partial<TableConfig>
  tableState?: UseTableReturn
  onAddDocument?: () => void
  onEditDocument?: (doc: Document) => void
  onViewDocument?: (doc: Document) => void
  onViewPdf?: (doc: Document) => void
  onViewDetails?: (doc: Document) => void
  onSelectDocument?: (doc: Document) => void
  // Props para personalizar el header
  title?: string
  searchPlaceholder?: string
  addButtonText?: string
  showAddButton?: boolean

  // Props para filtros adicionales
  dateFrom?: string
  dateTo?: string
  onDateFromChange?: (date: string) => void
  onDateToChange?: (date: string) => void
  showStatusFilter?: boolean
  statusOptions?: { value: string; label: string }[]
  selectedStatus?: string
  onStatusChange?: (status: string) => void
  // Props para personalizar la paginación
  showPaginationInfo?: boolean
  paginationInfoText?: string
  previousText?: string
  nextText?: string
  // Props para vista responsive
  showViewToggle?: boolean
  defaultViewMode?: "table" | "cards"
  autoResponsive?: boolean
  breakpoint?: number
  showAutoToggle?: boolean
}

export default function DocumentManagementTable({
  config = {},
  tableState,
  onAddDocument,
  onEditDocument,
  onViewDocument,
  onViewPdf,
  onViewDetails,
  onSelectDocument,
  // Header props
  title,
  searchPlaceholder,
  addButtonText,
  showAddButton,

  // Filter props
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  showStatusFilter,
  statusOptions,
  selectedStatus,
  onStatusChange,
  // Pagination props
  showPaginationInfo,
  paginationInfoText,
  previousText,
  nextText,
  // Responsive view props
  showViewToggle = true,
  defaultViewMode = "table",
  autoResponsive = true,
  breakpoint = 768,
  showAutoToggle = true,
}: DocumentManagementTableProps) {
  // Usar el estado proporcionado o crear uno nuevo
  const defaultTableState = useTable()
  const state = tableState || defaultTableState

  const {
    searchTerm,
    currentPage,
    selectedDocuments,
    currentDocuments,
    totalPages,
    handleSearch,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    handleSelectDocument,
    handleSelectAll,
    getSelectAllState,
    getPageNumbers,
    hasFilteredDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
  } = state

  // Hook para manejo responsive de vistas
  const responsiveViewState = useResponsiveView({
    autoResponsive,
    breakpoint,
    defaultViewMode,
  })

  // Estados para el modal CRUD
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "view" | "delete" | "pdf" | "details"
    document?: Document | null
  }>({
    isOpen: false,
    mode: "create",
    document: null,
  })

  // Combinar la configuración por defecto con la configuración proporcionada
  const tableConfig: TableConfig = {
    ...defaultConfig,
    ...config,
    columns: config.columns || defaultConfig.columns,
  }

  const { select, cuadricula, columns } = tableConfig

  // Manejar la selección de documento
  const handleDocumentSelect = (docId: number) => {
    if (!select) return

    handleSelectDocument(docId)

    const document = currentDocuments.find((d: any) => d.id === docId)
    if (document && onSelectDocument) {
      onSelectDocument(document)
    }
  }

  // Funciones CRUD
  const handleCreateDocument = () => {
    setModalState({
      isOpen: true,
      mode: "create",
      document: null,
    })
    onAddDocument?.()
  }

  const handleEditDocumentClick = (document: Document) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      document,
    })
    onEditDocument?.(document)
  }

  const handleViewDocumentClick = (document: Document) => {
    setModalState({
      isOpen: true,
      mode: "view",
      document,
    })
    onViewDocument?.(document)
  }

  const handleViewPdfClick = (document: Document) => {
    setModalState({
      isOpen: true,
      mode: "pdf",
      document,
    })
    onViewPdf?.(document)
  }

  const handleViewDetailsClick = (document: Document) => {
    setModalState({
      isOpen: true,
      mode: "details",
      document,
    })
    onViewDetails?.(document)
  }

  const handleDeleteDocumentClick = (document: Document) => {
    setModalState({
      isOpen: true,
      mode: "delete",
      document,
    })
  }

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      mode: "create",
      document: null,
    })
  }

  const handleModalSave = (documentData: Partial<Document>) => {
    if (modalState.mode === "create") {
      addDocument(documentData as Document)
    } else if (modalState.mode === "edit" && modalState.document) {
      updateDocument(modalState.document.id, documentData)
    }
  }

  const handleModalDelete = (docId: number) => {
    deleteDocument(docId)
  }

  return (
    <div className="user-management-container">
      <TableHeader
        title={title || "Gestión de Documentos"}
        searchTerm={searchTerm}
        searchPlaceholder={searchPlaceholder || "Buscar documentos..."}
        onSearch={handleSearch}
        onAddUser={handleCreateDocument}
        addButtonText={addButtonText || "Nuevo Documento"}
        showAddButton={showAddButton}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
        showStatusFilter={showStatusFilter}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
        showViewToggle={showViewToggle}
        responsiveViewState={responsiveViewState}
        showAutoToggle={showAutoToggle}
      />

      {responsiveViewState.viewMode === "table" ? (
        <div className="table-container">
          <table className={`users-table ${!select ? "no-select" : ""} ${cuadricula ? "with-grid" : ""}`}>
            <thead>
              <tr>
                {select && (
                  <th className="select-column">
                    <button
                      className={`select-btn master-select ${getSelectAllState()}`}
                      onClick={handleSelectAll}
                      title="Seleccionar todos"
                    >
                      {getSelectAllState() === "all" && <Check size={14} />}
                      {getSelectAllState() === "some" && <Minus size={14} />}
                    </button>
                  </th>
                )}
                {columns
                  .filter((column) => !column.hidden)
                  .map((column) => (
                    <th key={column.id}>{column.header}</th>
                  ))}
              </tr>
            </thead>
            <tbody style={{ minHeight: "320px", position: "relative" }}>
              {currentDocuments.map((document: any, index: any) => (
                <tr key={document.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                  {select && (
                    <td className="select-column">
                      <button
                        className={`select-btn ${selectedDocuments.includes(document.id) ? "selected" : ""}`}
                        onClick={() => handleDocumentSelect(document.id)}
                        title="Seleccionar documento"
                      >
                        {selectedDocuments.includes(document.id) && <Check size={14} />}
                      </button>
                    </td>
                  )}
                  {columns
                    .filter((column) => !column.hidden)
                    .map((column) => {
                      if (column.id === "acciones") {
                        return (
                          <td key={column.id}>
                            <div className="actions-cell">
                              <button
                                className="action-btn"
                                onClick={() => handleEditDocumentClick(document)}
                                title="Editar documento"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="action-btn"
                                onClick={() => handleViewPdfClick(document)}
                                title="Ver PDF"
                              >
                                <FileText size={16} />
                              </button>
                              <button
                                className="action-btn"
                                onClick={() => handleViewDocumentClick(document)}
                                title="Ver documento"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="action-btn"
                                onClick={() => handleViewDetailsClick(document)}
                                title="Ver detalles"
                              >
                                <Info size={16} />
                              </button>
                            </div>
                          </td>
                        )
                      }

                      if (column.id === "titulo") {
                        return (
                          <td key={column.id} className="name-cell">
                            {document[column.accessor]}
                          </td>
                        )
                      }

                      if (column.id === "area") {
                        return (
                          <td key={column.id}>
                            <span className={`role-badge role-${document.area.toLowerCase().replace(/\s+/g, "-")}`}>
                              {document.area}
                            </span>
                          </td>
                        )
                      }

                      return <td key={column.id}>{document[column.accessor]}</td>
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TableCardView
          documents={currentDocuments}
          selectedDocuments={selectedDocuments}
          onSelectDocument={handleDocumentSelect}
          onEditDocument={handleEditDocumentClick}
          onViewDocument={handleViewDocumentClick}
          onViewPdf={handleViewPdfClick}
          onViewDetails={handleViewDetailsClick}
          showSelection={select}
        />
      )}

      {!hasFilteredDocuments && (
        <div className="no-results">
          <p>No se encontraron documentos que coincidan con la búsqueda.</p>
        </div>
      )}

      {hasFilteredDocuments && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
          getPageNumbers={getPageNumbers}
          showInfo={showPaginationInfo}
          infoText={paginationInfoText}
          previousText={previousText}
          nextText={nextText}
        />
      )}
    </div>
  )
}
