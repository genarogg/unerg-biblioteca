"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchBar } from "@/components/search/SearchBar/SearchBar"
import { ModernStatsCard } from "./ModernStatsCard"
import "./css/dashboard.css"

interface CareerStat {
  categoria: string
  cantidad: number
  porcentaje: number
  color: string
}

interface DashboardStats {
  totalItems: number
  careerStats: CareerStat[]
}

const InteractiveSearchDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      const data = {
        totalItems: 20,
        careerStats: [
         
          {
            categoria: 'Maestría en Ingeniería de Software',
            cantidad: 1,
            porcentaje: 5,
            color: '#8B5CF6'
          },
          {
            categoria: 'Maestría en Salud Pública',
            cantidad: 1,
            porcentaje: 5,
            color: '#EC4899'
          },
          {
            categoria: 'Maestría en Derecho Penal',
            cantidad: 1,
            porcentaje: 5,
            color: '#06B6D4'
          },
          {
            categoria: 'Maestría en Psicología Clínica',
            cantidad: 1,
            porcentaje: 5,
            color: '#10B981'
          },
          {
            categoria: 'Maestría en Administración ',
            cantidad: 1,
            porcentaje: 5,
            color: '#F59E0B'
          },
          {
            categoria: 'Maestría en Arquitectura Sustentable',
            cantidad: 1,
            porcentaje: 5,
            color: '#EF4444'
          },
          {
            categoria: 'Maestría en Auditoría',
            cantidad: 1,
            porcentaje: 5,
            color: '#6366F1'
          },
          {
            categoria: 'Maestría en Enfermería Comunitaria',
            cantidad: 1,
            porcentaje: 5,
            color: '#84CC16'
          },
          {
            categoria: 'Maestría en Ingeniería Estructural',
            cantidad: 1,
            porcentaje: 5,
            color: '#F97316'
          },
          {
            categoria: 'Maestría en Comunicación Corporativa',
            cantidad: 1,
            porcentaje: 5,
            color: '#8B5CF6'
          },
          {
            categoria: 'Especialización en Redes y Telecomunicaciones',
            cantidad: 1,
            porcentaje: 5,
            color: '#6366F1'
          },
          {
            categoria: 'Especialización en Ginecología y Obstetricia',
            cantidad: 1,
            porcentaje: 5,
            color: '#EC4899'
          },
          {
            categoria: 'Especialización en Derecho Laboral',
            cantidad: 1,
            porcentaje: 5,
            color: '#06B6D4'
          },
          {
            categoria: 'Especialización en Terapia Cognitivo Conductual',
            cantidad: 1,
            porcentaje: 5,
            color: '#10B981'
          },
          {
            categoria: 'Especialización en Gerencia de Proyectos',
            cantidad: 1,
            porcentaje: 5,
            color: '#F59E0B'
          },
          {
            categoria: 'Especialización en Diseño de Interiores',
            cantidad: 1,
            porcentaje: 5,
            color: '#EF4444'
          },
          {
            categoria: 'Especialización en Tributación',
            cantidad: 1,
            porcentaje: 5,
            color: '#6366F1'
          },
          {
            categoria: 'Especialización en Enfermería Oncológica',
            cantidad: 1,
            porcentaje: 5,
            color: '#84CC16'
          }
        ],
        lastUpdated: '2025-06-08T20:55:10.517Z'
      }

      setStats(data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchPlaceholders = [
    "Buscar postgrados en salud...",
    "Especializaciones en derecho...",
    "Maestrías en ingeniería...",
    "Estudios avanzados en psicología...",
    "Postgrados en administración...",
    "Programas de comunicación..."
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const searchVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        delay: 0.3,
      },
    },
  }

  const statsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div className="dashboard-container" variants={containerVariants} initial="hidden" animate="visible">

      <motion.div className="dashboard-title" variants={containerVariants}>
        <h1>
          Repositorio Academico
        </h1>
      </motion.div>

      <div className="dashboard-header">
        <motion.div className="search-section" variants={searchVariants}>
          <SearchBar placeholders={searchPlaceholders} typingSpeed={80} typingDelay={1500} debounceTime={2000} />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            className="loading-container"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="loading"
          >
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              Cargando postgrados...
            </motion.p>
          </motion.div>
        ) : (
          stats && (
            <motion.div
              className="stats-section"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              key="stats"
            >
              <motion.div className="stats-grid" variants={statsGridVariants}>
                {stats.careerStats.map((careerStat, index) => (
                  <motion.div key={careerStat.categoria} variants={cardVariants}>
                    <ModernStatsCard
                      categoria={careerStat.categoria}
                      cantidad={careerStat.cantidad}
                      porcentaje={careerStat.porcentaje}
                      color={careerStat.color}
                      // isTotal={index === 0}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default InteractiveSearchDashboard
