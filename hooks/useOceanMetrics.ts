'use client'

import { useMemo } from 'react'
import { RealArgoFloat } from '@/lib/realOceanData'

interface OceanMetrics {
    globalTemp: number
    globalSalinity: number
    activeFloats: number
    totalFloats: number
    dataQualityA: number
    bioArgoCount: number
    regions: {
        [key: string]: {
            avgTemp: number
            avgSalinity: number
            floatCount: number
        }
    }
}

/**
 * Custom hook for calculating ocean metrics from ARGO data
 * Uses memoization for performance
 */
export function useOceanMetrics(argoFloats: RealArgoFloat[]): OceanMetrics {
    return useMemo(() => {
        if (argoFloats.length === 0) {
            return {
                globalTemp: 0,
                globalSalinity: 0,
                activeFloats: 0,
                totalFloats: 0,
                dataQualityA: 0,
                bioArgoCount: 0,
                regions: {}
            }
        }

        // Calculate global metrics
        const activeFloats = argoFloats.filter(f => f.status === 'active').length
        const avgTemp = argoFloats.reduce((sum, f) => sum + f.temperature, 0) / argoFloats.length
        const avgSal = argoFloats.reduce((sum, f) => sum + f.salinity, 0) / argoFloats.length
        const dataQualityA = argoFloats.filter(f => f.dataQuality === 'A').length
        const bioArgoCount = argoFloats.filter(f => f.oxygen || f.ph).length

        // Calculate regional metrics
        const regions: { [key: string]: any } = {}

        argoFloats.forEach(float => {
            if (!regions[float.region]) {
                regions[float.region] = {
                    temps: [],
                    sals: [],
                    count: 0
                }
            }
            regions[float.region].temps.push(float.temperature)
            regions[float.region].sals.push(float.salinity)
            regions[float.region].count++
        })

        // Process region data
        Object.keys(regions).forEach(region => {
            const data = regions[region]
            regions[region] = {
                avgTemp: data.temps.reduce((a: number, b: number) => a + b, 0) / data.temps.length,
                avgSalinity: data.sals.reduce((a: number, b: number) => a + b, 0) / data.sals.length,
                floatCount: data.count
            }
        })

        return {
            globalTemp: Math.round(avgTemp * 100) / 100,
            globalSalinity: Math.round(avgSal * 100) / 100,
            activeFloats,
            totalFloats: argoFloats.length,
            dataQualityA,
            bioArgoCount,
            regions
        }
    }, [argoFloats])
}
