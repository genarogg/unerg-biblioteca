"use client"

import { motion } from "framer-motion"
import "./stats-card.css"

interface StatsCardProps {
  title: string
  subtitle: string
  icon: string
  variant?: "primary" | "secondary"
}

export function StatsCard({ title, subtitle, icon, variant = "secondary" }: StatsCardProps) {
  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  }

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.3,
      },
    },
  }

  const contentVariants = {
    hover: {
      x: 2,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div
      className={`stats-card ${variant}`}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className={`stats-icon ${variant}`} variants={iconVariants}>
        <span className="icon-text">{icon}</span>
      </motion.div>
      <motion.div className="stats-content" variants={contentVariants}>
        <h3 className="stats-title">{title}</h3>
        <p className="stats-subtitle">{subtitle}</p>
      </motion.div>
    </motion.div>
  )
}
