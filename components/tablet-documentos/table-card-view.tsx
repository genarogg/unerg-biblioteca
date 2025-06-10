"use client"

import { Edit, Eye, FileText, Info, Check } from "lucide-react"
import "./css/table-card-view.css"
import type { Document } from "./useTable"

interface TableCardViewProps {
  documents: Document[]
  selectedDocuments: number[]
  onSelectDocument: (docId: number) => void
  onEditDocument: (document: Document) => void
  onViewDocument: (document: Document) => void
  onViewPdf: (document: Document) => void
  onViewDetails: (document: Document) => void
  showSelection?: boolean
}

export default function TableCardView({
  documents,
  selectedDocuments,
  onSelectDocument,
  onEditDocument,
  onViewDocument,
  onViewPdf,
  onViewDetails,
  showSelection = true,
}: TableCardViewProps) {
  const isSelected = (docId: number) => selectedDocuments.includes(docId)

  return (
    <div className="card-view-container">
      {documents.map((document) => (
        <div key={document.id} className={`user-card ${isSelected(document.id) ? "selected" : ""}`}>
          {/* Header de la tarjeta */}
          <div className="card-header">
            <div className="card-title-section">
              {showSelection && (
                <button
                  className={`card-select-btn ${isSelected(document.id) ? "selected" : ""}`}
                  onClick={() => onSelectDocument(document.id)}
                  title="Seleccionar documento"
                >
                  {isSelected(document.id) && <Check size={14} />}
                </button>
              )}
              <h3 className="card-title">{document.titulo}</h3>
            </div>
            <div className="card-actions">
              <button
                className="card-action-btn edit-btn"
                onClick={() => onEditDocument(document)}
                title="Editar documento"
              >
                <Edit size={16} />
              </button>
              <button className="card-action-btn view-btn" onClick={() => onViewPdf(document)} title="Ver PDF">
                <FileText size={16} />
              </button>
              <button
                className="card-action-btn view-btn"
                onClick={() => onViewDocument(document)}
                title="Ver documento"
              >
                <Eye size={16} />
              </button>
              <button className="card-action-btn view-btn" onClick={() => onViewDetails(document)} title="Ver detalles">
                <Info size={16} />
              </button>
            </div>
          </div>

          {/* Contenido de la tarjeta */}
          <div className="card-content">
            <div className="card-field">
              <span className="field-label">ID:</span>
              <span className="field-value">{document.id}</span>
            </div>

            <div className="card-field">
              <span className="field-label">Área:</span>
              <span className={`role-badge role-${document.area.toLowerCase().replace(/\s+/g, "-")}`}>
                {document.area}
              </span>
            </div>

            <div className="card-field">
              <span className="field-label">Autor:</span>
              <span className="field-value">{document.autor}</span>
            </div>
          </div>

          {/* Footer de la tarjeta */}
          <div className="card-footer">
            <button className="card-details-btn" onClick={() => onViewDetails(document)}>
              Ver detalles
            </button>
          </div>
        </div>
      ))}

      {documents.length === 0 && (
        <div className="no-cards">
          <p>No se encontraron documentos que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  )
}
