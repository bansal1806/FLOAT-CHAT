'use client'

import { useMemo } from 'react'
import { RealArgoFloat, IncoisOceanData } from '@/lib/realOceanData'

interface Alert {
    id: string
    type: 'warning' | 'critical' | 'info'
    title: string
    description: string
    region: string
    timestamp: string
    confidence: number
    resolved: boolean
}

/**
 * Custom hook for generating alerts from ocean data
 * Returns alerts based on anomalies detected in the data
 */
export function useAlerts(
    argoFloats: RealArgoFloat[],
    incoisData: IncoisOceanData[]
): Alert[] {
    return useMemo(() => {
        const alerts: Alert[] = []
        const now = new Date()

        // Temperature anomaly alerts
        const highTempFloats = argoFloats.filter(f => f.temperature > 32)
        if (highTempFloats.length > 0) {
            alerts.push({
                id: `temp_anomaly_${now.getTime()}`,
                type: 'critical',
                title: 'High Temperature Anomaly',
                description: `${highTempFloats.length} floats reporting temperatures above 32°C`,
                region: highTempFloats[0].region,
                timestamp: now.toISOString(),
                confidence: 95,
                resolved: false
            })
        }

        // Low oxygen alerts
        const lowOxygenFloats = argoFloats.filter(f => f.oxygen && f.oxygen < 2)
        if (lowOxygenFloats.length > 0) {
            alerts.push({
                id: `oxygen_low_${now.getTime()}`,
                type: 'warning',
                title: 'Low Oxygen Levels',
                description: `${lowOxygenFloats.length} sensors detecting critically low oxygen`,
                region: lowOxygenFloats[0].region,
                timestamp: now.toISOString(),
                confidence: 88,
                resolved: false
            })
        }

        // Salinity anomaly alerts
        const highSalinityFloats = argoFloats.filter(f => f.salinity > 37)
        if (highSalinityFloats.length > 0) {
            alerts.push({
                id: `salinity_high_${now.getTime()}`,
                type: 'warning',
                title: 'High Salinity Detected',
                description: `${highSalinityFloats.length} floats reporting high salinity levels`,
                region: highSalinityFloats[0].region,
                timestamp: now.toISOString(),
                confidence: 85,
                resolved: false
            })
        }

        // INCOIS current anomalies
        const strongCurrents = incoisData.filter(r => r.currents.speed > 2.0)
        if (strongCurrents.length > 0) {
            alerts.push({
                id: `current_strong_${now.getTime()}`,
                type: 'info',
                title: 'Strong Current Activity',
                description: `Unusual current patterns detected in ${strongCurrents[0].region}`,
                region: strongCurrents[0].region,
                timestamp: now.toISOString(),
                confidence: 82,
                resolved: false
            })
        }

        // INCOIS wave alerts
        const highWaves = incoisData.filter(r => r.waves.significant_height > 3.5)
        if (highWaves.length > 0) {
            alerts.push({
                id: `waves_high_${now.getTime()}`,
                type: 'warning',
                title: 'High Wave Activity',
                description: `Significant wave heights above 3.5m in ${highWaves[0].region}`,
                region: highWaves[0].region,
                timestamp: now.toISOString(),
                confidence: 90,
                resolved: false
            })
        }

        // Data quality alerts
        const poorQualityFloats = argoFloats.filter(f => f.dataQuality === 'D')
        if (poorQualityFloats.length > argoFloats.length * 0.1) {
            alerts.push({
                id: `quality_poor_${now.getTime()}`,
                type: 'info',
                title: 'Data Quality Degradation',
                description: `${poorQualityFloats.length} floats reporting poor quality data`,
                region: 'Global Ocean',
                timestamp: now.toISOString(),
                confidence: 78,
                resolved: false
            })
        }

        return alerts
    }, [argoFloats, incoisData])
}

export type { Alert }
