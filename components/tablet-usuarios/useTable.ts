"use client"

import { useState, useMemo } from "react"
import { defaultUsers, type User } from "./fn/defaultUsers"



interface UseTableProps {
  initialUsers?: User[]
  itemsPerPage?: number
}

export const useTable = ({ initialUsers = defaultUsers, itemsPerPage = 5 }: UseTableProps = {}) => {
  // Estados principales
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  // Usuarios filtrados según el término de búsqueda
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rol.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [users, searchTerm])

  // Calcular el número total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / itemsPerPage)
  }, [filteredUsers.length, itemsPerPage])

  // Obtener los usuarios para la página actual
  const currentUsers = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredUsers, currentPage, itemsPerPage])

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
  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleSelectAll = () => {
    const currentUserIds = currentUsers.map((user) => user.id)
    const selectedCurrentUsers = selectedUsers.filter((id) => currentUserIds.includes(id))

    if (selectedCurrentUsers.length === currentUsers.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedUsers((prev) => prev.filter((id) => !currentUserIds.includes(id)))
    } else {
      // Si ninguno o algunos están seleccionados, seleccionar todos
      setSelectedUsers((prev) => {
        const newSelected = [...prev]
        currentUserIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id)
          }
        })
        return newSelected
      })
    }
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  const selectAllUsers = () => {
    setSelectedUsers(users.map((user) => user.id))
  }

  // Determinar el estado del botón de selección maestro
  const getSelectAllState = () => {
    const currentUserIds = currentUsers.map((user) => user.id)
    const selectedCurrentUsers = selectedUsers.filter((id) => currentUserIds.includes(id))

    if (selectedCurrentUsers.length === 0) {
      return "none" // Sin selección
    } else if (selectedCurrentUsers.length === currentUsers.length) {
      return "all" // Todos seleccionados
    } else {
      return "some" // Algunos seleccionados
    }
  }

  // Funciones para manejar los datos de usuarios
  const addUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser])
  }

  const updateUser = (userId: number, updatedUser: Partial<User>) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updatedUser } : user)))
  }

  const deleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
    setSelectedUsers((prev) => prev.filter((id) => id !== userId))
  }

  const deleteSelectedUsers = () => {
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
    setSelectedUsers([])
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

  // Obtener usuarios seleccionados
  const getSelectedUsers = () => {
    return users.filter((user) => selectedUsers.includes(user.id))
  }

  return {
    // Estados
    users,
    searchTerm,
    currentPage,
    selectedUsers,
    filteredUsers,
    currentUsers,
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
    handleSelectUser,
    handleSelectAll,
    clearSelection,
    selectAllUsers,
    getSelectAllState,
    getSelectedUsers,

    // Funciones de datos
    addUser,
    updateUser,
    deleteUser,
    deleteSelectedUsers,
    setUsers,

    // Información adicional
    hasUsers: users.length > 0,
    hasFilteredUsers: filteredUsers.length > 0,
    selectedCount: selectedUsers.length,
    totalUsers: users.length,
    filteredCount: filteredUsers.length,
  }
}

export type UseTableReturn = ReturnType<typeof useTable>
export type { User }
