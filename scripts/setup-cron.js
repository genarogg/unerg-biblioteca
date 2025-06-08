// Script para configurar un cron job que actualice los datos diariamente a la 1 AM
// Este script es para referencia - en producción usarías Vercel Cron o similar

const cron = require("node-cron")

// Configurar tarea para ejecutar todos los días a la 1:00 AM
const setupDailyCron = () => {
  console.log("🕐 Setting up daily cron job for 1:00 AM...")

  // Cron expression: segundo minuto hora día mes día_semana
  // '0 0 1 * * *' = todos los días a la 1:00 AM
  cron.schedule(
    "0 0 1 * * *",
    async () => {
      console.log("🔄 Running daily data refresh...")

      try {
        // En un entorno real, harías una llamada HTTP a tu endpoint
        const response = await fetch("http://localhost:3000/api/data/cron")
        const result = await response.json()

        if (result.success) {
          console.log("✅ Daily refresh completed:", result)
        } else {
          console.log("⚠️ Daily refresh completed with fallback:", result)
        }
      } catch (error) {
        console.error("❌ Daily refresh failed:", error)
      }
    },
    {
      timezone: "America/Mexico_City", // Ajusta según tu zona horaria
    },
  )

  console.log("✅ Cron job configured successfully")
}

// Para Vercel, crearías un archivo vercel.json con:
const vercelCronConfig = {
  crons: [
    {
      path: "/api/data/cron",
      schedule: "0 1 * * *",
    },
  ],
}

console.log("Vercel cron configuration:")
console.log(JSON.stringify(vercelCronConfig, null, 2))

// Si estás ejecutando localmente
if (typeof window === "undefined") {
  setupDailyCron()
}
