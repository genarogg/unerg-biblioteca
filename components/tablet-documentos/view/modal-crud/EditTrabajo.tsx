"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Edit, BookOpen, FileText } from "lucide-react"
import Modal from "../../../ux/modal"
import Input from "../../../ux/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectLabel,
} from "../../../ux/select"
import "./modal.css"

import { useTableState } from "../../context/TableContext"
import type { DataTable } from "../../context/types"

interface EditTrabajoProps {
  trabajo: DataTable
}

const EditTrabajo: React.FC<EditTrabajoProps> = ({ trabajo }) => {
  const { updateItem } = useTableState()

  // Inicializar el formulario con los datos del trabajo
  const [formData, setFormData] = useState({
    titulo: trabajo.titulo || "",
    lineaInvestigacion: trabajo.lineaInvestigacion || "Inteligencia Artificial",
    autor: trabajo.autor || "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentFileName, setCurrentFileName] = useState<string | null>(trabajo.archivo || null)

  const [errors, setErrors] = useState({
    titulo: "",
    autor: "",
  })

  // Opciones de líneas de investigación
  const lineasInvestigacion = [
    "Inteligencia Artificial",
    "Desarrollo de Software",
    "Ciberseguridad",
    "Bases de Datos",
    "Redes de Computadores",
  ]

  // Actualizar el formulario cuando cambie el trabajo
  useEffect(() => {
    setFormData({
      titulo: trabajo.titulo || "",
      lineaInvestigacion: trabajo.lineaInvestigacion || "Inteligencia Artificial",
      autor: trabajo.autor || "",
    })
    setCurrentFileName(trabajo.archivo || null)
  }, [trabajo])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handler para el select de línea de investigación
  const handleLineaInvestigacionChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value
    setFormData((prev) => ({ ...prev, lineaInvestigacion: selectedValue }))
  }

  // Handler para el archivo PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        alert("Por favor selecciona un archivo PDF válido")
        e.target.value = ""
      }
    }
  }

  const validateForm = () => {
    const newErrors = { titulo: "", autor: "" }
    let isValid = true

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido"
      isValid = false
    }

    if (!formData.autor.trim()) {
      newErrors.autor = "El autor es requerido"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    // Actualizar el trabajo existente
    const updatedTrabajo = {
      titulo: formData.titulo.trim(),
      lineaInvestigacion: formData.lineaInvestigacion,
      autor: formData.autor.trim(),
      archivo: selectedFile ? selectedFile.name : currentFileName, // Mantener archivo actual si no se selecciona uno nuevo
    }

    // Actualizar en la tabla
    updateItem(trabajo.id, updatedTrabajo)

    console.log("Trabajo de investigación actualizado:", { id: trabajo.id, ...updatedTrabajo })
  }

  return (
    <>
      <Modal
  
        icon={<Edit size={16} />}
        buttonClassName="table-modal-btn action-btn modal"
        buttonText="Actualizar Trabajo"
        onclick={handleSave}
      >
        <div className="add-user-form">
          <div style={{ marginBottom: "16px" }}>
            <Input
              name="titulo"
              type="text"
              placeholder="Ingrese el título del trabajo"
              required
              onChange={handleChange}
              error={errors.titulo}
              value={formData.titulo}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              <BookOpen size={16} style={{ marginRight: "8px" }} />
              Línea de Investigación
            </label>
            <Select value={formData.lineaInvestigacion} onValueChange={handleLineaInvestigacionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar línea de investigación" />
              </SelectTrigger>
              <SelectContent>
                <SelectLabel>Líneas de investigación disponibles</SelectLabel>
                <SelectSeparator />
                {lineasInvestigacion.map((linea) => (
                  <SelectItem key={linea} value={linea}>
                    {linea}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Input
              name="autor"
              type="text"
              placeholder="Ingrese el nombre del autor"
              required
              onChange={handleChange}
              error={errors.autor}
              value={formData.autor}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              <FileText size={16} style={{ marginRight: "8px" }} />
              Documento PDF
            </label>

            {/* Mostrar archivo actual si existe */}
            {currentFileName && !selectedFile && (
              <div
                style={{
                  marginBottom: "8px",
                  padding: "8px 12px",
                  backgroundColor: "#f0f9ff",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#0369a1",
                  border: "1px solid #bae6fd",
                }}
              >
                📄 Archivo actual: {currentFileName}
              </div>
            )}

            <input
              type="file"
              name="pdf"
              accept=".pdf"
              onChange={handleFileChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
            />

            {selectedFile && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#059669",
                  border: "1px solid #a7f3d0",
                }}
              >
                📄 Nuevo archivo seleccionado: {selectedFile.name}
              </div>
            )}

            <div
              style={{
                marginTop: "4px",
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              {currentFileName ? "Selecciona un nuevo archivo para reemplazar el actual" : "Selecciona un archivo PDF"}
            </div>
          </div>

          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "#fef3c7",
              borderRadius: "6px",
              border: "1px solid #fbbf24",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#92400e",
                fontWeight: "500",
              }}
            >
              ⚠️ Los cambios se aplicarán inmediatamente al trabajo de investigación
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default EditTrabajo
