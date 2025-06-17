"use client"

import type React from "react"
import useGenericSelectFilter from "../hook/useGenericSelectFilter"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../ux/select"

// Interfaz común para props de filtros
interface FilterSelectProps {
  className?: string
  disabled?: boolean
}

// Filtro de Estado/Status
const SelectStatus: React.FC<FilterSelectProps> = ({ className = "" }) => {
  const { options, selectedValue, handleChange } = useGenericSelectFilter({
    filterType: "status",
    staticOptions: [
      { value: "todos", label: "TODOS" },
      { value: "activo", label: "ACTIVO" },
      { value: "inactivo", label: "INACTIVO" },
    ],
    defaultValue: "todos",
  })

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%", // This will be overridden by CSS for desktop
    minWidth: "160px",
  }

  return (
    <div style={containerStyle} className={className}>
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un estado" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Filtro de Rol/Role
const SelectRol: React.FC<FilterSelectProps> = ({ className = "" }) => {
  const { options, selectedValue, handleChange } = useGenericSelectFilter({
    filterType: "role",
    staticOptions: [
      { value: "todos", label: "TODOS" },
      { value: "estudiante", label: "ESTUDIANTE" },
      { value: "editor", label: "EDITOR" },
      { value: "super", label: "SUPER" },
    ],
    defaultValue: "todos",
  })

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%", // This will be overridden by CSS for desktop
    minWidth: "160px",
  }

  return (
    <div style={containerStyle} className={className}>
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un rol" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Exportar los filtros
export { SelectStatus, SelectRol }
