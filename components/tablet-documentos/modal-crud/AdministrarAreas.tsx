"use client"
import type React from "react"
import { useState } from "react"
import { Plus, Edit2, Save, X, Settings } from "lucide-react"

import Modal from "../../ux/modal"
import "./administrar-areas.css"

interface Area {
  id: number
  nombre: string
}

const areasIniciales: Area[] = [
  { id: 1, nombre: "Tecnología" },
  { id: 2, nombre: "Ciencias" },
  { id: 3, nombre: "Administración" },
  { id: 4, nombre: "Educación" },
  { id: 5, nombre: "Salud" },
]

interface AdministrarAreasProps {
  onAreasChange?: (areas: Area[]) => void
}

const AdministrarAreas: React.FC<AdministrarAreasProps> = ({ onAreasChange }) => {
  const [areas, setAreas] = useState<Area[]>(areasIniciales)
  const [nuevaArea, setNuevaArea] = useState("")
  const [editandoArea, setEditandoArea] = useState<number | null>(null)
  const [textoEditArea, setTextoEditArea] = useState("")

  const handleAgregarArea = () => {
    if (nuevaArea.trim() && !areas.some((area) => area.nombre.toLowerCase() === nuevaArea.toLowerCase())) {
      const nuevaAreaObj: Area = {
        id: Math.max(...areas.map((a) => a.id)) + 1,
        nombre: nuevaArea.trim(),
      }
      const nuevasAreas = [...areas, nuevaAreaObj]
      setAreas(nuevasAreas)
      setNuevaArea("")
      onAreasChange?.(nuevasAreas)
    }
  }

  const handleEditarArea = (area: Area) => {
    setEditandoArea(area.id)
    setTextoEditArea(area.nombre)
  }

  const handleGuardarEdicion = (areaId: number) => {
    if (textoEditArea.trim()) {
      const nuevasAreas = areas.map((area) => (area.id === areaId ? { ...area, nombre: textoEditArea.trim() } : area))
      setAreas(nuevasAreas)
      setEditandoArea(null)
      setTextoEditArea("")
      onAreasChange?.(nuevasAreas)
    }
  }

  const handleCancelarEdicion = () => {
    setEditandoArea(null)
    setTextoEditArea("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action()
    }
  }

  return (
    <Modal
      title="Administrar Áreas"
      icon={<Settings size={16} />}
      buttonClassName="table-modal-btn manage-areas-btn"
      buttonText="Administrar Áreas"
    >
      <div className="areas-modal-content">
        {/* Sección para agregar nueva área */}
        <div className="add-area-section">
          <div className="add-area-form">
            <input
              type="text"
              className="area-input"
              placeholder="Nombre de la nueva área"
              value={nuevaArea}
              onChange={(e) => setNuevaArea(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAgregarArea)}
            />
            <button type="button" className="add-btn" onClick={handleAgregarArea} disabled={!nuevaArea.trim()}>
              <Plus size={16} />
              Agregar
            </button>
          </div>
        </div>

        {/* Lista de áreas existentes */}
        <div className="areas-list-section">
          <div className="areas-list-header">
            <span className="areas-count">{areas.length} áreas registradas</span>
          </div>

          <div className="areas-container">
            {areas.length === 0 ? (
              <div className="empty-areas">
                <div className="empty-icon">📁</div>
                <div className="empty-text">No hay áreas registradas</div>
              </div>
            ) : (
              <div className="areas-list">
                {areas.map((area) => (
                  <div key={area.id} className="area-item">
                    {editandoArea === area.id ? (
                      <>
                        <input
                          type="text"
                          className="area-edit-input"
                          value={textoEditArea}
                          onChange={(e) => setTextoEditArea(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, () => handleGuardarEdicion(area.id))}
                          autoFocus
                        />
                        <div className="area-actions">
                          <button
                            className="action-btn save-btn"
                            onClick={() => handleGuardarEdicion(area.id)}
                            title="Guardar cambios"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            className="action-btn cancel-btn"
                            onClick={handleCancelarEdicion}
                            title="Cancelar edición"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="area-name">{area.nombre}</span>
                        <div className="area-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditarArea(area)}
                            title="Editar área"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AdministrarAreas
