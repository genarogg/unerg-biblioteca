"use client"
import type React from "react"
import { useState } from "react"
import { UserPlus, Shield } from "lucide-react"
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

type AddUsuarioProps = {}

const AddUsuario: React.FC<AddUsuarioProps> = () => {
  const { addItem } = useTableState()

  // Cambiar de useRef a useState para que React pueda rastrear los cambios
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    cedula: "",
    rol: "estudiante",
  })

  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
    cedula: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handler para el select
  const handleSelectChange = (value: string | string[]) => {
    // Como sabemos que solo seleccionamos un rol, tomamos el primer valor si es array
    const selectedValue = Array.isArray(value) ? value[0] : value
    setFormData((prev) => ({ ...prev, rol: selectedValue }))
  }

  const validateForm = () => {
    const newErrors = { nombre: "", correo: "", cedula: "" }
    let isValid = true

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
      isValid = false
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo válido"
      isValid = false
    }

    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es requerida"
      isValid = false
    } else if (!/^\d{7,8}$/.test(formData.cedula.trim())) {
      newErrors.cedula = "La cédula debe tener entre 7 y 8 dígitos"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    // Crear nuevo usuario
    const newUser: DataTable = {
      id: Date.now(),
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim(),
      cedula: formData.cedula.trim(),
      rol: formData.rol,
      status: "activo",
    }

    // Agregar a la tabla
    addItem(newUser)

    // Limpiar formulario
    setFormData({
      nombre: "",
      correo: "",
      cedula: "",
      rol: "estudiante",
    })

    // Limpiar errores
    setErrors({ nombre: "", correo: "", cedula: "" })

    console.log("Nuevo usuario agregado:", newUser)
  }

  return (
    <>
      <Modal
        title="Agregar Usuario"
        icon={<UserPlus size={16} />}
        buttonClassName="table-modal-btn add-user-btn"
        buttonText="Guardar Usuario"
        onclick={handleSave}
      >
        <div className="add-user-form">
          <div style={{ marginBottom: "16px" }}>
            <Input
              name="nombre"
              type="text"
              placeholder="Ingrese el nombre completo"
              required
              onChange={handleChange}
              error={errors.nombre}
              value={formData.nombre}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Input
              name="correo"
              type="email"
              placeholder="ejemplo@correo.com"
              required
              onChange={handleChange}
              error={errors.correo}
              value={formData.correo}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Input
              name="cedula"
              type="text"
              placeholder="12345678"
              required
              onChange={handleChange}
              error={errors.cedula}
              value={formData.cedula}
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
              <Shield size={16} style={{ marginRight: "8px" }} />
              Rol del usuario
            </label>
            <Select value={formData.rol} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectLabel>Roles disponibles</SelectLabel>
                <SelectSeparator />
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="super">Super</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AddUsuario
