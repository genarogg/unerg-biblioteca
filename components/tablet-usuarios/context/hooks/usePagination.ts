"use client"

import { useMemo, useCallback } from "react"
import { useTableState } from "../TableContext"

interface UsePaginationProps {
  // Opciones de configuración del hook
  maxPagesToShow?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  showEllipsis?: boolean
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
}

interface PaginationInfo {
  startItem: number
  endItem: number
  totalItems: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  isFirstPage: boolean
  isLastPage: boolean
}

interface PaginationControls {
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  setItemsPerPage: (itemsPerPage: number) => void
}

interface PaginationDisplay {
  pageNumbers: (number | string)[]
  paginationText: string
  formatPaginationText: (template: string) => string
}

interface PaginationUIConfig {
  showPaginationInfo: boolean
  paginationInfoText: string
  previousText: string
  nextText: string
  firstText: string
  lastText: string
  showFirstLast: boolean
  showPrevNext: boolean
  showEllipsis: boolean
}

interface UsePaginationReturn {
  // Información de la paginación
  info: PaginationInfo

  // Controles de navegación
  controls: PaginationControls

  // Elementos para mostrar
  display: PaginationDisplay

  // Configuración de UI
  uiConfig: PaginationUIConfig

  // Estados útiles
  isEmpty: boolean
  isLoading: boolean
  hasError: boolean

  // Configuración actual
  config: {
    itemsPerPage: number
    maxPagesToShow: number
    showFirstLast: boolean
    showPrevNext: boolean
    showEllipsis: boolean
  }
}

export const usePagination = ({
  maxPagesToShow = 5,
  showFirstLast = true,
  showPrevNext = true,
  showEllipsis = true,
  showPaginationInfo = true,
  paginationInfoText = "Mostrando {start} a {end} de {total} elementos",
  previousText = "Anterior",
  nextText = "Siguiente",
  firstText = "Primera",
  lastText = "Última",
  onPageChange,
  onItemsPerPageChange,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    filteredCount,
    dataLoading,
    dataError,
    goToPage: contextGoToPage,
    goToNextPage: contextGoToNextPage,
    goToPreviousPage: contextGoToPreviousPage,
    updateItemsPerPage,
  } = useTableState()

  // Información de la paginación
  const info: PaginationInfo = useMemo(() => {
    const startItem = filteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, filteredCount)

    return {
      startItem,
      endItem,
      totalItems: filteredCount,
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages || totalPages === 0,
    }
  }, [currentPage, totalPages, itemsPerPage, filteredCount])

  // Controles de navegación con callbacks opcionales
  const controls: PaginationControls = useMemo(
    () => ({
      goToPage: (page: number) => {
        contextGoToPage(page)
        onPageChange?.(page)
      },

      goToNextPage: () => {
        if (info.hasNextPage) {
          const nextPage = currentPage + 1
          contextGoToNextPage()
          onPageChange?.(nextPage)
        }
      },

      goToPreviousPage: () => {
        if (info.hasPreviousPage) {
          const prevPage = currentPage - 1
          contextGoToPreviousPage()
          onPageChange?.(prevPage)
        }
      },

      goToFirstPage: () => {
        if (!info.isFirstPage) {
          contextGoToPage(1)
          onPageChange?.(1)
        }
      },

      goToLastPage: () => {
        if (!info.isLastPage && totalPages > 0) {
          contextGoToPage(totalPages)
          onPageChange?.(totalPages)
        }
      },

      setItemsPerPage: (newItemsPerPage: number) => {
        updateItemsPerPage(newItemsPerPage)
        onItemsPerPageChange?.(newItemsPerPage)
      },
    }),
    [
      currentPage,
      totalPages,
      info.hasNextPage,
      info.hasPreviousPage,
      info.isFirstPage,
      info.isLastPage,
      contextGoToPage,
      contextGoToNextPage,
      contextGoToPreviousPage,
      updateItemsPerPage,
      onPageChange,
      onItemsPerPageChange,
    ],
  )

  // Generar números de página personalizados
  const generatePageNumbers = useCallback((): (number | string)[] => {
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pageNumbers: (number | string)[] = []

    // Siempre mostrar la primera página
    if (showFirstLast) {
      pageNumbers.push(1)
    }

    let startPage = Math.max(showFirstLast ? 2 : 1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(showFirstLast ? totalPages - 1 : totalPages, currentPage + Math.floor(maxPagesToShow / 2))

    // Ajustar si estamos cerca del inicio
    if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
      endPage = Math.min(totalPages - (showFirstLast ? 1 : 0), maxPagesToShow - (showFirstLast ? 1 : 0))
    }

    // Ajustar si estamos cerca del final
    if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
      startPage = Math.max(showFirstLast ? 2 : 1, totalPages - maxPagesToShow + (showFirstLast ? 2 : 1))
    }

    // Agregar ellipsis al inicio si es necesario
    if (showEllipsis && startPage > (showFirstLast ? 2 : 1)) {
      pageNumbers.push("...")
    }

    // Agregar páginas del rango
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Agregar ellipsis al final si es necesario
    if (showEllipsis && endPage < (showFirstLast ? totalPages - 1 : totalPages)) {
      pageNumbers.push("...")
    }

    // Siempre mostrar la última página
    if (showFirstLast && totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }, [currentPage, totalPages, maxPagesToShow, showFirstLast, showEllipsis])

  // Elementos para mostrar
  const display: PaginationDisplay = useMemo(() => {
    const pageNumbers = generatePageNumbers()

    const defaultPaginationText =
      info.totalItems === 0
        ? "No hay elementos para mostrar"
        : paginationInfoText
            .replace("{start}", info.startItem.toString())
            .replace("{end}", info.endItem.toString())
            .replace("{total}", info.totalItems.toString())
            .replace("{current}", info.currentPage.toString())
            .replace("{pages}", info.totalPages.toString())

    const formatPaginationText = (template: string): string => {
      return template
        .replace("{start}", info.startItem.toString())
        .replace("{end}", info.endItem.toString())
        .replace("{total}", info.totalItems.toString())
        .replace("{current}", info.currentPage.toString())
        .replace("{pages}", info.totalPages.toString())
    }

    return {
      pageNumbers,
      paginationText: defaultPaginationText,
      formatPaginationText,
    }
  }, [generatePageNumbers, info, paginationInfoText])

  // Configuración de UI
  const uiConfig: PaginationUIConfig = {
    showPaginationInfo,
    paginationInfoText,
    previousText,
    nextText,
    firstText,
    lastText,
    showFirstLast,
    showPrevNext,
    showEllipsis,
  }

  // Estados útiles
  const isEmpty = filteredCount === 0
  const isLoading = dataLoading
  const hasError = !!dataError

  // Configuración actual
  const config = {
    itemsPerPage,
    maxPagesToShow,
    showFirstLast,
    showPrevNext,
    showEllipsis,
  }

  return {
    info,
    controls,
    display,
    uiConfig,
    isEmpty,
    isLoading,
    hasError,
    config,
  }
}

// Hook simplificado para casos básicos
export const useSimplePagination = () => {
  return usePagination({
    maxPagesToShow: 5,
    showFirstLast: true,
    showPrevNext: true,
    showEllipsis: true,
  })
}

// Hook para paginación compacta (móviles)
export const useCompactPagination = () => {
  return usePagination({
    maxPagesToShow: 3,
    showFirstLast: false,
    showPrevNext: true,
    showEllipsis: false,
    previousText: "‹",
    nextText: "›",
  })
}

// Hook para paginación extendida (escritorio)
export const useExtendedPagination = () => {
  return usePagination({
    maxPagesToShow: 7,
    showFirstLast: true,
    showPrevNext: true,
    showEllipsis: true,
    firstText: "««",
    lastText: "»»",
  })
}

// Tipos para exportar
export type {
  UsePaginationProps,
  UsePaginationReturn,
  PaginationInfo,
  PaginationControls,
  PaginationDisplay,
  PaginationUIConfig,
}
