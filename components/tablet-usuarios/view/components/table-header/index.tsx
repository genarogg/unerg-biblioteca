"use client"

import type React from "react"

import "./css/index.css"

import Title from "./Title"
import Search from "./Search"
import Filter from "./filters"

import AddUsuario from "../../modal-crud/AddUsuario"


const TableHeader: React.FC = () => {


  return (
    <div className="table-header-container">
      <Title />

      {/* Controles principales */}
      <div className="table-header-controls-section">
        <div className="box-left">
          <Search />
        </div>

        {/* Área de filtros expandibles */}

        {/* Botones fijos a la derecha */}
        <div className="box-right">
          <Filter
            hideToggleButton={true}
            filterOrder={['dates', 'rol', 'status']}
            alwaysActiveFilters={["status"]}
            alwaysHiddenFilters={['config', "dates"]}
            alwaysActivePosition="after"
          />

          <div className="modal-button-wrapper">
            <AddUsuario />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableHeader
