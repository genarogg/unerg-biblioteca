"use client"

import { useState, useMemo } from "react"
import { defaultDocuments, type Document } from "./fn/defaultUsers"

interface UseTableProps {
  initialDocuments?: Document[]
  itemsPerPage?: number
}

export const useTable = ({ initialDocuments = defaultDocuments, itemsPerPage = 5 }: UseTableProps = {}) => {
  // Estados principales
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  // Documentos filtrados según el término de búsqueda
  const filteredDocuments = useMemo(() => {
    return documents.filter(
      (doc) =>
        doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.autor.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [documents, searchTerm])

  // Calcular el número total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredDocuments.length / itemsPerPage)
  }, [filteredDocuments.length, itemsPerPage])

  // Obtener los documentos para la página actual
  const currentDocuments = useMemo(() => {
    return filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredDocuments, currentPage, itemsPerPage])

  // Funciones para manejar la búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Resetear a la primera página cuando se busca
  }

  const clearSearch = () => {
    setSearchTerm("")
    setCurrentPage(1)
  }

  // Funciones para manejar la paginación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  // Funciones para manejar la selección
  const handleSelectDocument = (docId: number) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId)
      } else {
        return [...prev, docId]
      }
    })
  }

  const handleSelectAll = () => {
    const currentDocumentIds = currentDocuments.map((doc) => doc.id)
    const selectedCurrentDocuments = selectedDocuments.filter((id) => currentDocumentIds.includes(id))

    if (selectedCurrentDocuments.length === currentDocuments.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedDocuments((prev) => prev.filter((id) => !currentDocumentIds.includes(id)))
    } else {
      // Si ninguno o algunos están seleccionados, seleccionar todos
      setSelectedDocuments((prev) => {
        const newSelected = [...prev]
        currentDocumentIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id)
          }
        })
        return newSelected
      })
    }
  }

  const clearSelection = () => {
    setSelectedDocuments([])
  }

  const selectAllDocuments = () => {
    setSelectedDocuments(documents.map((doc) => doc.id))
  }

  // Determinar el estado del botón de selección maestro
  const getSelectAllState = () => {
    const currentDocumentIds = currentDocuments.map((doc) => doc.id)
    const selectedCurrentDocuments = selectedDocuments.filter((id) => currentDocumentIds.includes(id))

    if (selectedCurrentDocuments.length === 0) {
      return "none" // Sin selección
    } else if (selectedCurrentDocuments.length === currentDocuments.length) {
      return "all" // Todos seleccionados
    } else {
      return "some" // Algunos seleccionados
    }
  }

  // Funciones para manejar los datos de documentos
  const addDocument = (newDoc: Document) => {
    setDocuments((prev) => [...prev, newDoc])
  }

  const updateDocument = (docId: number, updatedDoc: Partial<Document>) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, ...updatedDoc } : doc)))
  }

  const deleteDocument = (docId: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
    setSelectedDocuments((prev) => prev.filter((id) => id !== docId))
  }

  const deleteSelectedDocuments = () => {
    setDocuments((prev) => prev.filter((doc) => !selectedDocuments.includes(doc.id)))
    setSelectedDocuments([])
  }

  // Generar array de números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Siempre mostrar la primera página
      pageNumbers.push(1)

      // Calcular el rango de páginas alrededor de la página actual
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar si estamos cerca del inicio
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4)
      }

      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      // Agregar elipsis después de la primera página si es necesario
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Agregar páginas del rango calculado
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Agregar elipsis antes de la última página si es necesario
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Siempre mostrar la última página
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  // Obtener documentos seleccionados
  const getSelectedDocuments = () => {
    return documents.filter((doc) => selectedDocuments.includes(doc.id))
  }

  return {
    // Estados
    users: documents, // Mantener compatibilidad
    documents,
    searchTerm,
    currentPage,
    selectedUsers: selectedDocuments, // Mantener compatibilidad
    selectedDocuments,
    filteredUsers: filteredDocuments, // Mantener compatibilidad
    filteredDocuments,
    currentUsers: currentDocuments, // Mantener compatibilidad
    currentDocuments,
    totalPages,

    // Funciones de búsqueda
    handleSearch,
    clearSearch,

    // Funciones de paginación
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers,

    // Funciones de selección
    handleSelectUser: handleSelectDocument, // Mantener compatibilidad
    handleSelectDocument,
    handleSelectAll,
    clearSelection,
    selectAllUsers: selectAllDocuments, // Mantener compatibilidad
    selectAllDocuments,
    getSelectAllState,
    getSelectedUsers: getSelectedDocuments, // Mantener compatibilidad
    getSelectedDocuments,

    // Funciones de datos
    addUser: addDocument, // Mantener compatibilidad
    addDocument,
    updateUser: updateDocument, // Mantener compatibilidad
    updateDocument,
    deleteUser: deleteDocument, // Mantener compatibilidad
    deleteDocument,
    deleteSelectedUsers: deleteSelectedDocuments, // Mantener compatibilidad
    deleteSelectedDocuments,
    setUsers: setDocuments, // Mantener compatibilidad
    setDocuments,

    // Información adicional
    hasUsers: documents.length > 0, // Mantener compatibilidad
    hasDocuments: documents.length > 0,
    hasFilteredUsers: filteredDocuments.length > 0, // Mantener compatibilidad
    hasFilteredDocuments: filteredDocuments.length > 0,
    selectedCount: selectedDocuments.length,
    totalUsers: documents.length, // Mantener compatibilidad
    totalDocuments: documents.length,
    filteredCount: filteredDocuments.length,
  }
}

export type UseTableReturn = ReturnType<typeof useTable>
export type { Document as User } // Mantener compatibilidad
export type { Document }
