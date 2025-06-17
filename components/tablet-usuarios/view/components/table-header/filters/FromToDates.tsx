'use client'
import React, { useState } from 'react'
import { useFilterConfig } from "../../../../context/TableContext"
import "./css/from-to-date.css"

interface FromToDateProps { }

const FromToDate: React.FC<FromToDateProps> = () => {
    const { dateFrom, dateTo, onDateFromChange, onDateToChange } = useFilterConfig()

    const [fromInputType, setFromInputType] = useState<'text' | 'date'>('text')
    const [toInputType, setToInputType] = useState<'text' | 'date'>('text')

    const handleFromFocus = () => {
        setFromInputType('date')
    }

    const handleFromBlur = () => {
        if (!dateFrom) {
            setFromInputType('text')
        }
    }

    const handleToFocus = () => {
        setToInputType('date')
    }

    const handleToBlur = () => {
        if (!dateTo) {
            setToInputType('text')
        }
    }

    return (
        <>
            <div className="date-filter-group">
                <input
                    id="fecha-desde"
                    type={fromInputType}
                    className="table-date-input"
                    value={dateFrom}
                    placeholder={fromInputType === 'text' ? 'Fecha desde' : ''}
                    onChange={(e) => onDateFromChange(e.target.value)}
                    onFocus={handleFromFocus}
                    onBlur={handleFromBlur}
                />

                <input
                    id="fecha-hasta"
                    type={toInputType}
                    className="table-date-input"
                    value={dateTo}
                    placeholder={toInputType === 'text' ? 'Fecha hasta' : ''}
                    onChange={(e) => onDateToChange(e.target.value)}
                    onFocus={handleToFocus}
                    onBlur={handleToBlur}
                />
            </div>
        </>
    );
}

export default FromToDate;
