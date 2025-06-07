"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import "./modal.scss"

interface ModalProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  buttonClassName?: string
  buttonText?: string
  onclick?: () => void
}

export default function Modal({ title, icon, children, buttonClassName, buttonText = "Guardar", onclick }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const openModal = () => {
    setIsOpen(true)
    setIsClosing(false)
  }

  const closeModal = () => {
    setIsClosing(true)
  }

  const handleSave = () => {
    if (onclick) {
      onclick()
    }
    closeModal()
  }

  // Manejar el evento animationend para detectar cuando termina la animación de cierre
  useEffect(() => {
    const content = contentRef.current

    const handleAnimationEnd = (e: AnimationEvent) => {
      if (isClosing && e.animationName === "contentHide") {
        setIsOpen(false)
        setIsClosing(false)
      }
    }

    if (content) {
      content.addEventListener("animationend", handleAnimationEnd as any)
    }

    return () => {
      if (content) {
        content.removeEventListener("animationend", handleAnimationEnd as any)
      }
    }
  }, [isClosing])

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      if (!isOpen) {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  // Cerrar modal al hacer click fuera del contenido
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  if (!isOpen) {
    return (
      <button className={`modal-trigger ${buttonClassName || ""}`} onClick={openModal}>
        {icon && <span className="modal-trigger-icon">{icon}</span>}
        <span>{title}</span>
      </button>
    )
  }

  return (
    <>
      <button className={`modal-trigger ${buttonClassName || ""}`} onClick={openModal}>
        {icon && <span className="modal-trigger-icon">{icon}</span>}
        <span>{title}</span>
      </button>

      <div className={`modal-overlay ${isClosing ? "modal-overlay-closing" : ""}`} onClick={handleOverlayClick}>
        <div ref={contentRef} className={`modal-content ${isClosing ? "modal-content-closing" : ""}`}>
          <div className="modal-header">
            <h2 className="modal-title">
              {icon && <span className="modal-title-icon">{icon}</span>}
              {title}
            </h2>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button className="modal-save-button" onClick={handleSave}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}