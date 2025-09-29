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
  Activity,
  Droplets,
  Wind,
  Zap,
  Globe,
  Eye,
  Brain,
  Layers,
  Settings
} from 'lucide-react'
import { realOceanDataService, RealArgoFloat, IncoisOceanData } from '@/lib/realOceanData'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

// Fixed OceanMetrics interface to match the real data service
interface OceanMetrics {
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

interface ChartDataPoint {
  timestamp: string
  temperature: number
  salinity: number
  depth: number
  oxygen?: number
  ph?: number
  floatId: string
}

export default function DataVisualization() {
  const [selectedChart, setSelectedChart] = useState<'temperature' | 'salinity' | 'depth' | 'map' | 'oxygen' | 'trends'>('temperature')
  const [timeRange, setTimeRange] = useState('1d')
  const [region, setRegion] = useState('global')
  const [isLoading, setIsLoading] = useState(false)
  const [oceanMetrics, setOceanMetrics] = useState<OceanMetrics | null>(null)
  const [argoFloats, setArgoFloats] = useState<RealArgoFloat[]>([])
  const [incoisData, setIncoisData] = useState<IncoisOceanData[]>([])
  const [chartData, setChartData] = useState<Record<string, any>>({})
  const [isRealtime, setIsRealtime] = useState(true)
  const [dataHistory, setDataHistory] = useState<ChartDataPoint[]>([])
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [dataQualityFilter, setDataQualityFilter] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all')

  // Real-time data subscription
  useEffect(() => {
    if (isRealtime) {
      realOceanDataService.start()

      const handleArgoUpdate = (data: RealArgoFloat[]) => {
        setArgoFloats(data)
        updateChartData(data)
        updateDataHistory(data)
        setLastUpdate(new Date().toLocaleString())
      }

      const handleIncoisUpdate = (data: IncoisOceanData[]) => {
        setIncoisData(data)
        setLastUpdate(new Date().toLocaleString())
      }

      realOceanDataService.subscribe('argo_update', handleArgoUpdate)
      realOceanDataService.subscribe('incois_update', handleIncoisUpdate)

      // Initial data load
      const initialArgo = realOceanDataService.getArgoFloats()
      const initialIncois = realOceanDataService.getIncoisData()
      const initialMetrics = realOceanDataService.getOceanMetrics()

      setArgoFloats(initialArgo)
      setIncoisData(initialIncois)
      // Fixed: Map the metrics to match our interface
      setOceanMetrics({
        globalTemp: initialMetrics.globalTemp,
        globalSalinity: initialMetrics.globalSalinity,
        activeFloats: initialMetrics.activeFloats,
        totalMeasurements: initialMetrics.totalMeasurements,
        lastUpdate: initialMetrics.lastUpdate,
        regions: initialMetrics.regions
      })
      
      if (initialArgo.length > 0) {
        updateChartData(initialArgo)
        updateDataHistory(initialArgo)
      }
      
      setLastUpdate(new Date().toLocaleString())

      return () => {
        realOceanDataService.unsubscribe('argo_update', handleArgoUpdate)
        realOceanDataService.unsubscribe('incois_update', handleIncoisUpdate)
        realOceanDataService.stop()
      }
    }
  }, [isRealtime])

  const updateDataHistory = (data: RealArgoFloat[]) => {
    const timestamp = new Date().toISOString()
    const newPoints: ChartDataPoint[] = data.map(float => ({
      timestamp,
      temperature: float.temperature,
      salinity: float.salinity,
      depth: float.depth,
      oxygen: float.oxygen,
      ph: float.ph,
      floatId: float.id
    }))

    setDataHistory(prev => {
      const combined = [...prev, ...newPoints]
      // Keep only last 100 points to prevent memory issues
      return combined.slice(-100)
    })
  }

  const updateChartData = (data: RealArgoFloat[]) => {
    // Filter data based on selected criteria
    let filteredData = data
    
    if (selectedRegion !== 'all') {
      filteredData = filteredData.filter(float => 
        float.region.toLowerCase().includes(selectedRegion.toLowerCase())
      )
    }
    
    if (dataQualityFilter !== 'all') {
      filteredData = filteredData.filter(float => float.dataQuality === dataQualityFilter)
    }

    // Create aggregated data for different chart types
    const temperatureData = filteredData.map(float => float.temperature)
    const salinityData = filteredData.map(float => float.salinity)
    const depthData = filteredData.map(float => float.depth)
    const oxygenData = filteredData.filter(f => f.oxygen).map(f => f.oxygen!)
    const phData = filteredData.filter(f => f.ph).map(f => f.ph!)

    setChartData({
      temperature: {
        x: filteredData.map(f => f.id),
        y: temperatureData,
        type: 'scatter' as const,
        mode: 'markers' as const,
        name: 'Temperature (°C)',
        marker: {
          size: 8,
          color: temperatureData,
          colorscale: 'Viridis',
          showscale: true,
          colorbar: { title: 'Temperature (°C)' }
        }
      },
      salinity: {
        x: filteredData.map(f => f.id),
        y: salinityData,
        type: 'scatter' as const,
        mode: 'markers' as const,
        name: 'Salinity (PSU)',
        marker: {
          size: 8,
          color: salinityData,
          colorscale: 'Viridis',
          showscale: true,
          colorbar: { title: 'Salinity (PSU)' }
        }
      },
      oxygen: oxygenData.length > 0 ? {
        x: filteredData.filter(f => f.oxygen).map(f => f.id),
        y: oxygenData,
        type: 'scatter' as const,
        mode: 'markers' as const,
        name: 'Dissolved Oxygen (μmol/kg)',
        marker: {
          size: 10,
          color: oxygenData,
          colorscale: 'Blues',
          showscale: true,
          colorbar: { title: 'Oxygen (μmol/kg)' }
        }
      } : null,
      trends: {
        temperature: {
          x: dataHistory.map(d => new Date(d.timestamp).toLocaleTimeString()),
          y: dataHistory.map(d => d.temperature),
          type: 'scatter' as const,
          mode: 'lines+markers' as const,
          name: 'Temperature Trend',
          line: { color: '#ef4444', width: 2 }
        },
        salinity: {
          x: dataHistory.map(d => new Date(d.timestamp).toLocaleTimeString()),
          y: dataHistory.map(d => d.salinity),
          type: 'scatter' as const,
          mode: 'lines+markers' as const,
          name: 'Salinity Trend',
          line: { color: '#3b82f6', width: 2 }
        }
      }
    })
  }

  const chartTypes = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-red-400' },
    { id: 'salinity', label: 'Salinity', icon: Waves, color: 'text-blue-400' },
    { id: 'oxygen', label: 'Bio-ARGO O₂', icon: Activity, color: 'text-purple-400' },
    { id: 'depth', label: 'Depth Profile', icon: MapPin, color: 'text-green-400' },
    { id: 'trends', label: 'Time Trends', icon: TrendingUp, color: 'text-orange-400' },
    { id: 'map', label: 'Geographic Map', icon: Map, color: 'text-cyan-400' }
  ]

  const timeRanges = [
    { id: '1h', label: '1 Hour' },
    { id: '6h', label: '6 Hours' },
    { id: '1d', label: '1 Day' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' }
  ]

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'indian', label: 'Indian Ocean' },
    { id: 'arabian', label: 'Arabian Sea' },
    { id: 'bengal', label: 'Bay of Bengal' },
    { id: 'pacific', label: 'Pacific Ocean' },
    { id: 'atlantic', label: 'Atlantic Ocean' }
  ]

  const generateRealTimeTemperatureChart = () => {
    if (!chartData.temperature) return null

    return {
      data: [chartData.temperature],
      layout: {
        title: {
          text: `Real-time Ocean Temperature Distribution (${argoFloats.length} floats)`,
          font: { color: '#f8fafc', size: 16 }
        },
        xaxis: { 
          title: 'ARGO Float ID',
          tickangle: -45,
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        yaxis: { 
          title: 'Temperature (°C)',
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 60, b: 80, l: 60, r: 60 }
      } as Partial<Plotly.Layout>,
      config: { responsive: true, displayModeBar: true, displaylogo: false }
    }
  }

  const generateRealTimeSalinityChart = () => {
    if (!chartData.salinity) return null

    return {
      data: [chartData.salinity],
      layout: {
        title: {
          text: `Real-time Ocean Salinity Distribution (${argoFloats.length} floats)`,
          font: { color: '#f8fafc', size: 16 }
        },
        xaxis: { 
          title: 'ARGO Float ID',
          tickangle: -45,
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        yaxis: { 
          title: 'Salinity (PSU)',
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 60, b: 80, l: 60, r: 60 }
      } as Partial<Plotly.Layout>,
      config: { responsive: true, displayModeBar: true, displaylogo: false }
    }
  }

  const generateBioArgoChart = () => {
    const oxygenFloats = argoFloats.filter(f => f.oxygen)
    
    if (oxygenFloats.length === 0) {
      return {
        data: [{
          x: [0],
          y: [0],
          type: 'scatter' as const,
          mode: 'text' as const,
          text: ['No Bio-ARGO data available'],
          textfont: { size: 16, color: '#94a3b8' }
        }],
        layout: {
          title: 'Bio-ARGO Oxygen Measurements',
          xaxis: { visible: false },
          yaxis: { visible: false },
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#f8fafc' }
        } as Partial<Plotly.Layout>,
        config: { responsive: true, displayModeBar: false }
      }
    }

    return {
      data: [
        {
          x: oxygenFloats.map(f => f.depth),
          y: oxygenFloats.map(f => f.oxygen),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: 'Dissolved Oxygen',
          marker: {
            size: 10,
            color: oxygenFloats.map(f => f.oxygen),
            colorscale: 'Blues',
            showscale: true,
            colorbar: { title: 'O₂ (μmol/kg)' }
          }
        }
      ],
      layout: {
        title: {
          text: `Bio-ARGO Oxygen vs Depth (${oxygenFloats.length} sensors)`,
          font: { color: '#f8fafc', size: 16 }
        },
        xaxis: { 
          title: 'Depth (m)',
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        yaxis: { 
          title: 'Dissolved Oxygen (μmol/kg)',
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 60, b: 60, l: 60, r: 60 }
      } as Partial<Plotly.Layout>,
      config: { responsive: true, displayModeBar: true, displaylogo: false }
    }
  }

  const generateDepthProfileChart = () => {
    return {
      data: [
        {
          x: argoFloats.map(f => f.temperature),
          y: argoFloats.map(f => f.depth),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: 'Temperature vs Depth',
          marker: {
            size: 8,
            color: argoFloats.map(f => f.temperature),
            colorscale: 'Viridis',
            showscale: true,
            colorbar: { title: 'Temperature (°C)', x: 1.02 }
          }
        }
      ],
      layout: {
        title: {
          text: `Ocean Depth Profile - Real-time Data (${argoFloats.length} measurements)`,
          font: { color: '#f8fafc', size: 16 }
        },
        xaxis: {
          title: 'Temperature (°C)',
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        yaxis: {
          title: 'Depth (m)',
          autorange: 'reversed' as const,
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 60, b: 60, l: 60, r: 100 }
      } as Partial<Plotly.Layout>,
      config: { responsive: true, displayModeBar: true, displaylogo: false }
    }
  }

  const generateTrendsChart = () => {
    if (!chartData.trends || dataHistory.length === 0) {
      return {
        data: [{
          x: [0],
          y: [0],
          type: 'scatter' as const,
          mode: 'text' as const,
          text: ['Collecting trend data...'],
          textfont: { size: 16, color: '#94a3b8' }
        }],
        layout: {
          title: 'Ocean Parameter Trends',
          xaxis: { visible: false },
          yaxis: { visible: false },
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#f8fafc' }
        } as Partial<Plotly.Layout>,
        config: { responsive: true, displayModeBar: false }
      }
    }

    return {
      data: [
        chartData.trends.temperature,
        chartData.trends.salinity
      ],
      layout: {
        title: {
          text: `Real-time Ocean Parameter Trends (${dataHistory.length} data points)`,
          font: { color: '#f8fafc', size: 16 }
        },
        xaxis: { 
          title: 'Time',
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        yaxis: { 
          title: 'Value',
          color: '#94a3b8',
          gridcolor: '#334155'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 60, b: 60, l: 60, r: 60 },
        legend: { 
          x: 0.02, 
          y: 0.98,
          bgcolor: 'rgba(0,0,0,0.7)'
        }
      } as Partial<Plotly.Layout>,
      config: { responsive: true, displayModeBar: true, displaylogo: false }
    }
  }

  const generateMapChart = () => {
    return {
      data: [
        {
          type: 'scattergeo' as const,
          mode: 'markers' as const,
          lat: argoFloats.map(f => f.lat),
          lon: argoFloats.map(f => f.lon),
          text: argoFloats.map(f => 
            `Float: ${f.wmo_number}<br>` +
            `Temperature: ${f.temperature.toFixed(2)}°C<br>` +
            `Salinity: ${f.salinity.toFixed(3)} PSU<br>` +
            `Depth: ${Math.round(f.depth)}m<br>` +
            `Status: ${f.status}<br>` +
            `Quality: Grade ${f.dataQuality}<br>` +
            `Platform: ${f.platform_type}<br>` +
            `Region: ${f.region}`
          ),
          marker: {
            size: 8,
            color: argoFloats.map(f => f.temperature),
            colorscale: 'Viridis',
            showscale: true,
            colorbar: { 
              title: 'Temperature (°C)',
              titleside: 'right'
            },
            line: {
              color: argoFloats.map(f => 
                f.status === 'active' ? '#10b981' :
                f.status === 'warning' ? '#f59e0b' :
                f.status === 'error' ? '#ef4444' : '#6b7280'
              ),
              width: 2
            }
          },
          name: 'ARGO Floats',
          hovertemplate: '%{text}<extra></extra>'
        }
      ],
      layout: {
        title: {
          text: `Global ARGO Float Distribution - Live Data (${argoFloats.length} floats)`,
          font: { color: '#f8fafc', size: 16 }
        },
        geo: {
          projection: { type: 'natural earth' },
          showocean: true,
          oceancolor: 'rgba(0, 100, 200, 0.3)',
          showland: true,
          landcolor: 'rgba(50, 50, 50, 0.8)',
          showlakes: true,
          lakecolor: 'rgba(0, 100, 200, 0.5)',
          bgcolor: 'rgba(0,0,0,0)',
          showframe: false
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 60, b: 20, l: 20, r: 20 }
      } as Partial<Plotly.Layout>,
      config: { 
        responsive: true, 
        displayModeBar: true, 
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d' as any, 'lasso2d' as any]
      }
    }
  }

  const getCurrentChart = () => {
    switch (selectedChart) {
      case 'temperature':
        return generateRealTimeTemperatureChart()
      case 'salinity':
        return generateRealTimeSalinityChart()
      case 'oxygen':
        return generateBioArgoChart()
      case 'depth':
        return generateDepthProfileChart()
      case 'trends':
        return generateTrendsChart()
      case 'map':
        return generateMapChart() 
      default:
        return generateRealTimeTemperatureChart()
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Force refresh data
      await realOceanDataService.start()
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  const exportData = () => {
    const dataToExport = {
      argoFloats: argoFloats,
      incoisData: incoisData,
      oceanMetrics: oceanMetrics,
      dataHistory: dataHistory,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocean-data-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const currentChart = getCurrentChart()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-gray-700/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Real-time Ocean Analytics
                  </h2>
                  <p className="text-sm text-gray-400">
                    Live ARGO & INCOIS data visualization • Updated: {lastUpdate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Live Data Status */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    isRealtime && argoFloats.length > 0
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        isRealtime && argoFloats.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                      }`}></div>
                      {isRealtime && argoFloats.length > 0 ? 'LIVE' : 'LOADING'}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-colors ${
                      isLoading 
                        ? 'bg-gray-700 text-gray-500' 
                        : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
                    }`}
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <button
                    onClick={exportData}
                    className="p-2 bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                    title="Export Data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
              <div className="space-y-4">
                {/* Chart Type Selection */}
                <div className="flex flex-wrap gap-2">
                  {chartTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedChart(type.id as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        selectedChart === type.id 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
                      }`}
                    >
                      <type.icon className={`w-4 h-4 ${type.color}`} />
                      <span className="text-sm font-medium">{type.label}</span>
                      {type.id === 'oxygen' && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                          {argoFloats.filter(f => f.oxygen).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <select
                      value={timeRange}
                      onChange={e => setTimeRange(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      {timeRanges.map(range => (
                        <option key={range.id} value={range.id}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedRegion}
                      onChange={e => {
                        setSelectedRegion(e.target.value)
                        updateChartData(argoFloats)
                      }}
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      {regions.map(reg => (
                        <option key={reg.id} value={reg.id}>
                          {reg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <select
                      value={dataQualityFilter}
                      onChange={e => {
                        setDataQualityFilter(e.target.value as any)
                        updateChartData(argoFloats)
                      }}
                      className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Quality</option>
                      <option value="A">Grade A (Excellent)</option>
                      <option value="B">Grade B (Good)</option>
                      <option value="C">Grade C (Fair)</option>
                      <option value="D">Grade D (Poor)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsRealtime(!isRealtime)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      isRealtime
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Activity className={`w-4 h-4 ${isRealtime ? 'animate-pulse' : ''}`} />
                    {isRealtime ? 'Live Data' : 'Static Mode'}
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Display */}
            <div className="p-4">
              <div className="h-[500px] relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-2" />
                      <p className="text-white">Updating ocean data...</p>
                    </div>
                  </div>
                )}
                
                {currentChart && (
                  <Plot
                    data={currentChart.data}
                    layout={currentChart.layout}
                    config={currentChart.config}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Real-time Metrics */}
        <div className="space-y-6">
          {/* Live Ocean Metrics */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              Live Metrics
            </h3>
            {oceanMetrics && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Floats</span>
                  <span className="text-green-400 font-semibold animate-pulse">
                    {oceanMetrics.activeFloats}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Global Avg Temp</span>
                  <span className="text-red-400 font-semibold">
                    {oceanMetrics.globalTemp.toFixed(2)}°C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Salinity</span>
                  <span className="text-blue-400 font-semibold">
                    {oceanMetrics.globalSalinity.toFixed(3)} PSU
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Measurements</span>
                  <span className="text-white font-semibold">
                    {oceanMetrics.totalMeasurements.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bio-ARGO</span>
                  <span className="text-purple-400 font-semibold">
                    {argoFloats.filter(f => f.oxygen || f.ph).length} sensors
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Regional Breakdown */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Regional Data
            </h3>
            <div className="space-y-3">
              {oceanMetrics?.regions && Object.entries(oceanMetrics.regions).slice(0, 4).map(([region, data]) => (
                <div key={region} className="bg-gray-800/60 rounded-lg p-3">
                  <div className="font-medium text-white text-sm mb-2">{region}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temp:</span>
                      <span className="text-red-300">{data.avgTemp.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Floats:</span>
                      <span className="text-green-300">{data.floatCount}</span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-400">Salinity:</span>
                      <span className="text-blue-300">{data.avgSalinity.toFixed(2)} PSU</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INCOIS Data */}
          {incoisData.length > 0 && (
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-teal-400" />
                INCOIS Conditions
              </h3>
              <div className="space-y-3">
                {incoisData.slice(0, 2).map((region, index) => (
                  <div key={index} className="bg-gray-800/60 rounded-lg p-3">
                    <div className="font-medium text-white text-sm mb-2">{region.region}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">SST:</span>
                        <span className="text-red-300">{region.temperature.surface.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SSS:</span>
                        <span className="text-blue-300">{region.salinity.surface.toFixed(2)} PSU</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current:</span>
                        <span className="text-green-300">{region.currents.speed.toFixed(2)} m/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wave:</span>
                        <span className="text-purple-300">{region.waves.significant_height.toFixed(1)} m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Quality Stats */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Data Quality
            </h3>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map(grade => {
                const count = argoFloats.filter(f => f.dataQuality === grade).length
                const percentage = argoFloats.length > 0 ? (count / argoFloats.length * 100) : 0
                return (
                  <div key={grade} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        grade === 'A' ? 'text-green-400' :
                        grade === 'B' ? 'text-blue-400' :
                        grade === 'C' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        Grade {grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{count}</span>
                      <span className="text-gray-400 text-xs">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
