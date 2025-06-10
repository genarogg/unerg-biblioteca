"use client"

import { useState } from "react"
import "./css/user-management-table.css"

import { Edit, Key, Check, Minus } from "lucide-react"
import defaultConfig, { type TableConfig } from "./config"
import { useTable, type UseTableReturn } from "./useTable"
import type { User } from "./fn/defaultUsers"
import { useResponsiveView } from "./useResponsiveView"
import TableHeader from "./table-header"
import TablePagination from "./pagination/table-pagination"
import TableCardView from "./table-card-view"
import AddUsuario from "./modal-crud/AddUsuario"

interface UserManagementTableProps {
  config?: Partial<TableConfig>
  tableState?: UseTableReturn
  onAddUser?: () => void
  onEditUser?: (user: User) => void
  onViewUser?: (user: User) => void
  onSelectUser?: (user: User) => void
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

export default function UserManagementTable({
  config = {},
  tableState,
  onAddUser,
  onEditUser,
  onViewUser,
  onSelectUser,
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
}: UserManagementTableProps) {
  // Usar el estado proporcionado o crear uno nuevo
  const defaultTableState = useTable()
  const state = tableState || defaultTableState

  const {
    searchTerm,
    currentPage,
    selectedUsers,
    currentUsers,
    totalPages,
    handleSearch,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    handleSelectUser: handleSelectUserState,
    handleSelectAll,
    getSelectAllState,
    getPageNumbers,
    hasFilteredUsers,
    addUser,
    updateUser,
    deleteUser,
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
    mode: "create" | "edit" | "view" | "delete" | "password"
    user?: User | null
  }>({
    isOpen: false,
    mode: "create",
    user: null,
  })

  // Combinar la configuración por defecto con la configuración proporcionada
  const tableConfig: TableConfig = {
    ...defaultConfig,
    ...config,
    columns: config.columns || defaultConfig.columns,
  }

  const { select, cuadricula, columns } = tableConfig

  // Manejar la selección de usuario
  const handleUserSelect = (userId: number) => {
    if (!select) return

    handleSelectUserState(userId)

    const user = currentUsers.find((u: any) => u.id === userId)
    if (user && onSelectUser) {
      onSelectUser(user)
    }
  }

  // Funciones CRUD
  const handleCreateUser = () => {
    setModalState({
      isOpen: true,
      mode: "create",
      user: null,
    })
    onAddUser?.()
  }

  const handleEditUserClick = (user: User) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      user,
    })
    onEditUser?.(user)
  }

  const handleViewUserClick = (user: User) => {
    setModalState({
      isOpen: true,
      mode: "view",
      user,
    })
    onViewUser?.(user)
  }

  const handleDeleteUserClick = (user: User) => {
    setModalState({
      isOpen: true,
      mode: "delete",
      user,
    })
  }

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      mode: "create",
      user: null,
    })
  }

  const handleModalSave = (userData: Partial<User>) => {
    if (modalState.mode === "create") {
      addUser(userData as User)
    } else if (modalState.mode === "edit" && modalState.user) {
      updateUser(modalState.user.id, userData)
    }
  }

  const handleModalDelete = (userId: number) => {
    deleteUser(userId)
  }

  const handlePasswordChangeClick = (user: User) => {
    setModalState({
      isOpen: true,
      mode: "password",
      user,
    })
    // Add your password change logic here
    console.log("Cambiar contraseña para:", user.nombre)
  }

  // Función para manejar la adición de usuario desde el modal del header
  const handleAddUserFromHeader = (newUser: User) => {
    addUser(newUser)
    console.log("Usuario agregado desde header:", newUser)
  }

  // Función para obtener el estilo del badge según el rol
  const getRoleBadgeVariant = (rol: string) => {
    switch (rol) {
      case "SUPER_USUARIO":
        return "destructive" // Rojo para super usuario
      case "EDITOR":
        return "secondary" // Gris para editor
      default:
        return "default"
    }
  }

  // Función para obtener el texto del rol
  const getRoleDisplayText = (rol: string) => {
    switch (rol) {
      case "SUPER_USUARIO":
        return "Super Usuario"
      case "EDITOR":
        return "Editor"
      default:
        return rol
    }
  }

  return (
    <div className="user-management-container">
      <TableHeader
        title={title}
        searchTerm={searchTerm}
        searchPlaceholder={searchPlaceholder}
        onSearch={handleSearch}
        onAddUser={handleAddUserFromHeader} // Pasar la función correcta
        addButtonText={addButtonText}
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
              {currentUsers.map((user: any, index: any) => (
                <tr key={user.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                  {select && (
                    <td className="select-column">
                      <button
                        className={`select-btn ${selectedUsers.includes(user.id) ? "selected" : ""}`}
                        onClick={() => handleUserSelect(user.id)}
                        title="Seleccionar usuario"
                      >
                        {selectedUsers.includes(user.id) && <Check size={14} />}
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
                                onClick={() => handleEditUserClick(user)}
                                title="Editar usuario"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="action-btn"
                                onClick={() => handlePasswordChangeClick(user)}
                                title="Cambiar contraseña"
                              >
                                <Key size={16} />
                              </button>
                            </div>
                          </td>
                        )
                      }

                      if (column.id === "nombre") {
                        return (
                          <td key={column.id} className="name-cell">
                            {user[column.accessor]}
                          </td>
                        )
                      }

                      if (column.id === "correo") {
                        return (
                          <td key={column.id} className="email-cell">
                            {user[column.accessor]}
                          </td>
                        )
                      }

                      if (column.id === "rol") {
                        return (
                          <td key={column.id}>
                            <span className={`badge badge-${getRoleBadgeVariant(user[column.accessor])}`}>
                              {getRoleDisplayText(user[column.accessor])}
                            </span>
                          </td>
                        )
                      }

                      return <td key={column.id}>{user[column.accessor]}</td>
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TableCardView
          users={currentUsers}
          selectedUsers={selectedUsers}
          onSelectUser={handleUserSelect}
          onEditUser={handleEditUserClick}
          onPasswordChange={handlePasswordChangeClick}
          showSelection={select}
        />
      )}

      {!hasFilteredUsers && (
        <div className="no-results">
          <p>No se encontraron usuarios que coincidan con la búsqueda.</p>
        </div>
      )}

      {hasFilteredUsers && (
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

      {/* <UserCrudModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        user={modalState.user}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
      /> */}
    </div>
  )
}