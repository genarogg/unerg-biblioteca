"use client"

import "./pagination.css"
import { usePagination } from "../../../context/hooks/usePagination"
import { useState, useEffect } from "react"

interface TablePaginationProps {
  // Configuración opcional del hook de paginación
  maxPagesToShow?: number
  showFirstLast?: boolean
  showEllipsis?: boolean
  showPrevNext?: boolean
  // Configuración de UI
  showPaginationInfo?: boolean
  paginationInfoText?: string
  previousText?: string
  nextText?: string
  firstText?: string
  lastText?: string
  // Callbacks opcionales
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  // Configuración de visualización
  showInfo?: boolean
  showControls?: boolean
  customInfoTemplate?: string
  // Nueva prop para forzar modo compacto
  forceCompact?: boolean
}

export default function TablePagination({
  maxPagesToShow = 5,
  showFirstLast = true,
  showEllipsis = true,
  showPrevNext = true,
  showPaginationInfo = true,
  paginationInfoText = "Mostrando {start} a {end} de {total} elementos",
  previousText = "<",
  nextText = ">",
  firstText = "<<",
  lastText = ">>",
  onPageChange,
  onItemsPerPageChange,
  showInfo = true,
  showControls = true,
  customInfoTemplate,
  forceCompact = false,
}: TablePaginationProps = {}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallMobile(window.innerWidth <= 480)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Ajustar configuración según el tamaño de pantalla
  const getResponsiveConfig = () => {
    if (forceCompact || isSmallMobile) {
      return {
        maxPagesToShow: 3,
        showFirstLast: true,
        previousText: "‹",
        nextText: "›",
        firstText: "‹‹",
        lastText: "››",
        showInfo: true
      }
    } else if (isMobile) {
      return {
        maxPagesToShow: 4,
        showFirstLast: true,
        previousText: "‹",
        nextText: "›",
        firstText: "‹‹",
        lastText: "››",
        showInfo: true
      }
    }
    return {
      maxPagesToShow,
      showFirstLast,
      previousText,
      nextText,
      firstText,
      lastText,
      showInfo: true
    }
  }

  const config = getResponsiveConfig()

  const { info, controls, display, uiConfig, isEmpty, isLoading, hasError } = usePagination({
    maxPagesToShow: config.maxPagesToShow,
    showFirstLast: config.showFirstLast,
    showEllipsis,
    showPrevNext,
    showPaginationInfo,
    paginationInfoText,
    previousText: config.previousText,
    nextText: config.nextText,
    firstText: config.firstText || firstText,
    lastText: config.lastText || lastText,
    onPageChange,
    onItemsPerPageChange,
  })

  // Función para obtener el texto de paginación
  const getPaginationText = () => {
    if (customInfoTemplate) {
      return display.formatPaginationText(customInfoTemplate)
    }
    return display.paginationText
  }

  // No mostrar nada si está cargando o hay error
  if (isLoading || hasError || isEmpty) {
    return null
  }

  return (
    <div className="table-pagination-container">
      {showInfo && config.showInfo && uiConfig.showPaginationInfo && (
        <div className="table-pagination-info">
          {getPaginationText()}
        </div>
      )}

      {showControls && info.totalPages > 1 && (
        <div className="table-pagination-controls">
          {/* Botón Primera Página */}
          {config.showFirstLast && !info.isFirstPage && (
            <button
              className="table-pagination-btn table-pagination-first"
              onClick={controls.goToFirstPage}
              title={`${uiConfig.firstText} página`}
            >
              <span>{uiConfig.firstText}</span>
            </button>
          )}

          {/* Botón Anterior */}
          {uiConfig.showPrevNext && (
            <button
              className="table-pagination-btn table-pagination-prev"
              onClick={controls.goToPreviousPage}
              disabled={!info.hasPreviousPage}
              title="Página anterior"
            >
              <span>{config.previousText}</span>
            </button>
          )}

          {/* Números de página */}
          {display.pageNumbers.map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <button
                key={`page-${pageNum}`}
                className={`table-pagination-btn table-page-number ${pageNum === info.currentPage ? "active" : ""}`}
                onClick={() => controls.goToPage(pageNum)}
                title={`Ir a la página ${pageNum}`}
              >
                {pageNum}
              </button>
            ) : (
              <span key={`ellipsis-${index}`} className="table-pagination-ellipsis">
                {pageNum}
              </span>
            ),
          )}

          {/* Botón Siguiente */}
          {uiConfig.showPrevNext && (
            <button
              className="table-pagination-btn table-pagination-next"
              onClick={controls.goToNextPage}
              disabled={!info.hasNextPage}
              title="Página siguiente"
            >
              <span>{config.nextText}</span>
            </button>
          )}

          {/* Botón Última Página */}
          {config.showFirstLast && !info.isLastPage && (
            <button
              className="table-pagination-btn table-pagination-last"
              onClick={controls.goToLastPage}
              title={`${uiConfig.lastText} página`}
            >
              <span>{uiConfig.lastText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Componente de paginación compacta para móviles
export function CompactPagination(props: Omit<TablePaginationProps, "maxPagesToShow" | "showFirstLast">) {
  return <TablePagination {...props} maxPagesToShow={3} showFirstLast={true} previousText="‹" nextText="›" firstText="‹‹" lastText="››" forceCompact={true} />
}

// Componente de paginación extendida para escritorio
export function ExtendedPagination(props: Omit<TablePaginationProps, "maxPagesToShow">) {
  return <TablePagination {...props} maxPagesToShow={7} firstText="««" lastText="»»" />
}

// Componente de información de paginación solamente
export function PaginationInfo({
  customTemplate,
  paginationInfoText = "Mostrando {start} a {end} de {total} elementos",
}: {
  customTemplate?: string
  paginationInfoText?: string
} = {}) {
  const { display } = usePagination({ paginationInfoText })

  const getText = () => {
    if (customTemplate) {
      return display.formatPaginationText(customTemplate)
    }
    return display.paginationText
  }

  return <div className="table-pagination-info standalone">{getText()}</div>
}

// Componente de controles de paginación solamente
export function PaginationControls(
  props: Pick<
    TablePaginationProps,
    "maxPagesToShow" | "showFirstLast" | "onPageChange" | "previousText" | "nextText" | "firstText" | "lastText"
  >,
) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const { info, controls, display, uiConfig } = usePagination({
    maxPagesToShow: isMobile ? 3 : (props.maxPagesToShow || 5),
    showFirstLast: props.showFirstLast ?? true,
    previousText: isMobile ? "‹" : (props.previousText || "Anterior"),
    nextText: isMobile ? "›" : (props.nextText || "Siguiente"),
    firstText: isMobile ? "‹‹" : (props.firstText || "Primera"),
    lastText: isMobile ? "››" : (props.lastText || "Última"),
    onPageChange: props.onPageChange,
  })

  if (info.totalPages <= 1) {
    return null
  }

  return (
    <div className="table-pagination-controls standalone">
      {uiConfig.showFirstLast && !info.isFirstPage && (
        <button className="table-pagination-btn table-pagination-first" onClick={controls.goToFirstPage}>
          <span>{uiConfig.firstText}</span>
        </button>
      )}

      <button
        className="table-pagination-btn table-pagination-prev"
        onClick={controls.goToPreviousPage}
        disabled={!info.hasPreviousPage}
      >
        <span>{uiConfig.previousText}</span>
      </button>

      {display.pageNumbers.map((pageNum, index) =>
        typeof pageNum === "number" ? (
          <button
            key={`page-${pageNum}`}
            className={`table-pagination-btn table-page-number ${pageNum === info.currentPage ? "active" : ""}`}
            onClick={() => controls.goToPage(pageNum)}
          >
            {pageNum}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className="table-pagination-ellipsis">
            {pageNum}
          </span>
        ),
      )}

      <button
        className="table-pagination-btn table-pagination-next"
        onClick={controls.goToNextPage}
        disabled={!info.hasNextPage}
      >
        <span>{uiConfig.nextText}</span>
      </button>

      {uiConfig.showFirstLast && !info.isLastPage && (
        <button className="table-pagination-btn table-pagination-last" onClick={controls.goToLastPage}>
          <span>{uiConfig.lastText}</span>
        </button>
      )}
    </div>
  )
}
