"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
// import * as pdfjs from "pdfjs-dist"
import styles from "./page.module.css"
import { SimpleLayout } from '@/components/layout'
// Importar PDF.js correctamente
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// Datos de ejemplo (en una app real vendrían de una API)
const documentosEjemplo = {
  1: {
    titulo: "Avances en Inteligencia Artificial Aplicada",
    autor: "Dra. María Rodríguez",
    areaInvestigacion: "Inteligencia Artificial y Aprendizaje Automático",
    descripcion:
      "Este documento explora los últimos avances en el campo de la inteligencia artificial y su aplicación en diversos sectores industriales. Se analizan técnicas de aprendizaje profundo y su impacto en la automatización de procesos.",
    url: "https://usercontent.one/wp/www.puro-geek.com/wp-content/uploads/2021/11/El-codigo-Da-Vinci-Dan-Brown.pdf",
  },
}

export default function DocumentoIndividualPage() {
  const params = useParams()
  const documentoId = params.id as string

  const [documento] = useState(documentosEjemplo[1]) // Por simplicidad, siempre mostramos el mismo documento
  // const [pdfText, setPdfText] = useState("")
  // const [cargando, setCargando] = useState(true)

  // useEffect(() => {
  //   async function cargarPDF() {
  //     try {
  //       setCargando(true)
  //       const loadingTask = pdfjs.getDocument(documento.url)
  //       const pdf = await loadingTask.promise

  //       let textoCompleto = ""
  //       for (let i = 1; i <= pdf.numPages; i++) {
  //         const page = await pdf.getPage(i)
  //         const textContent = await page.getTextContent()
  //         const pageText = textContent.items.map((item) => item.str).join(" ")
  //         textoCompleto += pageText + "\n\n"
  //       }

  //       setPdfText(textoCompleto)
  //     } catch (error) {
  //       console.error("Error al cargar el PDF:", error)
  //       setPdfText("Error al cargar el documento. Por favor, intente nuevamente.")
  //     } finally {
  //       setCargando(false)
  //     }
  //   }

  //   if (documento) {
  //     cargarPDF()
  //   }
  // }, [documento])

  const descargarDocumento = () => {
    const link = document.createElement("a")
    link.href = documento.url
    link.download = `${documento.titulo}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!documento) {
    return <div>Documento no encontrado</div>
  }

  return (
    <SimpleLayout>

      <main className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <Link href="/documentos" className={styles.breadcrumbLink}>
            ← Volver a documentos
          </Link>
        </div>

        <article className={styles.articleContainer}>
          <header className={styles.articleHeader}>
            <div className={styles.categoryTag}>Investigación</div>
            <h1 className={styles.articleTitle}>{documento.titulo}</h1>
            <div className={styles.articleMeta}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <span>{documento.autor.charAt(0)}</span>
                </div>
                <div className={styles.authorDetails}>
                  <p className={styles.authorName}>{documento.autor}</p>
                  <p className={styles.authorField}>{documento.areaInvestigacion}</p>
                </div>
              </div>
              <time className={styles.publishDate}>15 de Enero, 2024</time>
            </div>
          </header>

          <div className={styles.articleContent}>
            <div className={styles.abstract}>
              <h2>Resumen</h2>
              <p>{documento.descripcion}</p>
            </div>

            <div className={styles.downloadSection}>
              <button className={styles.downloadButton} onClick={descargarDocumento}>
                <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar Documento Completo
              </button>
            </div>

            {/* <div className={styles.documentViewer}>
              <h2>Contenido del Documento</h2>
              {cargando ? (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <p>Cargando contenido del documento...</p>
                </div>
              ) : (
                <div className={styles.documentText}>{pdfText}</div>
              )}
            </div> */}
          </div>
        </article>
      </main>

     </SimpleLayout>
  )
}