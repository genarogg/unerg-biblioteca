"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "./documentos.module.css"
import { SimpleLayout } from '@/components/layout'

// Datos de ejemplo para simular documentos
const documentosEjemplo = Array.from({ length: 85 }, (_, i) => ({
    id: i + 1,
    titulo: [
        "Avances en Inteligencia Artificial Aplicada",
        "Machine Learning en el Sector Salud",
        "Blockchain y Criptomonedas: Análisis Económico",
        "Computación Cuántica: Fundamentos y Aplicaciones",
        "Robótica Autónoma en la Industria 4.0",
        "Big Data y Análisis Predictivo",
        "Ciberseguridad en la Era Digital",
        "Internet de las Cosas (IoT) y Smart Cities",
        "Realidad Virtual y Aumentada en Educación",
        "Biotecnología y Ingeniería Genética",
        "Energías Renovables y Sostenibilidad",
        "Nanotecnología en Medicina",
        "Sistemas Distribuidos y Cloud Computing",
        "Procesamiento de Lenguaje Natural",
        "Visión por Computadora y Reconocimiento de Patrones",
    ][i % 15],
    autor: [
        "Dr. María Rodríguez",
        "Prof. Carlos Mendoza",
        "Dra. Ana García",
        "Dr. Luis Fernández",
        "Prof. Elena Martín",
        "Dr. Roberto Silva",
        "Dra. Carmen López",
        "Prof. Miguel Torres",
        "Dr. Patricia Ruiz",
        "Prof. Andrés Morales",
    ][i % 10],
    areaInvestigacion: [
        "Inteligencia Artificial",
        "Ciencias de la Computación",
        "Biotecnología",
        "Ingeniería",
        "Medicina",
        "Física Cuántica",
        "Economía Digital",
        "Robótica",
        "Ciberseguridad",
        "Energías Renovables",
    ][i % 10],
    descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    fechaPublicacion: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
    ).toLocaleDateString("es-ES"),
    url: "https://usercontent.one/wp/www.puro-geek.com/wp-content/uploads/2021/11/El-codigo-Da-Vinci-Dan-Brown.pdf",
}))

export default function DocumentosPage() {
    const [paginaActual, setPaginaActual] = useState(1)
    const [filtroArea, setFiltroArea] = useState("")
    const documentosPorPagina = 20

    // Filtrar documentos por área si hay filtro activo
    const documentosFiltrados = filtroArea
        ? documentosEjemplo.filter((doc) => doc.areaInvestigacion.toLowerCase().includes(filtroArea.toLowerCase()))
        : documentosEjemplo

    // Calcular documentos para la página actual
    const indiceInicio = (paginaActual - 1) * documentosPorPagina
    const indiceFin = indiceInicio + documentosPorPagina
    const documentosPagina = documentosFiltrados.slice(indiceInicio, indiceFin)

    // Calcular número total de páginas
    const totalPaginas = Math.ceil(documentosFiltrados.length / documentosPorPagina)

    // Obtener áreas únicas para el filtro
    const areasUnicas = [...new Set(documentosEjemplo.map((doc) => doc.areaInvestigacion))]

    const cambiarPagina = (nuevaPagina: number) => {
        setPaginaActual(nuevaPagina)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const cambiarFiltro = (area: string) => {
        setFiltroArea(area)
        setPaginaActual(1)
    }

    return (
        <SimpleLayout>
            <main className={styles.mainContent}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Biblioteca de Documentos</h1>
                    <p className={styles.pageSubtitle}>
                        Explora nuestra colección de {documentosEjemplo.length} documentos académicos y de investigación
                    </p>
                </header>

                <div className={styles.filtersSection}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Filtrar por área:</label>
                        <select className={styles.filterSelect} value={filtroArea} onChange={(e) => cambiarFiltro(e.target.value)}>
                            <option value="">Todas las áreas</option>
                            {areasUnicas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.resultsInfo}>
                        Mostrando {indiceInicio + 1}-{Math.min(indiceFin, documentosFiltrados.length)} de{" "}
                        {documentosFiltrados.length} documentos
                    </div>
                </div>

                <div className={styles.documentosGrid}>
                    {documentosPagina.map((documento) => (
                        <article key={documento.id} className={styles.documentoCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.areaTag}>{documento.areaInvestigacion}</span>
                                <time className={styles.fechaPublicacion}>{documento.fechaPublicacion}</time>
                            </div>

                            <h2 className={styles.documentoTitulo}>
                                <Link href={`/documento/${documento.id}`} className={styles.tituloLink}>
                                    {documento.titulo}
                                </Link>
                            </h2>

                            <div className={styles.autorInfo}>
                                <div className={styles.autorAvatar}>
                                    <span>{documento.autor.charAt(0)}</span>
                                </div>
                                <span className={styles.autorNombre}>{documento.autor}</span>
                            </div>

                            <p className={styles.documentoDescripcion}>{documento.descripcion}</p>

                            <div className={styles.cardFooter}>
                                <Link href={`/documentos/${documento.id}`} className={styles.leerMasBtn}>
                                    Leer más
                                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {totalPaginas > 1 && (
                    <div className={styles.paginacion}>
                        <button
                            className={`${styles.paginaBtn} ${paginaActual === 1 ? styles.disabled : ""}`}
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            <svg className={styles.paginaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Anterior
                        </button>

                        <div className={styles.paginasNumeros}>
                            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                let numeroPagina
                                if (totalPaginas <= 5) {
                                    numeroPagina = i + 1
                                } else if (paginaActual <= 3) {
                                    numeroPagina = i + 1
                                } else if (paginaActual >= totalPaginas - 2) {
                                    numeroPagina = totalPaginas - 4 + i
                                } else {
                                    numeroPagina = paginaActual - 2 + i
                                }

                                return (
                                    <button
                                        key={numeroPagina}
                                        className={`${styles.numeroBtn} ${paginaActual === numeroPagina ? styles.activo : ""}`}
                                        onClick={() => cambiarPagina(numeroPagina)}
                                    >
                                        {numeroPagina}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            className={`${styles.paginaBtn} ${paginaActual === totalPaginas ? styles.disabled : ""}`}
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            Siguiente
                            <svg className={styles.paginaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                )}
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p>&copy; 2024 Academia. Todos los derechos reservados.</p>
                </div>
            </footer>
        </SimpleLayout>
    )
}
