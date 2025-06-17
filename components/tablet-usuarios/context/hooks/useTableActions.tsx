"use client"

import { useTableCallbacks, useTableState } from "../TableContext"
import type { DataTable } from "../types"


export const useTableActions = () => {
  const { onAddItem, onEditItem, onViewItem, onDeleteItem, onSelectItem } = useTableCallbacks()
  const { currentItems, handleSelectItem: handleSelectItemState } = useTableState()

  // Manejar la selección de elemento
  const handleItemSelect = (itemId: number) => {
    handleSelectItemState(itemId)

    const item = currentItems.find((i: any) => i.id === itemId)
    if (item && onSelectItem) {
      onSelectItem(item)
    }
  }

  const handleCreateItem = () => {
    onAddItem?.()
  }

  const handleEditItemClick = (item: DataTable) => {
    onEditItem?.(item)
  }

  const handleViewItemClick = (item: DataTable) => {
    onViewItem?.(item)
  }

  const handleDeleteItemClick = (item: DataTable) => {
    onDeleteItem?.(item)
  }

  return {
    handleItemSelect,
    handleCreateItem,
    handleEditItemClick,
    handleViewItemClick,
    handleDeleteItemClick,
  }
}
