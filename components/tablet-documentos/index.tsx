"use client"

import { TableProvider } from "./context/TableContext"
import TableContent from "./view"

export default function DataTableManagement() {
  return (
    <TableProvider>
      <TableContent />
    </TableProvider>
  )
}
