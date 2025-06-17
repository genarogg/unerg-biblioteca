"use client"

import { useCallback, useState } from "react"
import { useTableState, useTableCallbacks } from "../TableContext"
import type { DataTable } from "../types"

interface UseTableRowActionsProps {
  onCustomEdit?: (item: DataTable) => void
  onCustomView?: (item: DataTable) => void
  onCustomDelete?: (item: DataTable) => void
  onCustomDuplicate?: (item: DataTable) => void
  onCustomRoleChange?: (item: DataTable, newRole: string) => void
  showConfirmDialog?: boolean
}

export const useTableRowActions = ({
  onCustomEdit,
  onCustomView,
  onCustomDelete,
  onCustomDuplicate,
  onCustomRoleChange,
  showConfirmDialog = true,
}: UseTableRowActionsProps = {}) => {
  const { updateItem, deleteItem, addItem } = useTableState()
  const { onEditItem, onDeleteItem } = useTableCallbacks()

  // Estado para el modal de vista
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedItemForView, setSelectedItemForView] = useState<DataTable | null>(null)

  // Acción de duplicar
  const handleDuplicate = useCallback(
    (item: DataTable) => {
      console.log("Duplicando elemento:", item)

      if (onCustomDuplicate) {
        onCustomDuplicate(item)
      } else {
        // Acción por defecto - crear una copia del elemento
        const newItem: DataTable = {
          ...item,
          id: Date.now(), // Generar nuevo ID único
          nombre: `${item.nombre} (Copia)`,
          correo: item.correo.includes("copia_")
            ? `copia_${Date.now()}_${item.correo.replace(/^copia_\d+_/, "")}`
            : `copia_${item.correo}`,
        }

        addItem(newItem)
        console.log("Elemento duplicado:", newItem)
      }
    },
    [onCustomDuplicate, addItem],
  )

  // Acción de ver/visualizar - CORREGIDA para abrir siempre el modal
  const handleView = useCallback(
    (item: DataTable) => {
      console.log("Visualizando elemento:", item)

      // Siempre abrir el modal por defecto, a menos que haya un callback personalizado
      if (onCustomView) {
        onCustomView(item)
      } else {
        // Acción por defecto - abrir modal con información
        setSelectedItemForView(item)
        setViewModalOpen(true)
        console.log("Abriendo modal para:", item.nombre)
      }
    },
    [onCustomView],
  )

  // Acción de eliminar - ahora elimina correctamente de la tabla
  const handleDelete = useCallback(
    (item: DataTable) => {
      console.log("Eliminando elemento:", item)

      const executeDelete = () => {
        // Primero intentar usar los callbacks personalizados
        if (onCustomDelete) {
          onCustomDelete(item)
        } else if (onDeleteItem) {
          onDeleteItem(item)
        } else {
          // Acción por defecto - eliminar del estado de la tabla
          deleteItem(item.id)
          console.log("Elemento eliminado de la tabla:", item.nombre)
        }
      }

      if (showConfirmDialog) {
        const confirmed = window.confirm(
          `¿Estás seguro de que quieres eliminar a "${item.nombre}"?\n\nEsta acción no se puede deshacer.`,
        )
        if (confirmed) {
          executeDelete()
        }
      } else {
        executeDelete()
      }
    },
    [onCustomDelete, onDeleteItem, deleteItem, showConfirmDialog],
  )

  // Acción de editar
  const handleEdit = useCallback(
    (item: DataTable) => {
      console.log("Editando elemento:", item)

      if (onCustomEdit) {
        onCustomEdit(item)
      } else if (onEditItem) {
        onEditItem(item)
      } else {
        // Acción por defecto - mostrar formulario simple
        const newName = prompt("Editar nombre:", item.nombre)
        if (newName && newName.trim() !== "") {
          updateItem(item.id, { nombre: newName.trim() })
          console.log(`Nombre actualizado: ${item.nombre} → ${newName}`)
        }
      }
    },
    [onCustomEdit, onEditItem, updateItem],
  )

  // Acción de cambiar rol
  const handleRoleChange = useCallback(
    (item: DataTable, newRole: string) => {
      console.log("Cambiando rol:", { item: item.nombre, from: item.rol, to: newRole })

      if (onCustomRoleChange) {
        onCustomRoleChange(item, newRole)
      } else {
        // Acción por defecto - actualizar en el estado
        updateItem(item.id, { rol: newRole })
        console.log(`Rol actualizado para ${item.nombre}: ${item.rol} → ${newRole}`)
      }
    },
    [onCustomRoleChange, updateItem],
  )

  // Función para cerrar el modal de vista
  const closeViewModal = useCallback(() => {
    console.log("Cerrando modal de vista")
    setViewModalOpen(false)
    setSelectedItemForView(null)
  }, [])

  // Acción de imprimir elemento individual
  const handlePrint = useCallback((item: DataTable) => {
    console.log("Imprimiendo elemento:", item)

    // Crear contenido para imprimir
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Información del Usuario - ${item.nombre}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              line-height: 1.6;
            }
            .header { 
              border-bottom: 2px solid #333; 
              padding-bottom: 10px; 
              margin-bottom: 20px; 
            }
            .field { 
              margin-bottom: 10px; 
            }
            .label { 
              font-weight: bold; 
              display: inline-block; 
              width: 120px; 
            }
            .footer { 
              margin-top: 30px; 
              padding-top: 10px; 
              border-top: 1px solid #ccc; 
              font-size: 12px; 
              color: #666; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Información del Usuario</h1>
          </div>
          <div class="field">
            <span class="label">ID:</span> ${item.id}
          </div>
          <div class="field">
            <span class="label">Nombre:</span> ${item.nombre}
          </div>
          <div class="field">
            <span class="label">Correo:</span> ${item.correo}
          </div>
          <div class="field">
            <span class="label">Teléfono:</span> ${item.telefono}
          </div>
          <div class="field">
            <span class="label">Cédula:</span> ${item.cedula}
          </div>
          <div class="field">
            <span class="label">Rol:</span> ${item.rol}
          </div>
          <div class="footer">
            <p>Fecha de impresión: ${new Date().toLocaleString()}</p>
            <p>Sistema de Gestión de Usuarios</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }, [])

  // Acción de exportar elemento individual
  const handleExport = useCallback((item: DataTable) => {
    console.log("Exportando elemento:", item)

    const dataToExport = {
      ...item,
      exportedAt: new Date().toISOString(),
      exportedBy: "Sistema de Gestión",
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `usuario_${item.id}_${item.nombre.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log("Elemento exportado:", item.nombre)
  }, [])

  return {
    // Acciones principales
    handleDuplicate,
    handleView,
    handleDelete,
    handleEdit,
    handleRoleChange,
    handlePrint,
    handleExport,

    // Estado del modal de vista
    viewModalOpen,
    selectedItemForView,
    closeViewModal,

    // Configuración
    showConfirmDialog,
  }
}

export type UseTableRowActionsReturn = ReturnType<typeof useTableRowActions>
