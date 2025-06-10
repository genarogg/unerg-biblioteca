"use client"

import "./table-pagination.css"

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onNextPage: () => void
  onPreviousPage: () => void
  getPageNumbers: () => (number | string)[]
  showInfo?: boolean
  infoText?: string
  previousText?: string
  nextText?: string
}

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPreviousPage,
  getPageNumbers,
  showInfo = true,
  infoText,
  previousText = "Anterior",
  nextText = "Siguiente",
}: TablePaginationProps) {
  const defaultInfoText = `Página ${currentPage} de ${totalPages}`

  return (
    <div className="table-pagination-container">
      {showInfo && <div className="table-pagination-info">{infoText || defaultInfoText}</div>}

      <div className="table-pagination-controls">
        <button className="table-pagination-btn" onClick={onPreviousPage} disabled={currentPage === 1}>
          <span>{previousText}</span>
        </button>

        {getPageNumbers().map((pageNum, index) =>
          typeof pageNum === "number" ? (
            <button
              key={index}
              className={`table-pagination-btn table-page-number ${pageNum === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ) : (
            <span key={index} className="table-pagination-ellipsis">
              {pageNum}
            </span>
          ),
        )}

        <button className="table-pagination-btn" onClick={onNextPage} disabled={currentPage === totalPages}>
          <span>{nextText}</span>
        </button>
      </div>
    </div>
  )
}
