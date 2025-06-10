"use client"
import type React from "react"
import { useState } from "react"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import Modal from "../../ux/modal"
import type { User } from "../fn/defaultUsers"
import "./add-usuario.css"

interface AddUsuarioProps {
  onAddUser: (user: User) => void
}

interface FormData {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  contraseña: string
  rol: string
  cedula: string
  comentario: string
}

interface FormErrors {
  nombre?: string
  apellido?: string
  telefono?: string
  correo?: string
  contraseña?: string
  rol?: string
  cedula?: string
}

const AddUsuario: React.FC<AddUsuarioProps> = ({ onAddUser }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    contraseña: "",
    rol: "",
    cedula: "",
    comentario: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres"
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido"
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres"
    }

    // Validar teléfono
    const phoneRegex = /^04\d{2}-\d{7}$/
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = "Formato: 04XX-XXXXXXX"
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido"
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Formato de correo inválido"
    }

    // Validar contraseña
    if (!formData.contraseña) {
      newErrors.contraseña = "La contraseña es requerida"
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres"
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = "Debe seleccionar un rol"
    }

    // Validar cédula
    const cedulaRegex = /^[VE]-?\d{7,8}$/
    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es requerida"
    } else if (!cedulaRegex.test(formData.cedula)) {
      newErrors.cedula = "Formato: V-12345678 o E-12345678"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Función para manejar cambios en los inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  // Función para formatear el teléfono automáticamente
  const handlePhoneChange = (value: string) => {
    // Remover todo excepto números
    const numbers = value.replace(/\D/g, "")

    // Formatear automáticamente
    if (numbers.length >= 4) {
      const formatted = `${numbers.slice(0, 4)}-${numbers.slice(4, 11)}`
      handleInputChange("telefono", formatted)
    } else {
      handleInputChange("telefono", numbers)
    }
  }

  // Función para formatear la cédula automáticamente
  const handleCedulaChange = (value: string) => {
    // Permitir solo V, E y números
    const cleaned = value.toUpperCase().replace(/[^VE0-9]/g, "")

    if (cleaned.length > 0) {
      if (cleaned.length === 1 && (cleaned === "V" || cleaned === "E")) {
        handleInputChange("cedula", cleaned + "-")
      } else if (cleaned.includes("V") || cleaned.includes("E")) {
        const letter = cleaned.charAt(0)
        const numbers = cleaned.slice(1)
        handleInputChange("cedula", `${letter}-${numbers}`)
      } else {
        handleInputChange("cedula", cleaned)
      }
    } else {
      handleInputChange("cedula", "")
    }
  }

  // Función para limpiar el formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      contraseña: "",
      rol: "",
      cedula: "",
      comentario: "",
    })
    setErrors({})
    setShowPassword(false)
    setIsSubmitting(false)
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return false // Devolver false para que el modal no se cierre
    }

    setIsSubmitting(true)

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Crear el nuevo usuario
      const newUser: User = {
        id: Date.now(), // ID temporal basado en timestamp
        nombre: `${formData.nombre.trim()} ${formData.apellido.trim()}`,
        correo: formData.correo.trim(),
        telefono: formData.telefono,
        cedula: formData.cedula,
        rol: formData.rol as "SUPER_USUARIO" | "EDITOR",
      }

      // Agregar el usuario a la tabla
      onAddUser(newUser)

      // Limpiar el formulario
      resetForm()

      // Mostrar mensaje de éxito (opcional)
      console.log("Usuario agregado exitosamente:", newUser)
      
      return true // Devolver true para que el modal se cierre
    } catch (error) {
      console.error("Error al agregar usuario:", error)
      setIsSubmitting(false)
      return false // Devolver false si hay error
    }
  }

  return (
    <>
      <Modal
        title="Agregar Usuario"
        icon={<UserPlus size={16} />}
        buttonClassName="add-user-trigger"
        buttonText={isSubmitting ? "Agregando..." : "Agregar Usuario"}
        onclick={handleSubmit}
      >
        <div className="add-usuario-form-container">
          <form className="add-usuario-form" onSubmit={(e) => e.preventDefault()}>
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className={`form-input ${errors.nombre ? "error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label htmlFor="apellido" className="form-label">
                Apellido <span className="required">*</span>
              </label>
              <input
                id="apellido"
                type="text"
                placeholder="Apellido completo"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                className={`form-input ${errors.apellido ? "error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.apellido && <span className="error-message">{errors.apellido}</span>}
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                Teléfono <span className="required">*</span>
              </label>
              <input
                id="telefono"
                type="text"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`form-input ${errors.telefono ? "error" : ""}`}
                maxLength={12}
                disabled={isSubmitting}
              />
              {errors.telefono && <span className="error-message">{errors.telefono}</span>}
            </div>

            {/* Correo Electrónico */}
            <div className="form-group">
              <label htmlFor="correo" className="form-label">
                Correo Electrónico <span className="required">*</span>
              </label>
              <input
                id="correo"
                type="email"
                placeholder="solicitudes@unerg.edu.ve"
                value={formData.correo}
                onChange={(e) => handleInputChange("correo", e.target.value)}
                className={`form-input ${errors.correo ? "error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.correo && <span className="error-message">{errors.correo}</span>}
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="contraseña" className="form-label">
                Contraseña <span className="required">*</span>
              </label>
              <div className="password-container">
                <input
                  id="contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.contraseña}
                  onChange={(e) => handleInputChange("contraseña", e.target.value)}
                  className={`form-input ${errors.contraseña ? "error" : ""}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.contraseña && <span className="error-message">{errors.contraseña}</span>}
            </div>

            {/* Rol */}
            <div className="form-group">
              <label htmlFor="rol" className="form-label">
                Rol <span className="required">*</span>
              </label>
              <select
                id="rol"
                value={formData.rol}
                onChange={(e) => handleInputChange("rol", e.target.value)}
                className={`form-select ${errors.rol ? "error" : ""}`}
                disabled={isSubmitting}
              >
                <option value="">Seleccionar rol</option>
                <option value="SUPER_USUARIO">Super Usuario</option>
                <option value="EDITOR">Editor</option>
              </select>
              {errors.rol && <span className="error-message">{errors.rol}</span>}
            </div>

            {/* Cédula */}
            <div className="form-group">
              <label htmlFor="cedula" className="form-label">
                Cédula <span className="required">*</span>
              </label>
              <input
                id="cedula"
                type="text"
                placeholder="Número de cédula"
                value={formData.cedula}
                onChange={(e) => handleCedulaChange(e.target.value)}
                className={`form-input ${errors.cedula ? "error" : ""}`}
                maxLength={11}
                disabled={isSubmitting}
              />
              {errors.cedula && <span className="error-message">{errors.cedula}</span>}
            </div>

            {/* Comentario */}
            <div className="form-group">
              <label htmlFor="comentario" className="form-label">
                Comentario
              </label>
              <textarea
                id="comentario"
                placeholder="Agregar comentario..."
                value={formData.comentario}
                onChange={(e) => handleInputChange("comentario", e.target.value)}
                className="form-textarea"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default AddUsuario