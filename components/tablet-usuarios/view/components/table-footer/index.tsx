"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { Users, Copy, Trash2 } from "lucide-react"
import "./table-footer.css"
import { useTableState } from "../../../context/TableContext"
import type { DataTable } from "../../../context/types"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../ux/select"

export default function TableFooter() {
  const { getSelectedItems, selectedCount, updateSelectedItemsRole, clearSelection, addItem, deleteSelectedItems } =
    useTableState()

  const [showBulkBar, setShowBulkBar] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const bulkBarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Controlar la visibilidad de la barra con animación suave
  useEffect(() => {
    if (selectedCount > 0) {
      setShowBulkBar(true)
    } else {
      setShowBulkBar(false)
    }
  }, [selectedCount])

  // Función para detectar si la barra debe ser sticky o fixed
  const checkPosition = useCallback(() => {
    if (!bulkBarRef.current) return

    // Buscar el contenedor de la tabla
    const tableContainer = document.querySelector(".table-management-container") as HTMLDivElement
    if (!tableContainer) return

    const containerRect = tableContainer.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const barHeight = 80 // Altura aproximada de la barra

    // Si el final del contenedor está visible en la pantalla
    const containerBottomVisible = containerRect.bottom <= viewportHeight

    // Si el contenedor es más pequeño que la pantalla o su final está visible
    if (containerBottomVisible || containerRect.height < viewportHeight - 100) {
      setIsSticky(true) // Usar position absolute dentro del contenedor
    } else {
      setIsSticky(false) // Usar position fixed en la pantalla
    }
  }, [])

  // Escuchar scroll y resize para ajustar posición
  useEffect(() => {
    if (!showBulkBar) return

    checkPosition()

    const handleScroll = () => checkPosition()
    const handleResize = () => checkPosition()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)

    // Verificar posición inicial después de un pequeño delay
    const timeoutId = setTimeout(checkPosition, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [showBulkBar, checkPosition])

  // Asegurar que el contenedor tenga la referencia correcta
  useEffect(() => {
    const tableContainer = document.querySelector(".table-management-container") as HTMLDivElement
    if (tableContainer) {
      containerRef.current = tableContainer
    }
  }, [])

  const handleBulkRoleChange = (value: string | string[]) => {
    const newRole = Array.isArray(value) ? value[0] : value
    const selectedItems = getSelectedItems()
    if (selectedItems.length === 0) {
      console.log("No hay elementos seleccionados para cambiar rol")
      return
    }

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres cambiar el rol de ${selectedItems.length} usuario(s) a "${getRoleDisplayName(newRole)}"?\n\nEsta acción afectará a:\n${selectedItems.map((item) => `• ${item.nombre}`).join("\n")}`,
    )

    if (confirmed) {
      updateSelectedItemsRole(newRole)
      console.log(`Rol cambiado masivamente a ${newRole} para ${selectedItems.length} usuarios`)

      // Mostrar notificación de éxito
      showNotification(`✓ Rol actualizado para ${selectedItems.length} usuario(s)`, "success")

      // Limpiar selección después del cambio
      clearSelection()
    }
  }

  const handleBulkDuplicate = () => {
    const selectedItems = getSelectedItems()
    if (selectedItems.length === 0) {
      console.log("No hay elementos seleccionados para duplicar")
      return
    }

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres duplicar ${selectedItems.length} usuario(s)?\n\nEsto creará copias de:\n${selectedItems.map((item) => `• ${item.nombre}`).join("\n")}`,
    )

    if (confirmed) {
      // Duplicar cada elemento seleccionado
      selectedItems.forEach((item) => {
        const newItem: DataTable = {
          ...item,
          id: Date.now() + Math.random(), // Generar ID único
          nombre: `${item.nombre} (Copia)`,
          correo: item.correo.includes("copia_")
            ? `copia_${Date.now()}_${item.correo.replace(/^copia_\d+_/, "")}`
            : `copia_${item.correo}`,
        }

        addItem(newItem)
      })

      console.log(`${selectedItems.length} usuarios duplicados exitosamente`)

      // Mostrar notificación de éxito
      showNotification(`✓ ${selectedItems.length} usuario(s) duplicado(s) exitosamente`, "success")

      // Limpiar selección después de duplicar
      clearSelection()
    }
  }

  const handleBulkDelete = () => {
    const selectedItems = getSelectedItems()
    if (selectedItems.length === 0) {
      console.log("No hay elementos seleccionados para eliminar")
      return
    }

    const confirmed = window.confirm(
      `⚠️ ATENCIÓN: Esta acción eliminará permanentemente ${selectedItems.length} usuario(s).\n\n` +
      `Usuarios que serán eliminados:\n${selectedItems.map((item) => `• ${item.nombre} (${item.correo})`).join("\n")}\n\n` +
      `Esta acción NO se puede deshacer. ¿Estás completamente seguro?`,
    )

    if (confirmed) {
      // Confirmación adicional para eliminación masiva
      const doubleConfirmed = window.confirm(
        `🚨 CONFIRMACIÓN FINAL\n\nVas a eliminar ${selectedItems.length} usuario(s) permanentemente.\n\n¿Proceder con la eliminación?`,
      )

      if (doubleConfirmed) {
        deleteSelectedItems()

        console.log(`${selectedItems.length} usuarios eliminados exitosamente`)

        // Mostrar notificación de éxito
        showNotification(`🗑️ ${selectedItems.length} usuario(s) eliminado(s) exitosamente`, "success")
      }
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ADMIN_DACE":
        return "Admin DACE"
      case "ADMIN_FUNDESUR":
        return "Admin FUNDESUR"
      case "SUPER_USUARIO":
        return "Super Usuario"
      default:
        return role
    }
  }

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    const notification = document.createElement("div")
    notification.className = `bulk-action-notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Opciones de roles para cambio masivo (sin "Todos")
  const bulkRoleOptions = [
    { value: "ADMIN_DACE", label: "Admin DACE" },
    { value: "ADMIN_FUNDESUR", label: "Admin FUNDESUR" },
    { value: "SUPER_USUARIO", label: "Super Usuario" },
  ]

  if (!showBulkBar) return null

  return (
    <div
      ref={bulkBarRef}
      className={`bulk-actions-bar ${showBulkBar ? "visible" : ""} ${isSticky ? "sticky" : "fixed"}`}
    >
      <div className="bulk-actions-info">
        <Users size={20} />
        <span className="bulk-count">{selectedCount} elemento(s) seleccionado(s)</span>
      </div>

      <div className="bulk-actions-controls">
        <div className="bulk-role-change">
          <span className="bulk-label">Cambiar rol a:</span>
          <Select onValueChange={handleBulkRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              {bulkRoleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bulk-action-buttons">
          <button
            className="bulk-action-btn duplicate-btn"
            onClick={handleBulkDuplicate}
            title={`Duplicar ${selectedCount} elemento(s) seleccionado(s)`}
          >
            <Copy size={16} />
            Duplicar ({selectedCount})
          </button>

          <button
            className="bulk-action-btn delete-btn"
            onClick={handleBulkDelete}
            title={`Eliminar ${selectedCount} elemento(s) seleccionado(s)`}
          >
            <Trash2 size={16} />
            Eliminar ({selectedCount})
          </button>
        </div>

        <button className="bulk-clear-btn" onClick={clearSelection} title="Limpiar selección">
          Limpiar selección
        </button>
      </div>
    </div>
  )
}