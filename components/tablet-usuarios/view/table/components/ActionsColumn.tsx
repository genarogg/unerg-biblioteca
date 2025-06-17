"use client"

import { Copy, Eye, Trash2, FileText, MessageCircle } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../ux/select"
import Switch from "../../../../ux/btns/switch"
import "./css/actions-column.css"
import EditUsuario from "../../modal-crud/EditUsuario"

interface ActionsColumnProps {
  item: any
  onDuplicate?: (item: any) => void
  onView?: (item: any) => void
  onDelete?: (item: any) => void
  onEdit?: (item: any) => void
  onReport?: (item: any) => void
  onWhatsApp?: (item: any) => void
  onUpdateItem?: (itemId: number, updates: any) => void // Nueva prop para actualizar items
  showRoleSelect?: boolean
  showStatusSwitch?: boolean
  variant?: "table" | "card"
  visibleActions?: {
    duplicate?: boolean
    edit?: boolean
    view?: boolean
    delete?: boolean
    report?: boolean
    whatsapp?: boolean
  }
}

export default function ActionsColumn({
  item,
  onDuplicate,
  onView,
  onDelete,
  onEdit,
  onReport,
  onWhatsApp,
  onUpdateItem,
  showRoleSelect = true,
  showStatusSwitch = false,
  variant = "table",
  visibleActions = {
    duplicate: false,
    edit: true,
    view: false,
    delete: false,
    report: false,
    whatsapp: false,
  },
}: ActionsColumnProps) {
  const baseClass = variant === "table" ? "actions-cell" : "card-actions"
  const buttonClass = variant === "table" ? "action-btn" : "card-action-btn"

  // Función auxiliar para manejar el cambio de rol - centralizada
  const handleRoleChange = (value: string | string[]) => {
    const newRole = Array.isArray(value) ? value[0] : value
    if (newRole && onUpdateItem) {
      console.log("Cambio de rol:", item, newRole)
      onUpdateItem(item.id, { rol: newRole })
    }
  }

  // Función auxiliar para manejar el cambio de estado - centralizada
  const handleStatusToggle = () => {
    if (onUpdateItem) {
      const newStatus = item.status === "ACTIVO" ? "INACTIVO" : "ACTIVO"
      console.log(`Cambiando estado de ${item.nombre} a ${newStatus}`)
      onUpdateItem(item.id, { status: newStatus })
    }
  }

  // Función auxiliar para manejar la vista con log
  const handleViewClick = () => {
    if (onView) {
      console.log("Botón de vista clickeado para:", item.nombre)
      onView(item)
    }
  }

  // Función auxiliar para manejar la edición con modal
  const handleEditClick = () => {
    if (onEdit) {
      console.log("Botón de editar clickeado para:", item.nombre)
      onEdit(item)
    }
  }

  return (
    <div className={baseClass}>
      {/* Switch de estado para cards */}
      {showStatusSwitch && variant === "card" && (
        <div className="status-switch-container">
          <Switch isOn={item.status === "ACTIVO"} onToggle={handleStatusToggle} />
          <span className={`status-text ${item.status === "ACTIVO" ? "active" : "inactive"}`}>
            {item.status === "ACTIVO" ? "Activo" : "Inactivo"}
          </span>
        </div>
      )}

      {/* Select de rol */}
      {showRoleSelect && variant === "table" && (
        <Select value={item.rol} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="estudiante">Estudiante</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="super">Super</SelectItem>
          </SelectContent>
        </Select>
      )}


      {/* Botones de acción */}
      <div className="action-buttons-container">
        {visibleActions.duplicate && onDuplicate && (
          <button className={buttonClass} onClick={() => onDuplicate(item)} title="Duplicar elemento">
            <Copy size={16} />
          </button>
        )}
        {visibleActions.edit && <EditUsuario user={item} />}
        {visibleActions.view && onView && (
          <button className={buttonClass} onClick={handleViewClick} title="Ver detalles del elemento">
            <Eye size={16} />
          </button>
        )}
        {visibleActions.report && onReport && (
          <button className={buttonClass} onClick={() => onReport(item)} title="Generar reporte">
            <FileText size={16} />
          </button>
        )}
        {visibleActions.whatsapp && onWhatsApp && (
          <button className={buttonClass} onClick={() => onWhatsApp(item)} title="Enviar por WhatsApp">
            <MessageCircle size={16} />
          </button>
        )}
        {visibleActions.delete && onDelete && (
          <button className={buttonClass} onClick={() => onDelete(item)} title="Eliminar elemento">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
