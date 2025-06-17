"use client"

import { useTableContext } from "../context/TableContext"
import { usePagination } from "../context/hooks/usePagination"

import TableCardView from "./table/table-card-view"
import TableView from "./table/table-view"
import TableHeader from "./components/table-header"
import TableFooter from "./components/table-footer"
import TablePagination from "./components/pagination"

import "./css/index.css"

export default function TableContent() {
  const { tableState, responsiveViewState } = useTableContext()
  const { isEmpty } = usePagination()

  const { currentItems } = tableState

  // Calculamos si hay elementos filtrados basándonos en si currentItems tiene elementos
  const hasFilteredItems = currentItems && currentItems.length > 0

  return (
    <div className="table-management-container">
      <TableHeader />

      {hasFilteredItems && (
        <>
          {responsiveViewState.viewMode === "table" ? <TableView /> : <TableCardView />}

          {/* Usar el nuevo componente de paginación con callbacks opcionales */}
          <TablePagination
            maxPagesToShow={5}
            showFirstLast={true}
            showEllipsis={true}
            onPageChange={(page) => {
              console.log(`Navegando a la página ${page}`)
            }}
            onItemsPerPageChange={(itemsPerPage) => {
              console.log(`Cambiando a ${itemsPerPage} elementos por página`)
            }}
          />

          <TableFooter />
        </>
      )}

      {!hasFilteredItems && !isEmpty && (
        <div className="no-results">
          <p>No se encontraron elementos que coincidan con la búsqueda.</p>
        </div>
      )}

      {isEmpty && (
        <div className="no-results">
          <p>No hay datos disponibles.</p>
        </div>
      )}
    </div>
  )
}
