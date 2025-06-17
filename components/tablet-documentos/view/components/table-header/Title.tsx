"use client"

import type React from "react"

import "./css/title.css"
import { useTableState } from "../../../context/TableContext"

interface DataStatusIndicatorProps {
  type: "loading" | "error" | "fallback"
  message: string
  onRetry?: () => void
}

const Title: React.FC = () => {
  const { dataLoading, dataError, refetchData } = useTableState()

  const DataStatusIndicator: React.FC<DataStatusIndicatorProps> = ({ type, message, onRetry }) => {
    const className = `data-status-indicator ${type}`
    const dotClassName = `status-dot ${type}`

    return (
      <div className={className}>
        <span className={dotClassName}></span>
        <span className="status-text">{message}</span>
        {type === "error" && onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="table-header-title-section">
        <h2 className="table-title">Gestión de Reportes de Investigación</h2>

        {dataLoading && <DataStatusIndicator type="loading" message="Cargando reportes..." />}

        {dataError && <DataStatusIndicator type="error" message={`Error: ${dataError}`} onRetry={refetchData} />}
      </div>
      <div className="table-header-divider"></div>
    </>
  )
}

export default Title
