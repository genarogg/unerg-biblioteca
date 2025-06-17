"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo
} from "react"
import { ChevronDown, Check, X } from "lucide-react"
import "./select.css" // Import your styles here

interface SelectContextType {
  value: string | string[]
  onValueChange: (value: string | string[]) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  placeholder?: string
  multiple?: boolean
  selectedLabels: Map<string, string>
  setSelectedLabel: (value: string, label: string) => void
}

const SelectContext = createContext<SelectContextType | null>(null)

const useSelectContext = () => {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select")
  }
  return context
}

interface SelectProps {
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
  multiple?: boolean
}

export const Select = memo(function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  multiple = false
}: SelectProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    () => defaultValue || (multiple ? [] : "")
  )
  const [selectedLabels, setSelectedLabelsState] = useState<Map<string, string>>(
    () => new Map()
  )
  const [open, setOpen] = useState(false)

  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = useCallback((newValue: string | string[]) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)

    // In single select mode, close the dropdown after selection
    if (!multiple) {
      setOpen(false)
    }
  }, [value, onValueChange, multiple])

  const setSelectedLabel = useCallback((value: string, label: string) => {
    setSelectedLabelsState(prev => {
      const newMap = new Map(prev)
      newMap.set(value, label)
      return newMap
    })
  }, [])

  const contextValue = useMemo(() => ({
    value: currentValue,
    onValueChange: handleValueChange,
    open,
    onOpenChange: setOpen,
    multiple,
    selectedLabels,
    setSelectedLabel,
  }), [currentValue, handleValueChange, open, multiple, selectedLabels, setSelectedLabel])

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="select-root">{children}</div>
    </SelectContext.Provider>
  )
})

interface SelectTriggerProps {
  children: React.ReactNode
}

export const SelectTrigger = memo(function SelectTrigger({ children }: SelectTriggerProps) {
  const { open, onOpenChange } = useSelectContext()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onOpenChange(!open)
  }, [open, onOpenChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onOpenChange(!open)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      onOpenChange(true)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      onOpenChange(false)
    }
  }, [open, onOpenChange])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Check if focus moved outside the select component
    const currentTarget = e.currentTarget
    const relatedTarget = e.relatedTarget as Node

    // If the new focus is outside the select root, close it
    setTimeout(() => {
      const selectRoot = currentTarget.closest('.select-root')
      if (selectRoot && relatedTarget && !selectRoot.contains(relatedTarget)) {
        onOpenChange(false)
      }
    }, 0)
  }, [onOpenChange])

  return (
    <button
      ref={triggerRef}
      className="select-trigger"
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      {children}
      <ChevronDown className="select-icon" />
    </button>
  )
})

interface SelectValueProps {
  placeholder?: string
}

export const SelectValue = memo(function SelectValue({ placeholder }: SelectValueProps) {
  const { value, multiple, selectedLabels } = useSelectContext()

  const displayValue = useMemo(() => {
    // For single select
    if (!multiple) {
      return value ? selectedLabels.get(value as string) || value : placeholder
    }

    // For multiple select, just show the placeholder
    return placeholder
  }, [value, multiple, selectedLabels, placeholder])

  return (
    <span className="select-value" data-placeholder={!value || multiple ? "" : undefined}>
      {displayValue}
    </span>
  )
})

interface SelectTagsProps { }

export const SelectTags = memo(function SelectTags({ }: SelectTagsProps) {
  const { value, multiple, selectedLabels, onValueChange } = useSelectContext()

  const removeTag = useCallback((valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple && Array.isArray(value)) {
      const newValue = value.filter((v) => v !== valueToRemove)
      onValueChange(newValue)
    }
  }, [multiple, value, onValueChange])

  const tags = useMemo(() => {
    if (!multiple) return null
    const values = Array.isArray(value) ? value : []
    if (values.length === 0) return null

    return values.map((val) => (
      <SelectTag
        key={val}
        value={val}
        label={selectedLabels.get(val) || val}
        onRemove={removeTag}
      />
    ))
  }, [multiple, value, selectedLabels, removeTag])

  if (!tags) return null

  return (
    <div className="select-tags-wrapper">
      {tags}
    </div>
  )
})

interface SelectTagProps {
  value: string
  label: string
  onRemove: (value: string, e: React.MouseEvent) => void
}

const SelectTag = memo(function SelectTag({ value, label, onRemove }: SelectTagProps) {
  const handleRemove = useCallback((e: React.MouseEvent) => {
    onRemove(value, e)
  }, [value, onRemove])

  return (
    <div className="select-tag">
      <span className="select-tag-text">{label}</span>
      <button className="select-tag-remove" onClick={handleRemove} type="button">
        <X />
      </button>
    </div>
  )
})

interface SelectContentProps {
  children: React.ReactNode
}

export const SelectContent = memo(function SelectContent({ children }: SelectContentProps) {
  const { open, onOpenChange } = useSelectContext()
  const contentRef = useRef<HTMLDivElement>(null)
  const [calculatedOpenUpward, setCalculatedOpenUpward] = useState(false)

  // Mejorar el cálculo de posición cuando se abre
  useEffect(() => {
    if (open && contentRef.current) {
      const content = contentRef.current
      const selectRoot = content.closest('.select-root') as HTMLElement
      const trigger = selectRoot?.querySelector('.select-trigger') as HTMLElement
      
      if (trigger) {
        const triggerRect = trigger.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const scrollY = window.scrollY
        
        // Obtener la altura real del contenido o usar un estimado
        const contentHeight = Math.min(240, content.scrollHeight || 240) // max-height es 240px
        
        // Calcular espacio disponible considerando el scroll
        const spaceBelow = viewportHeight - (triggerRect.bottom - scrollY)
        const spaceAbove = triggerRect.top - scrollY
        
        // Margen de seguridad para mejor UX
        const safetyMargin = 20
        
        let shouldOpenUpward = false
        
        // Si no hay suficiente espacio abajo pero sí arriba
        if (spaceBelow < contentHeight + safetyMargin && spaceAbove > contentHeight + safetyMargin) {
          shouldOpenUpward = true
        }
        // Si hay poco espacio en ambos lados, elegir el que tenga más espacio
        else if (spaceBelow < contentHeight + safetyMargin && spaceAbove < contentHeight + safetyMargin) {
          shouldOpenUpward = spaceAbove > spaceBelow
        }
        
        setCalculatedOpenUpward(shouldOpenUpward)
      }
    }
  }, [open])

  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        // Mejorar la detección de clics fuera
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as Node

          // Encontrar el contenedor select root
          const selectRoot = contentRef.current?.closest('.select-root')

          // Si el clic está fuera del select completo, cerrarlo
          if (selectRoot && !selectRoot.contains(target)) {
            onOpenChange(false)
          }
        }

        // Usar 'click' en lugar de 'mousedown' para mejor comportamiento
        document.addEventListener('click', handleClickOutside, true)

        return () => {
          document.removeEventListener('click', handleClickOutside, true)
        }
      }, 0)

      // Manejar tecla Escape
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onOpenChange(false)
        }
      }

      document.addEventListener('keydown', handleEscape)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className="select-content"
      data-open-upward={calculatedOpenUpward}
      role="listbox"
    >
      {children}
    </div>
  )
})

interface SelectItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

export const SelectItem = memo(function SelectItem({ value, children, disabled }: SelectItemProps) {
  const { value: selectedValue, onValueChange, multiple, setSelectedLabel } = useSelectContext()

  const isSelected = useMemo(() => {
    return multiple
      ? Array.isArray(selectedValue) && selectedValue.includes(value)
      : selectedValue === value
  }, [multiple, selectedValue, value])

  useEffect(() => {
    // Store the label for this value
    if (typeof children === "string") {
      setSelectedLabel(value, children)
    }
  }, [value, children, setSelectedLabel])

  const handleClick = useCallback(() => {
    if (disabled) return

    if (multiple) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : []
      const newValues = isSelected
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      onValueChange(newValues)
    } else {
      onValueChange(value)
    }
  }, [disabled, multiple, selectedValue, isSelected, value, onValueChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!disabled) {
        handleClick()
      }
    }
  }, [disabled, handleClick])

  return (
    <div
      className={`select-item ${multiple ? "select-item-multiple" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-selected={isSelected ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      role="option"
      aria-selected={isSelected}
      tabIndex={disabled ? -1 : 0}
    >
      {multiple && (
        <div className="select-item-checkbox">
          <Check />
        </div>
      )}
      {children}
      {!multiple && isSelected && <Check className="select-item-indicator" />}
    </div>
  )
})

export const SelectSeparator = memo(function SelectSeparator() {
  return <div className="select-separator" />
})

interface SelectLabelProps {
  children: React.ReactNode
}

export const SelectLabel = memo(function SelectLabel({ children }: SelectLabelProps) {
  return <div className="select-label">{children}</div>
})
