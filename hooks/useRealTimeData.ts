'use client'

import { useState, useEffect } from 'react'
import { realOceanDataService, RealArgoFloat, IncoisOceanData } from '@/lib/realOceanData'

interface UseRealTimeDataReturn {
    argoFloats: RealArgoFloat[]
    incoisData: IncoisOceanData[]
    isRealtime: boolean
    isLoading: boolean
    lastUpdate: string
    toggleRealtime: () => void
    refreshData: () => void
}

/**
 * Custom hook for managing real-time ocean data
 * Handles subscriptions, cleanup, and state management
 */
export function useRealTimeData(): UseRealTimeDataReturn {
    const [argoFloats, setArgoFloats] = useState<RealArgoFloat[]>([])
    const [incoisData, setIncoisData] = useState<IncoisOceanData[]>([])
    const [isRealtime, setIsRealtime] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState<string>('Never')

    useEffect(() => {
        if (!isRealtime) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        // Start the real-time service
        realOceanDataService.start()

        // Define handlers
        const handleArgoUpdate = (data: RealArgoFloat[]) => {
            setArgoFloats(data)
            setLastUpdate(new Date().toLocaleString())
            setIsLoading(false)
        }

        const handleIncoisUpdate = (data: IncoisOceanData[]) => {
            setIncoisData(data)
            setLastUpdate(new Date().toLocaleString())
        }

        // Subscribe to updates
        realOceanDataService.subscribe('argo_update', handleArgoUpdate)
        realOceanDataService.subscribe('incois_update', handleIncoisUpdate)

        // Load initial data
        const initialArgo = realOceanDataService.getArgoFloats()
        const initialIncois = realOceanDataService.getIncoisData()

        if (initialArgo.length > 0) {
            setArgoFloats(initialArgo)
            setIsLoading(false)
        }
        if (initialIncois.length > 0) {
            setIncoisData(initialIncois)
        }
        if (initialArgo.length > 0 || initialIncois.length > 0) {
            setLastUpdate(new Date().toLocaleString())
        }

        // Cleanup
        return () => {
            realOceanDataService.unsubscribe('argo_update', handleArgoUpdate)
            realOceanDataService.unsubscribe('incois_update', handleIncoisUpdate)
            realOceanDataService.stop()
        }
    }, [isRealtime])

    const toggleRealtime = () => {
        setIsRealtime(prev => !prev)
    }

    const refreshData = () => {
        if (isRealtime) {
            realOceanDataService.start()
        }
    }

    return {
        argoFloats,
        incoisData,
        isRealtime,
        isLoading,
        lastUpdate,
        toggleRealtime,
        refreshData
    }
}
