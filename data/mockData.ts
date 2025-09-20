import { ArgoFloat, ArgoProfile, Prediction, ARDataPoint } from '@/types'

export const mockArgoFloats: ArgoFloat[] = [
  {
    id: 'A1',
    platformNumber: '1900001',
    dateLaunched: '2019-01-15',
    dateLastMessage: '2024-01-15T10:30:00Z',
    latitude: 20.5,
    longitude: 60.2,
    ocean: 'Indian',
    institution: 'INCOIS',
    wmoPlatformType: 'Argo Float',
    dataMode: 'R',
    status: 'active'
  },
  {
    id: 'A2',
    platformNumber: '1900002',
    dateLaunched: '2019-02-20',
    dateLastMessage: '2024-01-15T09:45:00Z',
    latitude: -10.3,
    longitude: 120.1,
    ocean: 'Pacific',
    institution: 'JAMSTEC',
    wmoPlatformType: 'Argo Float',
    dataMode: 'R',
    status: 'active'
  },
  {
    id: 'A3',
    platformNumber: '1900003',
    dateLaunched: '2019-03-10',
    dateLastMessage: '2024-01-15T11:15:00Z',
    latitude: 35.2,
    longitude: -120.5,
    ocean: 'Pacific',
    institution: 'SIO',
    wmoPlatformType: 'Argo Float',
    dataMode: 'R',
    status: 'active'
  },
  {
    id: 'A4',
    platformNumber: '1900004',
    dateLaunched: '2019-04-05',
    dateLastMessage: '2024-01-15T08:20:00Z',
    latitude: -30.1,
    longitude: 30.8,
    ocean: 'Atlantic',
    institution: 'IFREMER',
    wmoPlatformType: 'Argo Float',
    dataMode: 'R',
    status: 'active'
  },
  {
    id: 'A5',
    platformNumber: '1900005',
    dateLaunched: '2019-05-12',
    dateLastMessage: '2024-01-15T12:00:00Z',
    latitude: 0.2,
    longitude: 0.1,
    ocean: 'Atlantic',
    institution: 'NOAA',
    wmoPlatformType: 'Argo Float',
    dataMode: 'R',
    status: 'active'
  }
]

export const mockArgoProfiles: ArgoProfile[] = [
  {
    id: 'P1',
    floatId: 'A1',
    profileNumber: 1,
    date: '2024-01-15T10:30:00Z',
    latitude: 20.5,
    longitude: 60.2,
    depth: 1000,
    temperature: 28.5,
    salinity: 35.2,
    pressure: 1000,
    oxygen: 4.2,
    chlorophyll: 0.8,
    nitrate: 2.1,
    ph: 8.1,
    dataQuality: 'A'
  },
  {
    id: 'P2',
    floatId: 'A1',
    profileNumber: 2,
    date: '2024-01-14T10:30:00Z',
    latitude: 20.6,
    longitude: 60.3,
    depth: 1000,
    temperature: 28.2,
    salinity: 35.1,
    pressure: 1000,
    oxygen: 4.1,
    chlorophyll: 0.9,
    nitrate: 2.0,
    ph: 8.0,
    dataQuality: 'A'
  },
  {
    id: 'P3',
    floatId: 'A2',
    profileNumber: 1,
    date: '2024-01-15T09:45:00Z',
    latitude: -10.3,
    longitude: 120.1,
    depth: 1500,
    temperature: 26.8,
    salinity: 34.9,
    pressure: 1500,
    oxygen: 3.8,
    chlorophyll: 1.2,
    nitrate: 1.8,
    ph: 7.9,
    dataQuality: 'A'
  }
]

export const mockPredictions: Prediction[] = [
  {
    id: 'temp-forecast',
    type: 'temperature',
    title: 'Ocean Temperature Forecast',
    confidence: 92,
    timeframe: '30 days',
    impact: 'high',
    status: 'active',
    description: 'Predicting ocean temperature trends using advanced ML models',
    data: {
      historical: [28.5, 28.2, 28.8, 29.1, 28.9, 28.6, 28.4],
      predicted: [28.1, 27.8, 27.5, 27.2, 26.9, 26.6, 26.3],
      dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07']
    }
  },
  {
    id: 'salinity-pattern',
    type: 'salinity',
    title: 'Salinity Pattern Analysis',
    confidence: 88,
    timeframe: '14 days',
    impact: 'medium',
    status: 'active',
    description: 'Analyzing salinity patterns and predicting changes',
    data: {
      historical: [35.2, 35.1, 35.3, 35.4, 35.2, 35.1, 35.0],
      predicted: [34.9, 34.8, 34.7, 34.6, 34.5, 34.4, 34.3],
      dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07']
    }
  },
  {
    id: 'current-prediction',
    type: 'current',
    title: 'Ocean Current Prediction',
    confidence: 85,
    timeframe: '7 days',
    impact: 'medium',
    status: 'active',
    description: 'Forecasting ocean current patterns and speeds',
    data: {
      historical: [0.15, 0.18, 0.12, 0.20, 0.16, 0.14, 0.17],
      predicted: [0.19, 0.22, 0.25, 0.28, 0.31, 0.34, 0.37],
      dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07']
    }
  },
  {
    id: 'el-nino-detection',
    type: 'anomaly',
    title: 'El Niño Detection',
    confidence: 95,
    timeframe: '90 days',
    impact: 'high',
    status: 'active',
    description: 'Early detection of El Niño conditions',
    data: {
      historical: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      predicted: [0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
      dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07']
    }
  }
]

export const mockARData: ARDataPoint[] = [
  {
    id: 'AR1',
    lat: 20.5,
    lon: 60.2,
    temperature: 28.5,
    salinity: 35.2,
    depth: 1000,
    distance: 150
  },
  {
    id: 'AR2',
    lat: 20.3,
    lon: 60.1,
    temperature: 27.8,
    salinity: 35.1,
    depth: 1200,
    distance: 200
  },
  {
    id: 'AR3',
    lat: 20.7,
    lon: 60.3,
    temperature: 29.1,
    salinity: 35.3,
    depth: 800,
    distance: 100
  }
]

export const sampleQueries = [
  "Show me temperature data from the Indian Ocean",
  "What's the salinity near the equator?",
  "Compare ocean currents in the Pacific",
  "Predict El Niño conditions",
  "Find ARGO floats near my location",
  "Analyze temperature anomalies in the last month",
  "Show me depth profiles from the Atlantic",
  "What are the oxygen levels in the Pacific?"
]

export const systemStats = {
  totalFloats: 4247,
  activeFloats: 3891,
  dataPointsToday: 12741,
  lastUpdate: '2 minutes ago',
  globalCoverage: '95%',
  averageTemperature: 18.5,
  averageSalinity: 35.2
}
