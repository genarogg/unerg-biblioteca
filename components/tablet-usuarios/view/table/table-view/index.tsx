"use client"

import { Check, Minus } from "lucide-react"
import { useTableRowActions } from "../../../context/hooks/useTableRowActions"
import ViewUserModal from "../../modal-crud/ViewUserModal"
import ActionsColumn from "../components/ActionsColumn"
import BadgeWrapper from "../components/BadgeWrapper"
import "./user-management-table.css"
import { useTableState, useTableContext } from "../../../context/TableContext"

export default function TableView() {
  const { tableState, config } = useTableContext()
  const { deleteItem } = useTableState()

  const { currentItems, selectedItems, handleSelectAll, getSelectAllState } = tableState
  const { select, cuadricula, columns } = config

  // Usar el hook de acciones - NO pasar onCustomView para que use el modal por defecto
  const {
    handleDuplicate,
    handleView,
    handleDelete,
    handleEdit,
    viewModalOpen,
    selectedItemForView,
    closeViewModal,
  } = useTableRowActions({
    onCustomDelete: (item) => {
      // Usar directamente la función deleteItem del contexto
      deleteItem(item.id)
    },
    // NO pasar onCustomView para que use el modal interno
    showConfirmDialog: true,
  })

  const handleItemSelect = (itemId: number) => {
    // Use the function from tableState to handle item selection
    tableState.handleSelectItem(itemId)
  }

  return (
    <>
      <div className="table-container">
        <table className={`data-table ${!select ? "no-select" : ""} ${cuadricula ? "with-grid" : ""}`}>
          <thead>
            <tr>
              {select && (
                <th className="select-column">
                  <button
                    className={`select-btn master-select ${getSelectAllState()}`}
                    onClick={handleSelectAll}
                    title="Seleccionar todos"
                  >
                    {getSelectAllState() === "all" && <Check size={14} />}
                    {getSelectAllState() === "some" && <Minus size={14} />}
                  </button>
                </th>
              )}
              {columns
                .filter((column) => !column.hidden)
                .map((column) => (
                  <th key={column.id} className={`${column.id}-column`}>
                    {column.header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody style={{ minHeight: "320px", position: "relative" }}>
            {currentItems.map((item: any, index: any) => (
              <tr key={item.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                {select && (
                  <td className="select-column">
                    <button
                      className={`select-btn ${selectedItems.includes(item.id) ? "selected" : ""}`}
                      onClick={() => handleItemSelect(item.id)}
                      title="Seleccionar elemento"
                    >
                      {selectedItems.includes(item.id) && <Check size={14} />}
                    </button>
                  </td>
                )}
                {columns
                  .filter((column) => !column.hidden)
                  .map((column) => {
                    if (column.id === "acciones") {
                      return (
                        <td key={column.id} className="acciones-column">
                          <ActionsColumn
                            item={item}
                            onDuplicate={handleDuplicate}
                            onView={handleView}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onUpdateItem={tableState.updateItem}
                            showRoleSelect={true}
                            showStatusSwitch={false}
                            variant="table"
                          />
                        </td>
                      )
                    }

                    return (
                      <td key={column.id} className={`${column.id}-column`}>
                        {column.id === "nombre" && <span className="name-cell">{item[column.accessor]}</span>}
                        {column.id === "correo" && <span className="email-cell">{item[column.accessor]}</span>}
                        {column.id === "rol" && (
                          <BadgeWrapper type="role" value={item.rol} />
                        )}
                        {column.id === "status" && (
                          <BadgeWrapper type="status" value={item.status} />
                        )}
                        {column.id !== "nombre" &&
                          column.id !== "correo" &&
                          column.id !== "rol" &&
                          column.id !== "status" &&
                          item[column.accessor]}
                      </td>
                    )
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de vista de usuario */}
      <ViewUserModal isOpen={viewModalOpen} onClose={closeViewModal} user={selectedItemForView} />
    </>
  )
}
