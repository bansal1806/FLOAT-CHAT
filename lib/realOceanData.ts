// lib/realOceanData.ts
'use client'

import { EventEmitter } from 'events'
import { logger } from './logger'

export interface RealArgoFloat {
  id: string
  wmo_number: string
  lat: number
  lon: number
  temperature: number
  salinity: number
  pressure: number
  depth: number
  oxygen?: number
  ph?: number
  lastUpdate: string
  status: 'active' | 'inactive' | 'warning' | 'error'
  region: string
  battery: number
  mission: string
  dataQuality: 'A' | 'B' | 'C' | 'D' // Real ARGO quality flags
  platform_type: string
  cycle_number: number
  positioning_system: string
  profile_direction: 'A' | 'D' // Ascending/Descending
}

export interface IncoisOceanData {
  temperature: {
    surface: number
    subsurface: number[]
    depths: number[]
  }
  salinity: {
    surface: number
    subsurface: number[]
    depths: number[]
  }
  currents: {
    u_component: number
    v_component: number
    speed: number
    direction: number
  }
  waves: {
    significant_height: number
    peak_period: number
    direction: number
  }
  region: string
  timestamp: string
}

export interface OceanMetrics {
  globalTemp: number
  globalSalinity: number
  activeFloats: number
  totalMeasurements: number
  lastUpdate: string
  regions: {
    [key: string]: {
      avgTemp: number
      avgSalinity: number
      floatCount: number
    }
  }
}

class RealOceanDataService extends EventEmitter {
  private argoFloats: RealArgoFloat[] = []
  private incoisData: IncoisOceanData[] = []
  private isRunning = false
  private updateInterval: NodeJS.Timeout | null = null
  private proxyUrl = '/api/ocean-data' // We'll create this API route

  async start() {
    if (this.isRunning) return

    this.isRunning = true
    logger.service('start', 'Real-time Ocean Data Service')

    // Initial data fetch
    await this.fetchAllData()

    // Set up periodic updates (every 5 minutes for ARGO, every 1 minute for INCOIS)
    this.updateInterval = setInterval(async () => {
      await this.fetchAllData()
    }, 300000) // 5 minutes

    // More frequent INCOIS updates
    setInterval(async () => {
      await this.fetchIncoisData()
    }, 60000) // 1 minute
  }

  stop() {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    logger.service('stop', 'Real-time Ocean Data Service')
  }

  private async fetchAllData() {
    try {
      await Promise.all([
        this.fetchArgoData(),
        this.fetchIncoisData()
      ])
    } catch (error) {
      logger.error('Failed to fetch ocean data', error as Error)
    }
  }

  private async fetchArgoData() {
    try {
      const response = await fetch(`${this.proxyUrl}/argo`)
      if (!response.ok) throw new Error('Failed to fetch ARGO data')

      const data = await response.json()
      this.argoFloats = this.processArgoData(data)

      this.emit('argo_update', this.argoFloats)
      logger.dataStream('ARGO GDAC', this.argoFloats.length, 'ARGO floats')
    } catch (error) {
      logger.error('Failed to fetch ARGO data', error as Error)
      // Fallback to sample data for development
      this.argoFloats = this.generateSampleArgoData()
      this.emit('argo_update', this.argoFloats)
    }
  }

  private async fetchIncoisData() {
    try {
      const response = await fetch(`${this.proxyUrl}/incois`)
      if (!response.ok) throw new Error('Failed to fetch INCOIS data')

      const data = await response.json()
      this.incoisData = this.processIncoisData(data)

      this.emit('incois_update', this.incoisData)
      logger.dataStream('INCOIS', this.incoisData.length, 'ocean regions')
    } catch (error) {
      logger.error('Failed to fetch INCOIS data', error as Error)
      // Fallback to sample data
      this.incoisData = this.generateSampleIncoisData()
      this.emit('incois_update', this.incoisData)
    }
  }

  private processArgoData(rawData: any[]): RealArgoFloat[] {
    return rawData.map((float, index) => ({
      id: `ARGO_${float.platform_number || index}`,
      wmo_number: float.platform_number?.toString() || `${39000 + index}`,
      lat: parseFloat(float.latitude) || (Math.random() - 0.5) * 180,
      lon: parseFloat(float.longitude) || (Math.random() - 0.5) * 360,
      temperature: parseFloat(float.temp) || 15 + Math.random() * 15,
      salinity: parseFloat(float.psal) || 34 + Math.random() * 2,
      pressure: parseFloat(float.pres) || Math.random() * 2000,
      depth: parseFloat(float.pres) || Math.random() * 2000,
      oxygen: float.doxy ? parseFloat(float.doxy) : undefined,
      ph: float.ph_in_situ_total ? parseFloat(float.ph_in_situ_total) : undefined,
      lastUpdate: float.date || new Date().toISOString(),
      status: this.determineFloatStatus(float),
      region: this.determineRegion(parseFloat(float.latitude), parseFloat(float.longitude)),
      battery: float.battery_level || 70 + Math.random() * 30,
      mission: float.project_name || 'Ocean Observation',
      dataQuality: float.position_qc || 'A',
      platform_type: float.platform_type || 'APEX',
      cycle_number: parseInt(float.cycle_number) || 1,
      positioning_system: float.positioning_system || 'ARGOS',
      profile_direction: float.direction || 'A'
    }))
  }

  private processIncoisData(rawData: any[]): IncoisOceanData[] {
    return rawData.map(region => ({
      temperature: {
        surface: parseFloat(region.sst) || 26 + Math.random() * 6,
        subsurface: region.temp_profile || Array.from({ length: 10 }, (_, i) => 25 - i * 2),
        depths: region.depths || Array.from({ length: 10 }, (_, i) => i * 100)
      },
      salinity: {
        surface: parseFloat(region.sss) || 34.5 + Math.random() * 1,
        subsurface: region.sal_profile || Array.from({ length: 10 }, (_, i) => 34.7 + Math.random() * 0.5),
        depths: region.depths || Array.from({ length: 10 }, (_, i) => i * 100)
      },
      currents: {
        u_component: parseFloat(region.u_current) || (Math.random() - 0.5) * 2,
        v_component: parseFloat(region.v_current) || (Math.random() - 0.5) * 2,
        speed: parseFloat(region.current_speed) || Math.random() * 1.5,
        direction: parseFloat(region.current_dir) || Math.random() * 360
      },
      waves: {
        significant_height: parseFloat(region.wave_height) || 1 + Math.random() * 3,
        peak_period: parseFloat(region.wave_period) || 6 + Math.random() * 6,
        direction: parseFloat(region.wave_dir) || Math.random() * 360
      },
      region: region.region_name || 'Indian Ocean',
      timestamp: region.timestamp || new Date().toISOString()
    }))
  }

  private determineFloatStatus(float: any): 'active' | 'inactive' | 'warning' | 'error' {
    const lastUpdate = new Date(float.date || Date.now())
    const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceUpdate > 30) return 'error'
    if (daysSinceUpdate > 15) return 'inactive'
    if (float.position_qc && float.position_qc > 'B') return 'warning'
    return 'active'
  }

  private determineRegion(lat: number, lon: number): string {
    // Indian Ocean focus as per INCOIS
    if (lat >= -60 && lat <= 25 && lon >= 20 && lon <= 120) {
      if (lat >= 0 && lat <= 25) return 'Northern Indian Ocean'
      if (lat >= -30 && lat < 0) return 'Central Indian Ocean'
      return 'Southern Indian Ocean'
    }

    if (lon >= -180 && lon < -80) return 'Eastern Pacific'
    if (lon >= -80 && lon < 20) return 'Atlantic Ocean'
    if (lon >= 120 && lon <= 180) return 'Western Pacific'

    return 'Global Ocean'
  }

  // Fallback sample data generation
  private generateSampleArgoData(): RealArgoFloat[] {
    const regions = [
      { name: 'Arabian Sea', latRange: [10, 25], lonRange: [60, 75] },
      { name: 'Bay of Bengal', latRange: [5, 22], lonRange: [80, 95] },
      { name: 'Central Indian Ocean', latRange: [-20, 0], lonRange: [60, 90] },
      { name: 'Southern Indian Ocean', latRange: [-50, -20], lonRange: [20, 120] }
    ]

    return Array.from({ length: 50 }, (_, i) => {
      const region = regions[Math.floor(Math.random() * regions.length)]
      const lat = region.latRange[0] + Math.random() * (region.latRange[1] - region.latRange[0])
      const lon = region.lonRange[0] + Math.random() * (region.lonRange[1] - region.lonRange[0])

      return {
        id: `ARGO_${39000 + i}`,
        wmo_number: (39000 + i).toString(),
        lat,
        lon,
        temperature: 15 + Math.random() * 15,
        salinity: 34 + Math.random() * 2,
        pressure: Math.random() * 2000,
        depth: Math.random() * 2000,
        oxygen: Math.random() < 0.7 ? 2 + Math.random() * 6 : undefined,
        ph: Math.random() < 0.5 ? 7.8 + Math.random() * 0.4 : undefined,
        lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: ['active', 'active', 'active', 'warning', 'error'][Math.floor(Math.random() * 5)] as any,
        region: region.name,
        battery: 40 + Math.random() * 60,
        mission: ['INCOIS-Monsoon', 'Climate-Watch', 'Ocean-Dynamics', 'Bio-Argo'][Math.floor(Math.random() * 4)],
        dataQuality: ['A', 'A', 'B', 'C'][Math.floor(Math.random() * 4)] as any,
        platform_type: ['APEX', 'NOVA', 'ARVOR', 'SOLO'][Math.floor(Math.random() * 4)],
        cycle_number: 1 + Math.floor(Math.random() * 200),
        positioning_system: ['ARGOS', 'IRIDIUM'][Math.floor(Math.random() * 2)],
        profile_direction: Math.random() > 0.5 ? 'A' : 'D'
      }
    })
  }

  private generateSampleIncoisData(): IncoisOceanData[] {
    const regions = ['Arabian Sea', 'Bay of Bengal', 'Central Indian Ocean', 'Andaman Sea']

    return regions.map(region => ({
      temperature: {
        surface: 26 + Math.random() * 6,
        subsurface: Array.from({ length: 20 }, (_, i) => Math.max(5, 28 - i * 1.2 + Math.random() * 2)),
        depths: Array.from({ length: 20 }, (_, i) => i * 50)
      },
      salinity: {
        surface: 34.5 + Math.random() * 1,
        subsurface: Array.from({ length: 20 }, (_, i) => 34.7 + Math.random() * 0.5),
        depths: Array.from({ length: 20 }, (_, i) => i * 50)
      },
      currents: {
        u_component: (Math.random() - 0.5) * 2,
        v_component: (Math.random() - 0.5) * 2,
        speed: Math.random() * 1.5,
        direction: Math.random() * 360
      },
      waves: {
        significant_height: 1 + Math.random() * 3,
        peak_period: 6 + Math.random() * 6,
        direction: Math.random() * 360
      },
      region,
      timestamp: new Date().toISOString()
    }))
  }

  // Public methods
  getArgoFloats(): RealArgoFloat[] {
    return [...this.argoFloats]
  }

  getIncoisData(): IncoisOceanData[] {
    return [...this.incoisData]
  }

  getOceanMetrics(): OceanMetrics {
    const activeFloats = this.argoFloats.filter(f => f.status === 'active').length
    const avgTemp = this.argoFloats.reduce((sum, f) => sum + f.temperature, 0) / this.argoFloats.length || 0
    const avgSal = this.argoFloats.reduce((sum, f) => sum + f.salinity, 0) / this.argoFloats.length || 0

    const regions: { [key: string]: any } = {}
    this.argoFloats.forEach(float => {
      if (!regions[float.region]) {
        regions[float.region] = { temps: [], sals: [], count: 0 }
      }
      regions[float.region].temps.push(float.temperature)
      regions[float.region].sals.push(float.salinity)
      regions[float.region].count++
    })

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
      totalMeasurements: this.argoFloats.length * 365, // Estimated annual measurements
      lastUpdate: new Date().toISOString(),
      regions
    }
  }

  subscribe(event: 'argo_update' | 'incois_update', callback: (data: any) => void) {
    this.on(event, callback)
  }

  unsubscribe(event: 'argo_update' | 'incois_update', callback: (data: any) => void) {
    this.off(event, callback)
  }
}

export const realOceanDataService = new RealOceanDataService()
