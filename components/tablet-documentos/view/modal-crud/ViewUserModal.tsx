"use client"
import type React from "react"
import { Eye, User, Mail, Phone, CreditCard, Shield, Calendar, Hash } from "lucide-react"
import type { DataTable } from "../../context/types"
import "./view-user-modal.css"

interface ViewUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: DataTable | null
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ADMIN_DACE":
        return "Administrador DACE"
      case "ADMIN_FUNDESUR":
        return "Administrador FUNDESUR"
      case "SUPER_USUARIO":
        return "Super Usuario"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN_DACE":
        return "role-admin-dace"
      case "ADMIN_FUNDESUR":
        return "role-admin-fundesur"
      case "SUPER_USUARIO":
        return "role-super-usuario"
      default:
        return "role-default"
    }
  }

  return (
    <div className={`view-modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="view-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="view-modal-header">
          <div className="view-modal-title">
            <Eye size={24} />
            <h2>Información del Usuario</h2>
          </div>
          <button className="view-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="view-modal-body">
          {/* Avatar y nombre principal */}
          <div className="user-profile-section">
            <div className="user-avatar">
              <User size={48} />
            </div>
            <div className="user-main-info">
              <h3 className="user-name">{user.nombre}</h3>
              <span className={`user-role-badge ${getRoleColor(user.rol)}`}>
                <Shield size={14} />
                {getRoleDisplayName(user.rol)}
              </span>
            </div>
          </div>

          {/* Información detallada */}
          <div className="user-details-grid">
            <div className="detail-card">
              <div className="detail-icon">
                <Hash size={20} />
              </div>
              <div className="detail-content">
                <span className="detail-label">ID de Usuario</span>
                <span className="detail-value">{user.id}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <Mail size={20} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Correo Electrónico</span>
                <span className="detail-value email-value">{user.correo}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <Phone size={20} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">{user.telefono}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <CreditCard size={20} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Cédula de Identidad</span>
                <span className="detail-value">{user.cedula}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <Calendar size={20} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Fecha de Consulta</span>
                <span className="detail-value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="additional-info">
            <h4>Información del Sistema</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className="info-value status-active">Activo</span>
              </div>
              <div className="info-item">
                <span className="info-label">Último acceso:</span>
                <span className="info-value">Hace 2 horas</span>
              </div>
              <div className="info-item">
                <span className="info-label">Permisos:</span>
                <span className="info-value">Lectura/Escritura</span>
              </div>
            </div>
          </div>
        </div>

        <div className="view-modal-footer">
          <button className="view-modal-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewUserModal
