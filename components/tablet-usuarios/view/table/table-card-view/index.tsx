"use client"

import type React from "react"
import Switch from "@/ux/switch"

interface TableCardViewProps {
  data: any[]
  handleStatusToggle: (id: string) => void
}

const TableCardView: React.FC<TableCardViewProps> = ({ data, handleStatusToggle }) => {
  return (
    <div className="table-card-view">
      {data.map((item) => (
        <div className="table-card" key={item.id}>
          <div className="card-header">
            <h3>{item.name}</h3>
          </div>
          <div className="card-body">
            <p>ID: {item.id}</p>
            <p>Description: {item.description}</p>
            <div className="status-switch-container">
              <Switch isOn={item.status === "activo"} onToggle={() => handleStatusToggle(item.id)} />
              <span className={`status-text ${item.status === "activo" ? "active" : "inactive"}`}>
                {item.status === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TableCardView
