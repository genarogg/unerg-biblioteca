import { useCallback } from "react"
import { useFilterConfig } from "../../../../context/TableContext"

// Tipos genéricos
interface FilterOption {
    value: string
    label: string
}

interface UseGenericSelectFilterProps {
    filterType: string // 'role', 'status', 'department', etc.
    staticOptions?: FilterOption[]
    defaultValue?: string
}

interface UseGenericSelectFilterReturn {
    options: FilterOption[]
    selectedValue: string
    handleChange: (value: string | string[]) => void
}

// Hook genérico para filtros de selección
const useGenericSelectFilter = ({
    filterType,
    staticOptions = [],
    defaultValue = "todos"
}: UseGenericSelectFilterProps): UseGenericSelectFilterReturn => {
    const filterConfig = useFilterConfig()

    // Obtener valor seleccionado y función de cambio del contexto
    const getSelectedValue = () => {
        switch (filterType) {
            case 'role':
                return filterConfig.selectedRole
            case 'status':
                return filterConfig.selectedStatus
            default:
                // Para otros tipos de filtro, usar el sistema genérico del contexto
                return filterConfig.getFilterValue?.(filterType) || defaultValue
        }
    }

    const getChangeHandler = () => {
        switch (filterType) {
            case 'role':
                return filterConfig.onRoleChange
            case 'status':
                return filterConfig.onStatusChange
            default:
                // Para otros tipos de filtro, usar el handler genérico
                return (value: string) => filterConfig.onGenericFilterChange?.(filterType, value)
        }
    }

    const selectedValue = getSelectedValue()
    const onValueChange = getChangeHandler()

    // Handler para cambios
    const handleChange = useCallback((value: string | string[]): void => {
        const finalValue = Array.isArray(value) ? value[0] : value
        console.log(`Filtro de ${filterType} cambiado:`, finalValue)
        onValueChange(finalValue)
    }, [filterType, onValueChange])

    return {
        options: staticOptions,
        selectedValue: selectedValue || defaultValue,
        handleChange
    }
}

export default useGenericSelectFilter
