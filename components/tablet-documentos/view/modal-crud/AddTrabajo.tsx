"use client"
import type React from "react"
import { useState } from "react"
import { FileText, BookOpen } from "lucide-react"
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

import { useTableState } from "../../context/TableContext"
import type { DataTable } from "../../context/types"
import "./add-usuario.css"

type AddTrabajoProps = {}

const AddTrabajo: React.FC<AddTrabajoProps> = () => {
  const { addItem } = useTableState()

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    lineaInvestigacion: "Inteligencia Artificial",
    autor: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

    // Crear nuevo trabajo de investigación
    const newTrabajo: DataTable = {
      id: Date.now(), // Generar ID único
      titulo: formData.titulo.trim(),
      lineaInvestigacion: formData.lineaInvestigacion,
      autor: formData.autor.trim(),
      estado: "VALIDADO", // Estado automáticamente validado
      archivo: selectedFile ? selectedFile.name : null, // Guardar nombre del archivo
    }

    // Agregar a la tabla
    addItem(newTrabajo)

    // Limpiar formulario
    setFormData({
      titulo: "",
      lineaInvestigacion: "Inteligencia Artificial",
      autor: "",
    })

    // Limpiar archivo seleccionado
    setSelectedFile(null)

    // Limpiar errores
    setErrors({ titulo: "", autor: "" })

    console.log("Nuevo trabajo de investigación agregado:", newTrabajo)
  }

  return (
    <>
      <Modal
        title="Agregar Trabajo de Investigación"
        icon={<FileText size={16} />}
        buttonClassName="table-modal-btn add-user-btn"
        buttonText="Guardar Trabajo"
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
                  backgroundColor: "#f0f9ff",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#0369a1",
                }}
              >
                📄 Archivo seleccionado: {selectedFile.name}
              </div>
            )}
          </div>

          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "#f0f9ff",
              borderRadius: "6px",
              border: "1px solid #bae6fd",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#0369a1",
                fontWeight: "500",
              }}
            >
              ℹ️ El estado del trabajo será automáticamente establecido como "VALIDADO"
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AddTrabajo
