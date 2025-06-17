"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import type { DataTable } from "../types"
import { defaultData } from "../../fn/defaultData"

interface UseTableDataProps {
  apiUrl?: string
  initialData?: DataTable[]
  autoFetch?: boolean
  fetchOnMount?: boolean
  onDataLoad?: (data: DataTable[]) => void
  onDataError?: (error: string) => void
}

interface UseTableDataReturn {
  data: DataTable[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: React.Dispatch<React.SetStateAction<DataTable[]>>
  isUsingFallback: boolean
}

export const useTableData = ({
  apiUrl,
  initialData,
  autoFetch = true,
  fetchOnMount = true,
  onDataLoad,
  onDataError,
}: UseTableDataProps = {}): UseTableDataReturn => {
  const [data, setData] = useState<DataTable[]>(initialData || defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(!apiUrl)

  const fetchData = useCallback(async (): Promise<void> => {
    if (!apiUrl) {
      setIsUsingFallback(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Validar que la respuesta tenga el formato esperado
      let processedData: DataTable[] = []

      if (Array.isArray(result)) {
        processedData = result
      } else if (result.data && Array.isArray(result.data)) {
        processedData = result.data
      } else if (result.users && Array.isArray(result.users)) {
        processedData = result.users
      } else {
        throw new Error("Invalid data format received from server")
      }

      // Validar que los datos tengan la estructura esperada
      if (processedData.length > 0) {
        const firstItem = processedData[0]
        const requiredFields = ["id", "nombre", "correo"]
        const hasRequiredFields = requiredFields.every((field) => field in firstItem)

        if (!hasRequiredFields) {
          console.warn("Data from server missing required fields, using fallback")
          throw new Error("Data structure validation failed")
        }
      }

      setData(processedData)
      setIsUsingFallback(false)
      onDataLoad?.(processedData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.warn("Error fetching data from server, using fallback data:", err)

      setError(errorMessage)
      setData(initialData || defaultData)
      setIsUsingFallback(true)
      onDataError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [apiUrl, initialData, onDataLoad, onDataError])

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData()
  }, [fetchData])

  // Fetch inicial
  useEffect(() => {
    if (autoFetch && fetchOnMount) {
      fetchData()
    }
  }, [fetchData, autoFetch, fetchOnMount])

  return {
    data,
    loading,
    error,
    refetch,
    setData,
    isUsingFallback,
  }
}
