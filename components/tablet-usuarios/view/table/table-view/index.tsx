"use client"

import type React from "react"
import Switch from "../../../../ux/btns/switch"

interface TableViewProps {
  data: any[]
  columns: {
    key: string
    title: string
    render?: (item: any) => React.ReactNode
  }[]
  onUpdateItem?: (id: number, updates: any) => void
}

const TableView: React.FC<TableViewProps> = ({ data, columns, onUpdateItem }) => {
  const handleStatusToggle = (itemId: number) => {
    if (onUpdateItem) {
      const item = data.find((d) => d.id === itemId)
      if (item) {
        const newStatus = item.status === "activo" ? "inactivo" : "activo"
        onUpdateItem(itemId, { status: newStatus })
      }
    }
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((column) => (
              <td key={`${item.id}-${column.key}`}>
                {column.render ? (
                  column.render(item)
                ) : column.key === "status" ? (
                  <Switch isOn={item.status === "activo"} onToggle={() => handleStatusToggle(item.id)} />
                ) : (
                  item[column.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableView
