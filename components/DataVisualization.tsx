'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Map,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Thermometer,
  Waves,
  MapPin,
  Activity
} from 'lucide-react'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface OceanMetrics {
  globalTemperature: number
  averageSalinity: number
  seaLevelRise: number
}

interface ArgoFloatData {
  id: string
  temperature: number | null
  salinity: number | null
  battery?: number | null
  depth: number
  lat: number
  lon: number
  status: 'active' | 'warning' | 'error'
}

const realtimeDataService = {
  _argoData: [] as ArgoFloatData[],
  _metrics: {
    globalTemperature: 17.3,
    averageSalinity: 34.8,
    seaLevelRise: 3.2
  } as OceanMetrics,
  _subscribers: {
    argo: new Set<(data: ArgoFloatData[]) => void>(),
    metrics: new Set<(data: OceanMetrics) => void>()
  },
  start() {
    this._interval = setInterval(() => {
      this._argoData = Array.from({ length: 20 }, (_, i) => ({
        id: `Float-${i + 1}`,
        temperature: 15 + Math.random() * 10,
        salinity: 34 + Math.random() * 2,
        battery: 50 + Math.random() * 50,
        depth: 1000 + i * 10,
        lat: 20 + Math.random() * 30,
        lon: 60 + Math.random() * 60,
        status: 'active'
      }))
      this._subscribers.argo.forEach(cb => cb(this._argoData))
      this._metrics.globalTemperature += (Math.random() - 0.5) * 0.1
      this._metrics.averageSalinity += (Math.random() - 0.5) * 0.05
      this._metrics.seaLevelRise += 0
      this._subscribers.metrics.forEach(cb => cb(this._metrics))
    }, 5000)
  },
  stop() {
    clearInterval(this._interval)
  },
  subscribe(type: 'argo' | 'metrics', cb: Function) {
    this._subscribers[type].add(cb as any)
  },
  unsubscribe(type: 'argo' | 'metrics', cb: Function) {
    this._subscribers[type].delete(cb as any)
  },
  getArgoFloats(): ArgoFloatData[] {
    return this._argoData
  },
  getOceanMetrics(): OceanMetrics {
    return this._metrics
  },
  _interval: 0 as any
}

export default function DataVisualization() {
  const [selectedChart, setSelectedChart] = useState<'temperature' | 'salinity' | 'depth' | 'map'>('temperature')
  const [timeRange, setTimeRange] = useState('7d')
  const [region, setRegion] = useState('global')
  const [isLoading, setIsLoading] = useState(false)
  const [oceanMetrics, setOceanMetrics] = useState<OceanMetrics | null>(null)
  const [argoFloats, setArgoFloats] = useState<ArgoFloatData[]>([])
  const [chartData, setChartData] = useState<Record<string, any> | null>(null)
  const [isRealtime, setIsRealtime] = useState(true)

  useEffect(() => {
    if (isRealtime) {
      realtimeDataService.start()

      const handleArgoUpdate = (data: ArgoFloatData[]) => {
        setArgoFloats(data)
        updateChartData(data)
      }
      const handleMetricsUpdate = (data: OceanMetrics) => {
        setOceanMetrics(data)
      }

      realtimeDataService.subscribe('argo', handleArgoUpdate)
      realtimeDataService.subscribe('metrics', handleMetricsUpdate)

      setArgoFloats(realtimeDataService.getArgoFloats())
      setOceanMetrics(realtimeDataService.getOceanMetrics())

      return () => {
        realtimeDataService.unsubscribe('argo', handleArgoUpdate)
        realtimeDataService.unsubscribe('metrics', handleMetricsUpdate)
        realtimeDataService.stop()
      }
    }
  }, [isRealtime])

  const updateChartData = (data: ArgoFloatData[]) => {
    const now = new Date()
    const timeLabels = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    const temperatureData = data.map(float => float.temperature ?? null)
    const salinityData = data.map(float => float.salinity ?? null)
    const batteryData = data.map(float => float.battery ?? null)

    setChartData({
      temperature: {
        x: timeLabels,
        y: temperatureData,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Temperature (°C)',
        line: { color: '#0ea5e9', width: 3 },
        marker: { size: 6 }
      },
      salinity: {
        x: timeLabels,
        y: salinityData,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Salinity (PSU)',
        line: { color: '#14b8a6', width: 3 },
        marker: { size: 6 }
      },
      battery: {
        x: timeLabels,
        y: batteryData,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Battery (%)',
        line: { color: '#f59e0b', width: 3 },
        marker: { size: 6 }
      }
    })
  }

  const mockData = [
    { date: '2024-01-01', temperature: 28.5, salinity: 35.2, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-02', temperature: 28.2, salinity: 35.1, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-03', temperature: 28.8, salinity: 35.3, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-04', temperature: 29.1, salinity: 35.4, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-05', temperature: 28.9, salinity: 35.2, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-06', temperature: 28.6, salinity: 35.1, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-07', temperature: 28.4, salinity: 35.0, depth: 1000, lat: 20, lon: 60 }
  ]

  const chartTypes = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'salinity', label: 'Salinity', icon: Waves },
    { id: 'depth', label: 'Depth Profile', icon: MapPin },
    { id: 'map', label: 'Geographic Map', icon: Map }
  ]

  const timeRanges = [
    { id: '1d', label: '1 Day' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ]

  const regions = [
    { id: 'global', label: 'Global' },
    { id: 'pacific', label: 'Pacific Ocean' },
    { id: 'atlantic', label: 'Atlantic Ocean' },
    { id: 'indian', label: 'Indian Ocean' }
  ]

  const generateStaticTemperatureChart = () => ({
    data: [
      {
        x: mockData.map(d => d.date),
        y: mockData.map(d => d.temperature),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Temperature',
        line: { color: '#ef4444', width: 3 },
        marker: { size: 8, color: '#ef4444' }
      }
    ],
    layout: {
      title: 'Ocean Temperature Trends',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Temperature (°C)' },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#f8fafc' },
      margin: { t: 40, b: 40, l: 40, r: 40 }
    },
    config: { responsive: true, displayModeBar: false }
  })

  const generateStaticSalinityChart = () => ({
    data: [
      {
        x: mockData.map(d => d.date),
        y: mockData.map(d => d.salinity),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Salinity',
        line: { color: '#3b82f6', width: 3 },
        marker: { size: 8, color: '#3b82f6' }
      }
    ],
    layout: {
      title: 'Ocean Salinity Trends',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Salinity (PSU)' },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#f8fafc' },
      margin: { t: 40, b: 40, l: 40, r: 40 }
    },
    config: { responsive: true, displayModeBar: false }
  })

  const generateDepthChart = () => {
    const dataSource = argoFloats.length > 0 ? argoFloats : mockData.map(d => ({
      depth: d.depth,
      temperature: d.temperature,
      salinity: d.salinity
    }))

    return {
      data: [
        {
          x: dataSource.map(d => d.temperature),
          y: dataSource.map(d => d.depth),
          type: 'scatter' as const,
          mode: 'lines+markers' as const,
          name: 'Temperature vs Depth',
          line: { color: '#ef4444', width: 3 },
          marker: { size: 8, color: '#ef4444' },
          yaxis: 'y',
          xaxis: 'x'
        },
        {
          x: dataSource.map(d => d.salinity),
          y: dataSource.map(d => d.depth),
          type: 'scatter' as const,
          mode: 'lines+markers' as const,
          name: 'Salinity vs Depth',
          line: { color: '#3b82f6', width: 3 },
          marker: { size: 8, color: '#3b82f6' },
          yaxis: 'y',
          xaxis: 'x2'
        }
      ],
      layout: {
        title: 'Ocean Depth Profile - Real-time Data',
        xaxis: {
          title: 'Temperature (°C)',
          color: '#ef4444',
          domain: [0, 0.45]
        },
        xaxis2: {
          title: 'Salinity (PSU)',
          color: '#3b82f6',
          domain: [0.55, 1],
          anchor: 'y' as 'free' | 'x' | 'y'
        },
        yaxis: {
          title: 'Depth (m)',
          autorange: 'reversed' as
            | 'reversed'
            | 'min reversed'
            | 'max reversed'
            | 'min'
            | 'max'
            | boolean
            | undefined,
          color: '#f8fafc',
          domain: [0, 1]
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 60, b: 40, l: 40, r: 40 },
        legend: { x: 0.7, y: 0.9 }
      },
      config: { responsive: true, displayModeBar: false }
    }
  }

  const generateMapChart = () => {
    const mapData = argoFloats.length > 0 ? argoFloats : mockData.map((d, index) => ({
      id: `M${index + 1}`,
      lat: d.lat,
      lon: d.lon,
      temperature: d.temperature,
      salinity: d.salinity,
      depth: d.depth,
      status: 'active' as const
    }))

    return {
      data: [
        {
          type: 'scattergeo' as const,
          mode: 'markers' as const,
          lat: mapData.map(d => d.lat),
          lon: mapData.map(d => d.lon),
          text: mapData.map(
            d => `Float: ${d.id || 'Unknown'}<br>Temp: ${d.temperature}°C<br>Salinity: ${d.salinity} PSU<br>Depth: ${d.depth}m<br>Status: ${d.status}`
          ),
          marker: {
            size: 12,
            color: mapData.map(d => d.temperature),
            colorscale: 'Viridis',
            showscale: true,
            colorbar: { title: 'Temperature (°C)', titleside: 'right' },
            line: {
              color: mapData.map(d =>
                d.status === 'active'
                  ? '#10b981'
                  : d.status === 'warning'
                  ? '#f59e0b'
                  : d.status === 'error'
                  ? '#ef4444'
                  : '#6b7280'
              ),
              width: 2
            }
          },
          name: 'ARGO Floats'
        }
      ],
      layout: {
        title: 'Global ARGO Float Distribution - Real-time Data',
        geo: {
          projection: { type: 'natural earth' },
          showocean: true,
          oceancolor: 'rgba(0, 100, 200, 0.3)',
          showland: true,
          landcolor: 'rgba(50, 50, 50, 0.8)',
          showlakes: true,
          lakecolor: 'rgba(0, 100, 200, 0.5)',
          showrivers: true,
          rivercolor: 'rgba(0, 100, 200, 0.8)',
          bgcolor: 'rgba(0,0,0,0)',
          showframe: false
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 40, b: 0, l: 0, r: 0 }
      },
      config: { responsive: true, displayModeBar: false }
    }
  }

  const getFallbackChartData = () => {
    switch (selectedChart) {
      case 'temperature':
        return generateStaticTemperatureChart()
      case 'salinity':
        return generateStaticSalinityChart()
      case 'depth':
        return generateDepthChart()
      case 'map':
        return generateMapChart()
      default:
        return generateStaticTemperatureChart()
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-ocean-500/20 to-aqua-500/20 border-b border-deep-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Data Analytics Dashboard</h2>
                  <p className="text-sm text-gray-400">Real-time ocean data visualization and analysis</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Refresh data"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors" aria-label="Download data">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-deep-700">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2">
                  {chartTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedChart(type.id as 'temperature' | 'salinity' | 'depth' | 'map')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedChart === type.id ? 'bg-ocean-500 text-white' : 'bg-deep-700 text-gray-400 hover:text-white'
                      }`}
                      aria-pressed={selectedChart === type.id}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <select
                    value={timeRange}
                    onChange={e => setTimeRange(e.target.value)}
                    className="bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                    aria-label="Select time range"
                  >
                    {timeRanges.map(range => (
                      <option key={range.id} value={range.id}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-gray-400" />
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                    aria-label="Select region"
                  >
                    {regions.map(reg => (
                      <option key={reg.id} value={reg.id}>
                        {reg.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsRealtime(!isRealtime)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isRealtime
                        ? 'bg-aqua-500/20 text-aqua-400 border border-aqua-500/30'
                        : 'bg-deep-700 text-gray-400 hover:text-white'
                    }`}
                    aria-pressed={isRealtime}
                    aria-label="Toggle live data"
                  >
                    <Activity className={`w-4 h-4 ${isRealtime ? 'animate-pulse' : ''}`} />
                    {isRealtime ? 'Live Data' : 'Static Data'}
                  </button>
                  {isRealtime && (
                    <div className="flex items-center gap-2 text-sm text-aqua-400" aria-live="polite">
                      <div className="w-2 h-2 bg-aqua-400 rounded-full animate-pulse"></div>
                      Updating every 5s
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                    aria-label="Refresh chart"
                    onClick={() => {
                      if (isRealtime) {
                        updateChartData(argoFloats)
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors" aria-label="Download chart data">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-96">
                {isRealtime && chartData && (selectedChart === 'temperature' || selectedChart === 'salinity') ? (
                  <Plot
                    data={[chartData[selectedChart]]}
                    layout={{
                      title: `${chartTypes.find(c => c.id === selectedChart)?.label} - Real-time Data`,
                      xaxis: { title: 'Time', gridcolor: '#334155', color: '#94a3b8' },
                      yaxis: { title: chartTypes.find(c => c.id === selectedChart)?.label, gridcolor: '#334155', color: '#94a3b8' },
                      plot_bgcolor: 'transparent',
                      paper_bgcolor: 'transparent',
                      font: { color: '#e2e8f0' },
                      margin: { t: 40, r: 30, b: 40, l: 50 },
                      showlegend: true,
                      legend: { x: 0, y: 1, bgcolor: 'rgba(0,0,0,0.5)' }
                    }}
                    config={{
                      displayModeBar: true,
                      displaylogo: false,
                      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : isRealtime && chartData && selectedChart === 'depth' ? (() => {
                  const depthChart = generateDepthChart()
                  return <Plot data={depthChart.data} layout={depthChart.layout} config={depthChart.config} style={{ width: '100%', height: '100%' }} />
                })() : isRealtime && chartData && selectedChart === 'map' ? (() => {
                  const mapChart = generateMapChart()
                  return <Plot data={mapChart.data} layout={mapChart.layout} config={mapChart.config} style={{ width: '100%', height: '100%' }} />
                })() : (
                  <Plot {...getFallbackChartData()} style={{ width: '100%', height: '100%' }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar and other UI parts can be added here */}
      </div>
    </div>
  )
}
