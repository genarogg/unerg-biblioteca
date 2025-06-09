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
        totalItems: 68,
        careerStats: [
          {
            categoria: 'Total Trabajos',
            cantidad: 68,
            porcentaje: 100,
            color: '#7C3AED'
          },
          {
            categoria: 'Ingeniería de Sistemas',
            cantidad: 9,
            porcentaje: 13,
            color: '#8B5CF6'
          },
          {
            categoria: 'Medicina',
            cantidad: 9,
            porcentaje: 13,
            color: '#EC4899'
          },
          {
            categoria: 'Derecho',
            cantidad: 8,
            porcentaje: 12,
            color: '#06B6D4'
          },
          {
            categoria: 'Psicología',
            cantidad: 7,
            porcentaje: 10,
            color: '#10B981'
          },
          {
            categoria: 'Administración de Empresas',
            cantidad: 7,
            porcentaje: 10,
            color: '#F59E0B'
          },
          {
            categoria: 'Arquitectura',
            cantidad: 7,
            porcentaje: 10,
            color: '#EF4444'
          },
          {
            categoria: 'Contaduría Pública',
            cantidad: 6,
            porcentaje: 9,
            color: '#6366F1'
          },
          {
            categoria: 'Enfermería',
            cantidad: 6,
            porcentaje: 9,
            color: '#84CC16'
          },
          {
            categoria: 'Ingeniería Civil',
            cantidad: 5,
            porcentaje: 7,
            color: '#F97316'
          },
          {
            categoria: 'Comunicación Social',
            cantidad: 4,
            porcentaje: 6,
            color: '#8B5CF6'
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
    "Buscar tesis de medicina...",
    "Proyectos de ingeniería...",
    "Investigaciones de psicología...",
    "Trabajos de derecho...",
    "Monografías de arquitectura...",
    "Estudios de administración...",
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

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -50,
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
        duration: 0.8,
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
              Cargando estadísticas...
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
                      isTotal={index === 0}
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