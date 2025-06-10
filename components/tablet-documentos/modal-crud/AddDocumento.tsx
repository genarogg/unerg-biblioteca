"use client"
import type React from "react"
import { useState } from "react"
import { Plus, FileText, Upload, CheckCircle } from "lucide-react"

import Modal from "../../ux/modal"
import "./add-documento.css"

interface AddDocumentoProps {
  areas?: Array<{ id: number; nombre: string }>
  onSave?: (documento: any) => void
}

const AddDocumento: React.FC<AddDocumentoProps> = ({ areas = [], onSave }) => {
  const [documento, setDocumento] = useState({
    titulo: "",
    area: "",
    autor: "",
    archivo: null as File | null,
    resumen: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!documento.titulo.trim()) {
      newErrors.titulo = "El título es requerido"
    }

    if (!documento.area) {
      newErrors.area = "Debe seleccionar un área"
    }

    if (!documento.autor.trim()) {
      newErrors.autor = "El autor es requerido"
    }

    if (!documento.archivo) {
      newErrors.archivo = "Debe seleccionar un archivo PDF"
    }

    if (!documento.resumen.trim()) {
      newErrors.resumen = "El resumen es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGuardarDocumento = () => {
    if (validateForm()) {
      onSave?.(documento)
      setDocumento({ titulo: "", area: "", autor: "", archivo: null, resumen: "" })
      setErrors({})
      console.log("Documento guardado:", documento)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setDocumento({ ...documento, archivo: file })
      if (errors.archivo) {
        setErrors({ ...errors, archivo: "" })
      }
    } else if (file) {
      setErrors({ ...errors, archivo: "Solo se permiten archivos PDF" })
    }
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <Modal
      title="Nuevo Documento"
      icon={<Plus size={16} />}
      buttonClassName="table-modal-btn add-btn"
      buttonText="Guardar Documento"
      onclick={handleGuardarDocumento}
    >
      <div className="documento-modal-content">
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Título <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.titulo ? "error" : ""}`}
                placeholder="Título del documento"
                value={documento.titulo}
                onChange={(e) => {
                  setDocumento({ ...documento, titulo: e.target.value })
                  clearError("titulo")
                }}
              />
              {errors.titulo && <div className="error-message">{errors.titulo}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Área <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.area ? "error" : ""}`}
                value={documento.area}
                onChange={(e) => {
                  setDocumento({ ...documento, area: e.target.value })
                  clearError("area")
                }}
              >
                <option value="">Seleccione un área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.nombre}>
                    {area.nombre}
                  </option>
                ))}
              </select>
              {errors.area && <div className="error-message">{errors.area}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Autor <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.autor ? "error" : ""}`}
              placeholder="Nombre del autor"
              value={documento.autor}
              onChange={(e) => {
                setDocumento({ ...documento, autor: e.target.value })
                clearError("autor")
              }}
            />
            {errors.autor && <div className="error-message">{errors.autor}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Documento PDF <span className="required">*</span>
            </label>
            <div
              className={`file-upload-area ${documento.archivo ? "has-file" : ""} ${errors.archivo ? "error" : ""}`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="file-upload-input"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <div className="file-upload-content">
                {documento.archivo ? (
                  <>
                    <CheckCircle size={24} className="file-upload-icon" />
                    <div className="file-selected">
                      <FileText size={16} />
                      {documento.archivo.name}
                    </div>
                    <div className="file-upload-hint">Haz clic para cambiar el archivo</div>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="file-upload-icon" />
                    <div className="file-upload-text">Seleccionar archivo PDF</div>
                    <div className="file-upload-hint">Máximo 10MB</div>
                  </>
                )}
              </div>
            </div>
            {errors.archivo && <div className="error-message">{errors.archivo}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Resumen <span className="required">*</span>
            </label>
            <textarea
              className={`form-textarea ${errors.resumen ? "error" : ""}`}
              placeholder="Descripción breve del contenido del documento"
              value={documento.resumen}
              onChange={(e) => {
                setDocumento({ ...documento, resumen: e.target.value })
                clearError("resumen")
              }}
            />
            <div className="char-counter">{documento.resumen.length}/500 caracteres</div>
            {errors.resumen && <div className="error-message">{errors.resumen}</div>}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddDocumento
