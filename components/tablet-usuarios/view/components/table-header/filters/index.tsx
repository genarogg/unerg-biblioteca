"use client"
import React from "react"
import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "./css/index.css"

// Importar los componentes de filtros
import FromToDate from "./FromToDates"
import { SelectStatus, SelectRol } from "./SelectedFilter"
import TableConfigModal from "./TableConfigModal"

interface FilterToggleButtonProps {
  children: React.ReactNode
  className?: string
  storageKey?: string
  // Nuevas props para componentes siempre activos
  alwaysActiveComponents?: React.ReactNode[]
  alwaysActivePosition?: "before" | "after"
  // Nueva prop para ocultar el botón de toggle
  hideToggleButton?: boolean
}

const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({
  children,
  className = "",
  storageKey = "table-filters-visible",
  alwaysActiveComponents = [],
  alwaysActivePosition = "before",
  hideToggleButton = false,
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar estado desde localStorage al montar el componente
  useEffect(() => {
    // Si hideToggleButton es true, no necesitamos cargar/guardar estado
    if (hideToggleButton) {
      setIsLoaded(true)
      return
    }

    try {
      const savedState = localStorage.getItem(storageKey)
      if (savedState !== null) {
        setIsVisible(JSON.parse(savedState))
      }
    } catch (error) {
      console.warn("Error loading filter visibility state:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [storageKey, hideToggleButton])

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    if (isLoaded && !hideToggleButton) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(isVisible))
      } catch (error) {
        console.warn("Error saving filter visibility state:", error)
      }
    }
  }, [isVisible, isLoaded, storageKey, hideToggleButton])

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  // No renderizar hasta que se haya cargado el estado
  if (!isLoaded) {
    return (
      <div className="filter-toggle-container">
        <div className="filter-content-placeholder"></div>
        {!hideToggleButton && (
          <button className="filter-toggle-icon-btn loading" disabled>
            <Filter size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="filter-toggle-container">
      <div className="filter-content-area">
        {alwaysActivePosition === "before" && alwaysActiveComponents.length > 0 && (
          <div className="always-active-filters">
            {React.Children.toArray(alwaysActiveComponents).map((component, index) => (
              <div key={`always-active-before-${index}`} className="always-active-filter">
                {component}
              </div>
            ))}
          </div>
        )}

        {/* Si hideToggleButton es true, siempre mostrar los children */}
        {hideToggleButton ? (
          <div className="filter-content-inline" style={{ display: "none" }}>
            <div className="filter-content-wrapper">
              {React.Children.toArray(children).map((child, index) => (
                <div key={`filter-child-${index}`} className="filter-child">
                  {child}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                className="filter-content-inline"
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0.0, 0.2, 1],
                  height: {
                    duration: 0.3,
                  },
                  y: {
                    duration: 0.4,
                    ease: "easeOut",
                  },
                }}
              >
                <div className="filter-content-wrapper">
                  {React.Children.toArray(children).map((child, index) => (
                    <motion.div
                      key={`filter-child-${index}`}
                      className="filter-child"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      {child}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {alwaysActivePosition === "after" && alwaysActiveComponents.length > 0 && (
          <div className="always-active-filters">
            {React.Children.toArray(alwaysActiveComponents).map((component, index) => (
              <div key={`always-active-after-${index}`} className="always-active-filter">
                {component}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón Toggle - Solo renderizar si hideToggleButton es false */}
      {!hideToggleButton && (
        <button
          className={`filter-toggle-icon-btn ${isVisible ? "active" : "inactive"} ${className}`}
          onClick={toggleVisibility}
          title={isVisible ? "Ocultar filtros" : "Mostrar filtros"}
          aria-expanded={isVisible}
          aria-controls="filter-content"
        >
          <motion.div
            animate={{
              rotate: isVisible ? 0 : 180,
              scale: isVisible ? 1 : 0.9,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Filter size={16} />
          </motion.div>

          <div className={`filter-status-dot ${isVisible ? "visible" : "hidden"}`}></div>
        </button>
      )}
    </div>
  )
}

// Componente específico para los filtros de tabla
interface TableFiltersProps {
  className?: string
  storageKey?: string
  // Opción para especificar el orden de TODOS los filtros
  filterOrder?: ("dates" | "status" | "rol" | "config")[]
  // Opción para especificar qué filtros están siempre activos
  alwaysActiveFilters?: ("dates" | "status" | "rol" | "config")[]
  alwaysActivePosition?: "before" | "after"
  // Nueva opción para especificar qué filtros nunca se muestran
  alwaysHiddenFilters?: ("dates" | "status" | "rol" | "config")[]
  // Nueva prop para ocultar el botón de toggle
  hideToggleButton?: boolean
}

const TableFilters: React.FC<TableFiltersProps> = ({
  className = "",
  storageKey = "table-filters-visible",
  filterOrder = ["dates", "status", "rol", "config"],
  alwaysActiveFilters = [],
  alwaysActivePosition = "before",
  alwaysHiddenFilters = [],
  hideToggleButton = false,
}) => {
  // Función para renderizar componentes según el tipo
  const renderFilterComponent = (filterType: "dates" | "status" | "rol" | "config") => {
    switch (filterType) {
      case "status":
        return <SelectStatus />
      case "rol":
        return <SelectRol />
      case "dates":
        return <FromToDate />
      case "config":
        return <TableConfigModal />
      default:
        return null
    }
  }

  // Crear arrays de componentes siempre activos y colapsables RESPETANDO EL ORDEN
  const alwaysActiveComponents = filterOrder
    .filter((filterType) => alwaysActiveFilters.includes(filterType))
    .map(renderFilterComponent)
    .filter(Boolean)

  // Los filtros colapsables son aquellos que NO están en alwaysActive NI en alwaysHidden
  // pero RESPETANDO el orden especificado
  // Si hideToggleButton es true, no mostrar filtros colapsables
  const collapsableComponents = hideToggleButton
    ? []
    : filterOrder
      .filter((filterType) => !alwaysActiveFilters.includes(filterType) && !alwaysHiddenFilters.includes(filterType))
      .map(renderFilterComponent)
      .filter(Boolean)

  return (
    <div className={`box-filter ${className}`}>
      <FilterToggleButton
        storageKey={storageKey}
        alwaysActiveComponents={alwaysActiveComponents}
        alwaysActivePosition={alwaysActivePosition}
        hideToggleButton={hideToggleButton}
      >
        {collapsableComponents.map((component, index) => (
          <div key={index}>{component}</div>
        ))}
      </FilterToggleButton>
    </div>
  )
}

// Exportar ambos componentes
export { FilterToggleButton }
export default TableFilters
