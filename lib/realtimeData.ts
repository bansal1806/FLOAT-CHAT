// Real-time data service for FloatChat
export interface ArgoFloatData {
  id: string
  lat: number
  lon: number
  temperature: number
  salinity: number
  depth: number
  pressure: number
  oxygen: number
  ph: number
  battery: number
  status: 'active' | 'warning' | 'error' | 'inactive'
  region: string
  mission: string
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor'
  lastUpdate: string
  timestamp: number
}

export interface OceanMetrics {
  globalTemperature: number
  averageSalinity: number
  seaLevelRise: number
  oceanAcidification: number
  currentSpeed: number
  waveHeight: number
  timestamp: number
}

export interface PredictionData {
  temperature: { value: number; trend: 'up' | 'down' | 'stable' }[]
  salinity: { value: number; trend: 'up' | 'down' | 'stable' }[]
  seaLevel: { value: number; trend: 'up' | 'down' | 'stable' }[]
  timestamp: number
}

class RealtimeDataService {
  private subscribers: Map<string, ((data: any) => void)[]> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private isRunning = false

  // Mock ARGO float data
  private mockArgoFloats: ArgoFloatData[] = [
    { id: 'A1', lat: 20, lon: 60, temperature: 28.5, salinity: 35.2, depth: 1000, pressure: 100.5, oxygen: 4.2, ph: 8.1, battery: 87, status: 'active', region: 'Arabian Sea', mission: 'Temperature Monitoring', dataQuality: 'excellent', lastUpdate: '2 min ago', timestamp: Date.now() },
    { id: 'A2', lat: -10, lon: 120, temperature: 26.8, salinity: 34.9, depth: 1500, pressure: 150.2, oxygen: 3.8, ph: 8.0, battery: 92, status: 'active', region: 'Pacific Ocean', mission: 'Climate Research', dataQuality: 'excellent', lastUpdate: '1 min ago', timestamp: Date.now() },
    { id: 'A3', lat: 35, lon: -120, temperature: 18.2, salinity: 35.8, depth: 2000, pressure: 200.8, oxygen: 2.1, ph: 7.9, battery: 45, status: 'warning', region: 'North Pacific', mission: 'Deep Water Study', dataQuality: 'good', lastUpdate: '3 min ago', timestamp: Date.now() },
    { id: 'A4', lat: -30, lon: 30, temperature: 22.1, salinity: 35.5, depth: 800, pressure: 80.3, oxygen: 4.5, ph: 8.2, battery: 78, status: 'active', region: 'South Atlantic', mission: 'Current Analysis', dataQuality: 'excellent', lastUpdate: '1 min ago', timestamp: Date.now() },
    { id: 'A5', lat: 0, lon: 0, temperature: 27.3, salinity: 35.0, depth: 1200, pressure: 120.1, oxygen: 4.0, ph: 8.1, battery: 95, status: 'active', region: 'Equatorial Atlantic', mission: 'El Niño Monitoring', dataQuality: 'excellent', lastUpdate: '2 min ago', timestamp: Date.now() },
    { id: 'A6', lat: 45, lon: 150, temperature: 15.6, salinity: 36.2, depth: 1800, pressure: 180.5, oxygen: 2.8, ph: 7.8, battery: 67, status: 'active', region: 'North Pacific', mission: 'Salinity Tracking', dataQuality: 'good', lastUpdate: '4 min ago', timestamp: Date.now() },
    { id: 'A7', lat: -45, lon: -60, temperature: 8.9, salinity: 34.7, depth: 2500, pressure: 250.9, oxygen: 1.5, ph: 7.6, battery: 12, status: 'error', region: 'Southern Ocean', mission: 'Antarctic Research', dataQuality: 'poor', lastUpdate: '6 min ago', timestamp: Date.now() },
    { id: 'A8', lat: 10, lon: -80, temperature: 25.4, salinity: 35.3, depth: 900, pressure: 90.7, oxygen: 4.3, ph: 8.0, battery: 83, status: 'active', region: 'Caribbean Sea', mission: 'Hurricane Tracking', dataQuality: 'excellent', lastUpdate: '1 min ago', timestamp: Date.now() },
    { id: 'A9', lat: 55, lon: 5, temperature: 12.3, salinity: 35.1, depth: 2200, pressure: 220.3, oxygen: 2.9, ph: 7.9, battery: 71, status: 'active', region: 'North Sea', mission: 'European Waters', dataQuality: 'good', lastUpdate: '5 min ago', timestamp: Date.now() },
    { id: 'A10', lat: -20, lon: 160, temperature: 24.7, salinity: 35.4, depth: 1100, pressure: 110.8, oxygen: 4.1, ph: 8.1, battery: 89, status: 'active', region: 'South Pacific', mission: 'Coral Reef Health', dataQuality: 'excellent', lastUpdate: '2 min ago', timestamp: Date.now() },
  ]

  private oceanMetrics: OceanMetrics = {
    globalTemperature: 18.5,
    averageSalinity: 35.0,
    seaLevelRise: 3.2,
    oceanAcidification: 8.1,
    currentSpeed: 0.15,
    waveHeight: 2.1,
    timestamp: Date.now()
  }

  private predictionData: PredictionData = {
    temperature: [],
    salinity: [],
    seaLevel: [],
    timestamp: Date.now()
  }

  constructor() {
    this.initializePredictionData()
  }

  private initializePredictionData() {
    const now = Date.now()
    const hours = 24
    
    for (let i = 0; i < hours; i++) {
      const time = now - (hours - i) * 60 * 60 * 1000
      this.predictionData.temperature.push({
        value: 18.5 + Math.sin(i * 0.1) * 2 + Math.random() * 0.5,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })
      this.predictionData.salinity.push({
        value: 35.0 + Math.sin(i * 0.15) * 0.5 + Math.random() * 0.2,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })
      this.predictionData.seaLevel.push({
        value: 3.2 + Math.sin(i * 0.05) * 0.1 + Math.random() * 0.05,
        trend: 'up'
      })
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    this.subscribers.get(event)!.push(callback)
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    const callbacks = this.subscribers.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private notify(event: string, data: any) {
    const callbacks = this.subscribers.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true

    // Update ARGO floats every 5 seconds
    this.intervals.set('argo', setInterval(() => {
      this.updateArgoFloats()
    }, 5000))

    // Update ocean metrics every 10 seconds
    this.intervals.set('metrics', setInterval(() => {
      this.updateOceanMetrics()
    }, 10000))

    // Update predictions every 30 seconds
    this.intervals.set('predictions', setInterval(() => {
      this.updatePredictions()
    }, 30000))

    // Initial data push
    this.notify('argo', this.mockArgoFloats)
    this.notify('metrics', this.oceanMetrics)
    this.notify('predictions', this.predictionData)
  }

  stop() {
    this.isRunning = false
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals.clear()
  }

  private updateArgoFloats() {
    this.mockArgoFloats = this.mockArgoFloats.map(float => {
      const variation = (Math.random() - 0.5) * 0.2
      const newTemperature = Math.max(0, Math.min(40, float.temperature + variation))
      const newSalinity = Math.max(30, Math.min(40, float.salinity + variation * 0.1))
      const newBattery = Math.max(0, float.battery - Math.random() * 0.1)
      
      let newStatus = float.status
      if (newBattery < 20) newStatus = 'warning'
      if (newBattery < 10) newStatus = 'error'
      if (newBattery < 5) newStatus = 'inactive'

      return {
        ...float,
        temperature: parseFloat(newTemperature.toFixed(1)),
        salinity: parseFloat(newSalinity.toFixed(1)),
        battery: parseFloat(newBattery.toFixed(1)),
        status: newStatus,
        lastUpdate: 'just now',
        timestamp: Date.now()
      }
    })

    this.notify('argo', this.mockArgoFloats)
  }

  private updateOceanMetrics() {
    const variation = (Math.random() - 0.5) * 0.1
    this.oceanMetrics = {
      globalTemperature: parseFloat((this.oceanMetrics.globalTemperature + variation).toFixed(2)),
      averageSalinity: parseFloat((this.oceanMetrics.averageSalinity + variation * 0.1).toFixed(2)),
      seaLevelRise: parseFloat((this.oceanMetrics.seaLevelRise + Math.random() * 0.01).toFixed(2)),
      oceanAcidification: parseFloat((this.oceanMetrics.oceanAcidification + variation * 0.01).toFixed(2)),
      currentSpeed: parseFloat((this.oceanMetrics.currentSpeed + variation * 0.01).toFixed(3)),
      waveHeight: parseFloat((this.oceanMetrics.waveHeight + variation * 0.1).toFixed(1)),
      timestamp: Date.now()
    }

    this.notify('metrics', this.oceanMetrics)
  }

  private updatePredictions() {
    const now = Date.now()
    const newTemp = 18.5 + Math.sin(now * 0.0001) * 2 + Math.random() * 0.5
    const newSalinity = 35.0 + Math.sin(now * 0.00015) * 0.5 + Math.random() * 0.2
    const newSeaLevel = 3.2 + Math.sin(now * 0.00005) * 0.1 + Math.random() * 0.05

    // Add new data point
    this.predictionData.temperature.push({
      value: parseFloat(newTemp.toFixed(2)),
      trend: newTemp > this.predictionData.temperature[this.predictionData.temperature.length - 1]?.value ? 'up' : 'down'
    })
    this.predictionData.salinity.push({
      value: parseFloat(newSalinity.toFixed(2)),
      trend: newSalinity > this.predictionData.salinity[this.predictionData.salinity.length - 1]?.value ? 'up' : 'down'
    })
    this.predictionData.seaLevel.push({
      value: parseFloat(newSeaLevel.toFixed(2)),
      trend: 'up'
    })

    // Keep only last 24 hours of data
    if (this.predictionData.temperature.length > 24) {
      this.predictionData.temperature.shift()
      this.predictionData.salinity.shift()
      this.predictionData.seaLevel.shift()
    }

    this.predictionData.timestamp = now
    this.notify('predictions', this.predictionData)
  }

  getArgoFloats(): ArgoFloatData[] {
    return this.mockArgoFloats
  }

  getOceanMetrics(): OceanMetrics {
    return this.oceanMetrics
  }

  getPredictionData(): PredictionData {
    return this.predictionData
  }
}

// Singleton instance
export const realtimeDataService = new RealtimeDataService()
