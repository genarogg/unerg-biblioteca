"use client"

import type React from "react"
import useGenericSelectFilter from "../hook/useGenericSelectFilter"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../ux/select"

// Interfaz común para props de filtros
interface FilterSelectProps {
  className?: string
  disabled?: boolean
}

// Filtro de Estado
const SelectStatus: React.FC<FilterSelectProps> = ({ className = "" }) => {
  const { options, selectedValue, handleChange } = useGenericSelectFilter({
    filterType: "estado",
    staticOptions: [
      { value: "todos", label: "TODOS" },
      { value: "PENDIENTE", label: "PENDIENTE" },
      { value: "VALIDADO", label: "VALIDADO" },
    ],
    defaultValue: "todos",
  })

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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

// Filtro de Línea de Investigación - CORREGIDO
const SelectLineaInvestigacion: React.FC<FilterSelectProps> = ({ className = "" }) => {
  const { options, selectedValue, handleChange } = useGenericSelectFilter({
    filterType: "lineaInvestigacion",
    staticOptions: [
      { value: "todos", label: "TODAS" },
      { value: "Inteligencia Artificial", label: "INTELIGENCIA ARTIFICIAL" },
      { value: "Desarrollo de Software", label: "DESARROLLO DE SOFTWARE" },
      { value: "Ciberseguridad", label: "CIBERSEGURIDAD" },
      { value: "Bases de Datos", label: "BASES DE DATOS" },
      { value: "Redes de Computadores", label: "REDES DE COMPUTADORES" },
    ],
    defaultValue: "todos",
  })

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: "180px",
  }

  return (
    <div style={containerStyle} className={className}>
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una línea" />
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

// Exportar los filtros actualizados
export { SelectStatus, SelectLineaInvestigacion }
