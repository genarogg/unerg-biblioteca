"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Edit, Shield } from "lucide-react"
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
import "./modal.css" // Asegúrate de tener este archivo CSS para estilos personalizados


import { useTableState } from "../../context/TableContext"
import type { DataTable } from "../../context/types"


interface EditUsuarioProps {
  user: DataTable
}

const EditUsuario: React.FC<EditUsuarioProps> = ({ user }) => {
  const { updateItem } = useTableState()

  // Inicializar el formulario con los datos del usuario
  const [formData, setFormData] = useState({
    nombre: user.nombre || "",
    correo: user.correo || "",
    telefono: user.telefono || "",
    cedula: user.cedula || "",
    rol: user.rol || "ADMIN_DACE",
  })

  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
    cedula: "",
  })

  // Actualizar el formulario cuando cambie el usuario
  useEffect(() => {
    setFormData({
      nombre: user.nombre || "",
      correo: user.correo || "",
      telefono: user.telefono || "",
      cedula: user.cedula || "",
      rol: user.rol || "ADMIN_DACE",
    })
  }, [user])

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

    // Actualizar el usuario existente
    const updatedUser = {
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim(),
      telefono: formData.telefono.trim(),
      cedula: formData.cedula.trim(),
      rol: formData.rol,
    }

    // Actualizar en la tabla
    updateItem(user.id, updatedUser)

    console.log("Usuario actualizado:", { id: user.id, ...updatedUser })
  }

  return (
    <>
      <Modal
        title=""
        icon={<Edit size={16} />}
        buttonClassName="table-modal-btn  action-btn modal"
        buttonText="Actualizar Usuario"
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
              name="telefono"
              type="tel"
              placeholder="04XX-XXXXXXX"
              onChange={handleChange}
              value={formData.telefono}
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
                <SelectItem value="ADMIN_DACE">Admin DACE</SelectItem>
                <SelectItem value="ADMIN_FUNDESUR">Admin FUNDESUR</SelectItem>
                <SelectItem value="SUPER_USUARIO">Super Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>


        </div>
      </Modal>
    </>
  )
}

export default EditUsuario
