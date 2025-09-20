'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })
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
  Clock
} from 'lucide-react'

interface DataPoint {
  date: string
  temperature: number
  salinity: number
  depth: number
  lat: number
  lon: number
}

export default function DataVisualization() {
  const [selectedChart, setSelectedChart] = useState('temperature')
  const [timeRange, setTimeRange] = useState('7d')
  const [region, setRegion] = useState('global')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for visualizations
  const mockData: DataPoint[] = [
    { date: '2024-01-01', temperature: 28.5, salinity: 35.2, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-02', temperature: 28.2, salinity: 35.1, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-03', temperature: 28.8, salinity: 35.3, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-04', temperature: 29.1, salinity: 35.4, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-05', temperature: 28.9, salinity: 35.2, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-06', temperature: 28.6, salinity: 35.1, depth: 1000, lat: 20, lon: 60 },
    { date: '2024-01-07', temperature: 28.4, salinity: 35.0, depth: 1000, lat: 20, lon: 60 },
  ]

  const chartTypes = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-red-400' },
    { id: 'salinity', label: 'Salinity', icon: Waves, color: 'text-blue-400' },
    { id: 'depth', label: 'Depth Profile', icon: MapPin, color: 'text-green-400' },
    { id: 'map', label: 'Geographic Map', icon: Map, color: 'text-purple-400' },
  ]

  const timeRanges = [
    { id: '1d', label: '1 Day' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ]

  const regions = [
    { id: 'global', label: 'Global' },
    { id: 'pacific', label: 'Pacific Ocean' },
    { id: 'atlantic', label: 'Atlantic Ocean' },
    { id: 'indian', label: 'Indian Ocean' },
  ]

  const generateTemperatureChart = () => ({
    data: [
      {
        x: mockData.map(d => d.date),
        y: mockData.map(d => d.temperature),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Temperature',
        line: { color: '#ef4444', width: 3 },
        marker: { size: 8, color: '#ef4444' },
      }
    ],
    layout: {
      title: 'Ocean Temperature Trends',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Temperature (°C)' },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#f8fafc' },
      margin: { t: 40, b: 40, l: 40, r: 40 },
    },
    config: { responsive: true, displayModeBar: false }
  })

  const generateSalinityChart = () => ({
    data: [
      {
        x: mockData.map(d => d.date),
        y: mockData.map(d => d.salinity),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Salinity',
        line: { color: '#3b82f6', width: 3 },
        marker: { size: 8, color: '#3b82f6' },
      }
    ],
    layout: {
      title: 'Ocean Salinity Trends',
      xaxis: { title: 'Date' },
      yaxis: { title: 'Salinity (PSU)' },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#f8fafc' },
      margin: { t: 40, b: 40, l: 40, r: 40 },
    },
    config: { responsive: true, displayModeBar: false }
  })

  const generateDepthChart = () => ({
    data: [
      {
        x: mockData.map(d => d.depth),
        y: mockData.map(d => d.temperature),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Temperature vs Depth',
        line: { color: '#10b981', width: 3 },
        marker: { size: 8, color: '#10b981' },
      }
    ],
    layout: {
      title: 'Temperature Depth Profile',
      xaxis: { title: 'Depth (m)', autorange: 'reversed' as const },
      yaxis: { title: 'Temperature (°C)' },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#f8fafc' },
      margin: { t: 40, b: 40, l: 40, r: 40 },
    },
    config: { responsive: true, displayModeBar: false }
  })

  const generateMapChart = () => ({
    data: [
      {
        type: 'scattergeo' as const,
        mode: 'markers' as const,
        lat: mockData.map(d => d.lat),
        lon: mockData.map(d => d.lon),
        text: mockData.map(d => `Temp: ${d.temperature}°C<br>Salinity: ${d.salinity} PSU`),
        marker: {
          size: 10,
          color: mockData.map(d => d.temperature),
          colorscale: 'Viridis',
          showscale: true,
          colorbar: { title: 'Temperature (°C)' }
        },
        name: 'ARGO Floats'
      }
    ],
    layout: {
      title: 'Global ARGO Float Distribution',
      geo: {
        projection: { type: 'natural earth' },
        showocean: true,
        oceancolor: '#1e40af',
        showland: true,
        landcolor: '#374151',
        showlakes: true,
        lakecolor: '#1e40af',
        bgcolor: 'rgba(0,0,0,0)',
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#f8fafc' },
      margin: { t: 40, b: 40, l: 40, r: 40 },
    },
    config: { responsive: true, displayModeBar: false }
  })

  const getChartData = () => {
    switch (selectedChart) {
      case 'temperature':
        return generateTemperatureChart()
      case 'salinity':
        return generateSalinityChart()
      case 'depth':
        return generateDepthChart()
      case 'map':
        return generateMapChart()
      default:
        return generateTemperatureChart()
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const stats = [
    { label: 'Total Data Points', value: '12,741', icon: BarChart3, color: 'text-blue-400' },
    { label: 'Active Floats', value: '4,247', icon: MapPin, color: 'text-green-400' },
    { label: 'Avg Temperature', value: '18.5°C', icon: Thermometer, color: 'text-red-400' },
    { label: 'Avg Salinity', value: '35.2 PSU', icon: Waves, color: 'text-cyan-400' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-3">
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl overflow-hidden">
            {/* Chart Header */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-deep-700 p-4">
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
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button className="p-2 bg-deep-700 text-gray-400 hover:text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Controls */}
            <div className="p-4 border-b border-deep-700">
              <div className="flex flex-wrap items-center gap-4">
                {/* Chart Type Selector */}
                <div className="flex gap-2">
                  {chartTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedChart(type.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedChart === type.id
                          ? 'bg-ocean-500 text-white'
                          : 'bg-deep-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  >
                    {timeRanges.map((range) => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {/* Region Selector */}
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-gray-400" />
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  >
                    {regions.map((reg) => (
                      <option key={reg.id} value={reg.id}>{reg.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Chart Display */}
            <div className="p-4">
              <div className="h-96">
                <Plot {...getChartData()} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Live Statistics</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-sm text-gray-300">{stat.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Data Filters */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Data Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Temperature Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Salinity Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Depth Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-deep-700 border border-deep-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ocean-500"
                  />
                </div>
              </div>
              
              <button className="w-full bg-ocean-500 text-white py-2 rounded-lg hover:bg-ocean-600 transition-colors">
                <Filter className="w-4 h-4 inline mr-2" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Updates</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-white">New data from Pacific</div>
                  <div className="text-gray-400 text-xs">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-white">Temperature anomaly detected</div>
                  <div className="text-gray-400 text-xs">5 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-white">ML model updated</div>
                  <div className="text-gray-400 text-xs">10 minutes ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Export Data</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                CSV Format
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                JSON Format
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                NetCDF Format
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
