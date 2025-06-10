"use client"

import { useState, useEffect } from "react"

interface UseResponsiveViewProps {
  autoResponsive?: boolean
  breakpoint?: number
  defaultViewMode?: "table" | "cards"
}

export const useResponsiveView = ({
  autoResponsive = false,
  breakpoint = 768,
  defaultViewMode = "table",
}: UseResponsiveViewProps = {}) => {
  const [viewMode, setViewMode] = useState<"table" | "cards">(defaultViewMode)
  const [screenWidth, setScreenWidth] = useState<number>(0)
  const [isAutoMode, setIsAutoMode] = useState(autoResponsive)

  // Detectar el ancho de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    // Establecer el ancho inicial
    handleResize()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Cambiar automáticamente el modo de vista basado en el ancho de pantalla
  useEffect(() => {
    if (isAutoMode && screenWidth > 0) {
      if (screenWidth < breakpoint) {
        setViewMode("cards")
      } else {
        setViewMode("table")
      }
    }
  }, [screenWidth, breakpoint, isAutoMode])

  // Función para cambiar manualmente el modo de vista
  const handleViewModeChange = (mode: "table" | "cards") => {
    if (isAutoMode) {
      // Si está en modo automático, desactivarlo al cambiar manualmente
      setIsAutoMode(false)
    }
    setViewMode(mode)
  }

  // Función para activar/desactivar el modo automático
  const toggleAutoMode = () => {
    const newAutoMode = !isAutoMode
    setIsAutoMode(newAutoMode)

    if (newAutoMode && screenWidth > 0) {
      // Si se activa el modo automático, aplicar la lógica inmediatamente
      if (screenWidth < breakpoint) {
        setViewMode("cards")
      } else {
        setViewMode("table")
      }
    }
  }

  // Función para resetear al modo automático
  const resetToAutoMode = () => {
    setIsAutoMode(true)
    if (screenWidth > 0) {
      if (screenWidth < breakpoint) {
        setViewMode("cards")
      } else {
        setViewMode("table")
      }
    }
  }

  // Determinar si el modo actual es resultado del modo automático
  const isCurrentModeAuto = isAutoMode && screenWidth > 0

  return {
    viewMode,
    screenWidth,
    isAutoMode,
    isCurrentModeAuto,
    breakpoint,
    handleViewModeChange,
    toggleAutoMode,
    resetToAutoMode,
    // Información adicional
    isMobile: screenWidth < breakpoint,
    isTablet: screenWidth >= breakpoint && screenWidth < 1024,
    isDesktop: screenWidth >= 1024,
  }
}

export type UseResponsiveViewReturn = ReturnType<typeof useResponsiveView>
