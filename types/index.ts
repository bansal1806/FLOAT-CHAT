export interface ArgoFloat {
  id: string
  platformNumber: string
  dateLaunched: string
  dateLastMessage: string
  latitude: number
  longitude: number
  ocean: string
  institution: string
  wmoPlatformType: string
  dataMode: string
  status: 'active' | 'inactive'
}

export interface ArgoProfile {
  id: string
  floatId: string
  profileNumber: number
  date: string
  latitude: number
  longitude: number
  depth: number
  temperature: number
  salinity: number
  pressure: number
  oxygen?: number
  chlorophyll?: number
  nitrate?: number
  ph?: number
  dataQuality: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
  visualization?: string
}

export interface Prediction {
  id: string
  type: 'temperature' | 'salinity' | 'current' | 'anomaly'
  title: string
  confidence: number
  timeframe: string
  impact: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'failed'
  description: string
  data: {
    historical: number[]
    predicted: number[]
    dates: string[]
  }
}

export interface ARDataPoint {
  id: string
  lat: number
  lon: number
  temperature: number
  salinity: number
  depth: number
  distance: number
}

export interface SystemStatus {
  aiService: 'online' | 'offline'
  dataStream: 'active' | 'inactive'
  argoFloats: number
  lastUpdate: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'researcher' | 'student' | 'public'
  preferences: {
    theme: 'light' | 'dark'
    language: string
    notifications: boolean
  }
}

export interface DataFilter {
  dateRange: {
    start: Date
    end: Date
  }
  temperatureRange: {
    min: number
    max: number
  }
  salinityRange: {
    min: number
    max: number
  }
  depthRange: {
    min: number
    max: number
  }
  region: {
    latMin: number
    latMax: number
    lonMin: number
    lonMax: number
  }
}

export interface VisualizationConfig {
  type: 'line' | 'scatter' | 'bar' | 'map' | '3d'
  xAxis: string
  yAxis: string
  colorBy?: string
  sizeBy?: string
  filters: DataFilter
}

export interface MLModel {
  id: string
  name: string
  type: 'forecasting' | 'classification' | 'anomaly_detection'
  version: string
  status: 'training' | 'ready' | 'deployed'
  accuracy: number
  lastTrained: Date
  parameters: Record<string, any>
}

export interface BlockchainTransaction {
  id: string
  hash: string
  blockNumber: number
  dataHash: string
  dataType: 'argo_data' | 'research_paper' | 'model_update'
  ipfsHash: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: Date
}
