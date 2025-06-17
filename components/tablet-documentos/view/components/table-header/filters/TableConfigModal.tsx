"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Settings, Eye, EyeOff } from "lucide-react"
import Modal from "../../../../../ux/modal"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../ux/select"
import { useTableContext, useTableState } from "../../../../context/TableContext"
import "./css/table-config-modal.css"

interface TableConfigModalProps {
  className?: string
}

const TableConfigModal: React.FC<TableConfigModalProps> = ({ className = "" }) => {
  const { config, responsiveViewState } = useTableContext()
  const { totalItems, updateTableConfig, updateItemsPerPage, itemsPerPage } = useTableState()

  // Estados locales para la configuración - inicializar con valores actuales
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage)
  const [localColumns, setLocalColumns] = useState(config.columns)
  const [localSelect, setLocalSelect] = useState(config.select)
  const [localCuadricula, setLocalCuadricula] = useState(config.cuadricula)
  const [localViewMode, setLocalViewMode] = useState(responsiveViewState.viewMode)
  const [localAutoResponsive, setLocalAutoResponsive] = useState(responsiveViewState.isAutoMode)

  // Actualizar estados locales cuando cambien los valores del contexto
  useEffect(() => {
    setLocalItemsPerPage(itemsPerPage)
  }, [itemsPerPage])

  useEffect(() => {
    setLocalColumns([...config.columns])
  }, [config.columns])

  useEffect(() => {
    setLocalSelect(config.select)
  }, [config.select])

  useEffect(() => {
    setLocalCuadricula(config.cuadricula)
  }, [config.cuadricula])

  const handleSaveConfig = () => {
    console.log("Guardando configuración:", {
      itemsPerPage: localItemsPerPage,
      columns: localColumns,
      select: localSelect,
      cuadricula: localCuadricula,
      viewMode: localViewMode,
      autoResponsive: localAutoResponsive,
    })

    // Aplicar cambios al contexto
    updateItemsPerPage(localItemsPerPage)
    updateTableConfig({
      columns: localColumns,
      select: localSelect,
      cuadricula: localCuadricula,
    })

    // Aplicar cambios de vista responsiva
    if (!localAutoResponsive) {
      responsiveViewState.handleViewModeChange(localViewMode)
    } else {
      responsiveViewState.toggleAutoMode()
    }

    // Guardar en localStorage para persistencia
    const tableConfig = {
      itemsPerPage: localItemsPerPage,
      select: localSelect,
      cuadricula: localCuadricula,
      viewMode: localViewMode,
      autoResponsive: localAutoResponsive,
      hiddenColumns: localColumns.filter((col) => col.hidden).map((col) => col.id),
    }

    localStorage.setItem("tableConfig", JSON.stringify(tableConfig))
  }

  const toggleColumnVisibility = (columnId: string) => {
    setLocalColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, hidden: !col.hidden } : col)))
  }

  const resetToDefaults = () => {
    const defaultItemsPerPage = 10
    const defaultSelect = true
    const defaultCuadricula = true
    const defaultViewMode = "table"
    const defaultAutoResponsive = true
    const defaultColumns = config.columns.map((col) => ({ ...col, hidden: false }))

    setLocalItemsPerPage(defaultItemsPerPage)
    setLocalSelect(defaultSelect)
    setLocalCuadricula(defaultCuadricula)
    setLocalViewMode(defaultViewMode)
    setLocalAutoResponsive(defaultAutoResponsive)
    setLocalColumns(defaultColumns)

    // Aplicar inmediatamente los valores por defecto
    updateItemsPerPage(defaultItemsPerPage)
    updateTableConfig({
      columns: defaultColumns,
      select: defaultSelect,
      cuadricula: defaultCuadricula,
    })

    // Resetear vista responsiva
    responsiveViewState.resetToAutoMode()

    // Limpiar localStorage
    localStorage.removeItem("tableConfig")
  }

  const itemsPerPageOptions = [
    { value: "5", label: "5 elementos" },
    { value: "10", label: "10 elementos" },
    { value: "15", label: "15 elementos" },
    { value: "20", label: "20 elementos" },
    { value: "25", label: "25 elementos" },
    { value: "50", label: "50 elementos" },
    { value: "100", label: "100 elementos" },
  ]

  return (
    <Modal
      title=""
      icon={<Settings size={16} />}
      buttonClassName={`table-config-btn ${className}`}
      buttonText="Guardar Configuración"
      onclick={handleSaveConfig}
    >
      <div className="table-config-content">
        {/* Configuración de Paginación */}
        <div className="config-section">
          <h3 className="config-section-title">Paginación</h3>
          <div className="config-field">
            <label className="config-label">Elementos por página:</label>
            <Select value={localItemsPerPage.toString()} onValueChange={(value) => setLocalItemsPerPage(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="config-info">
            <span className="info-text">Total de elementos: {totalItems}</span>
          </div>
        </div>

        {/* Configuración de Vista */}
        <div className="config-section">
          <h3 className="config-section-title">Vista</h3>
          <div className="config-field">
            <label className="config-label">Modo de vista:</label>
            <Select value={localViewMode} onValueChange={(value) => setLocalViewMode(value as "table" | "cards")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Tabla</SelectItem>
                <SelectItem value="cards">Tarjetas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="config-checkbox-field">
            <label className="config-checkbox-label">
              <input
                type="checkbox"
                checked={localAutoResponsive}
                onChange={(e) => setLocalAutoResponsive(e.target.checked)}
                className="config-checkbox"
              />
              <span className="checkbox-text">Vista automática responsiva</span>
            </label>
            <span className="config-help-text">
              Cambia automáticamente entre tabla y tarjetas según el tamaño de pantalla
            </span>
          </div>
        </div>

        {/* Configuración de Tabla */}
        <div className="config-section">
          <h3 className="config-section-title">Opciones de Tabla</h3>

          <div className="config-checkbox-field">
            <label className="config-checkbox-label">
              <input
                type="checkbox"
                checked={localSelect}
                onChange={(e) => setLocalSelect(e.target.checked)}
                className="config-checkbox"
              />
              <span className="checkbox-text">Mostrar checkboxes de selección</span>
            </label>
          </div>

          <div className="config-checkbox-field">
            <label className="config-checkbox-label">
              <input
                type="checkbox"
                checked={localCuadricula}
                onChange={(e) => setLocalCuadricula(e.target.checked)}
                className="config-checkbox"
              />
              <span className="checkbox-text">Mostrar cuadrícula</span>
            </label>
          </div>
        </div>

        {/* Configuración de Columnas */}
        <div className="config-section">
          <h3 className="config-section-title">Visibilidad de Columnas</h3>
          <div className="columns-config">
            {localColumns
              .filter((col) => col.id !== "acciones")
              .map((column) => (
                <div key={column.id} className="column-toggle">
                  <button
                    className={`column-toggle-btn ${!column.hidden ? "visible" : "hidden"}`}
                    onClick={() => toggleColumnVisibility(column.id)}
                  >
                    {!column.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                    <span className="column-name">{column.header}</span>
                  </button>
                </div>
              ))}
          </div>
          <div className="config-help-text">Haz clic en los botones para mostrar/ocultar columnas</div>
        </div>

        {/* Botón de Reset */}
        <div className="config-section">
          <button className="reset-config-btn" onClick={resetToDefaults} type="button">
            Restaurar valores por defecto
          </button>
        </div>

        {/* Información adicional */}
        <div className="config-info-section">
          <h4 className="info-title">Información</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Elementos visibles:</span>
              <span className="info-value">{localItemsPerPage}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Columnas visibles:</span>
              <span className="info-value">
                {localColumns.filter((col) => !col.hidden).length} de {localColumns.length}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Modo actual:</span>
              <span className="info-value">{localViewMode === "table" ? "Tabla" : "Tarjetas"}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TableConfigModal
