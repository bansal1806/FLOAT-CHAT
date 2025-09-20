'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Target,
  Zap,
  BarChart3,
  Globe,
  Thermometer,
  Waves,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Prediction {
  id: string
  type: 'temperature' | 'salinity' | 'current' | 'anomaly'
  title: string
  confidence: number
  timeframe: string
  impact: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'failed'
  description: string
  data: any
}

export default function PredictiveAnalytics() {
  const [selectedPrediction, setSelectedPrediction] = useState<string>('temperature')
  const [timeframe, setTimeframe] = useState('30d')
  const [isGenerating, setIsGenerating] = useState(false)

  const predictions: Prediction[] = [
    {
      id: 'temperature',
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
      id: 'salinity',
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
      id: 'current',
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
      id: 'anomaly',
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

  const generatePredictionChart = (prediction: Prediction) => {
    const colors = {
      temperature: '#ef4444',
      salinity: '#3b82f6',
      current: '#10b981',
      anomaly: '#f59e0b'
    }

    return {
    data: [
      {
        x: prediction.data.dates,
        y: prediction.data.historical,
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Historical',
        line: { color: colors[prediction.type], width: 3, dash: 'solid' as const },
        marker: { size: 8, color: colors[prediction.type] },
      },
      {
        x: prediction.data.dates,
        y: prediction.data.predicted,
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Predicted',
        line: { color: colors[prediction.type], width: 3, dash: 'dash' as const },
        marker: { size: 8, color: colors[prediction.type], symbol: 'diamond' },
      }
    ],
      layout: {
        title: prediction.title,
        xaxis: { title: 'Date' },
        yaxis: { 
          title: prediction.type === 'temperature' ? 'Temperature (°C)' :
                 prediction.type === 'salinity' ? 'Salinity (PSU)' :
                 prediction.type === 'current' ? 'Current Speed (m/s)' :
                 'Anomaly Index'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#f8fafc' },
        margin: { t: 40, b: 40, l: 40, r: 40 },
        legend: { x: 0, y: 1 },
      },
      config: { responsive: true, displayModeBar: false }
    }
  }

  const handleGeneratePrediction = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const selectedPredictionData = predictions.find(p => p.id === selectedPrediction)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Prediction Area */}
        <div className="lg:col-span-3">
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-deep-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Predictive Analytics</h2>
                  <p className="text-sm text-gray-400">Advanced ML models for ocean forecasting</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGeneratePrediction}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Brain className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Generate Prediction'}
                  </button>
                </div>
              </div>
            </div>

            {/* Prediction Selector */}
            <div className="p-4 border-b border-deep-700">
              <div className="flex flex-wrap gap-2">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.id}
                    onClick={() => setSelectedPrediction(prediction.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedPrediction === prediction.id
                        ? 'bg-ocean-500 text-white'
                        : 'bg-deep-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {prediction.type === 'temperature' && <Thermometer className="w-4 h-4" />}
                    {prediction.type === 'salinity' && <Waves className="w-4 h-4" />}
                    {prediction.type === 'current' && <TrendingUp className="w-4 h-4" />}
                    {prediction.type === 'anomaly' && <AlertTriangle className="w-4 h-4" />}
                    <span className="text-sm">{prediction.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prediction Chart */}
            <div className="p-4">
              {selectedPredictionData && (
                <div className="h-96">
                  <Plot {...generatePredictionChart(selectedPredictionData)} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Prediction Info */}
          {selectedPredictionData && (
            <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Prediction Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Confidence</span>
                  <span className="text-sm font-semibold text-white">{selectedPredictionData.confidence}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Timeframe</span>
                  <span className="text-sm font-semibold text-white">{selectedPredictionData.timeframe}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Impact</span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getImpactColor(selectedPredictionData.impact)}`}>
                    {selectedPredictionData.impact}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedPredictionData.status)}
                    <span className="text-sm font-semibold text-white capitalize">{selectedPredictionData.status}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-deep-700">
                  <p className="text-xs text-gray-400">{selectedPredictionData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Model Performance */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Model Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Accuracy</span>
                <span className="text-sm font-semibold text-green-400">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Precision</span>
                <span className="text-sm font-semibold text-blue-400">91.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Recall</span>
                <span className="text-sm font-semibold text-purple-400">89.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">F1 Score</span>
                <span className="text-sm font-semibold text-orange-400">90.6%</span>
              </div>
            </div>
          </div>

          {/* Active Predictions */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Active Predictions</h3>
            <div className="space-y-3">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPrediction === prediction.id
                      ? 'bg-ocean-500/20 border border-ocean-500/50'
                      : 'bg-deep-700 hover:bg-deep-600'
                  }`}
                  onClick={() => setSelectedPrediction(prediction.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{prediction.title}</span>
                    {getStatusIcon(prediction.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{prediction.timeframe}</span>
                    <span className="text-white font-medium">{prediction.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Warnings */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Alerts & Warnings</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-red-400">High Temperature Anomaly</div>
                  <div className="text-xs text-gray-400">Detected in Pacific Ocean</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-yellow-400">Salinity Change</div>
                  <div className="text-xs text-gray-400">Unusual pattern in Atlantic</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-blue-400">Current Shift</div>
                  <div className="text-xs text-gray-400">Gulf Stream variation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-deep-800/50 backdrop-blur-sm border border-deep-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <Target className="w-4 h-4 inline mr-2" />
                Set Prediction Target
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <Calendar className="w-4 h-4 inline mr-2" />
                Schedule Prediction
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Export Results
              </button>
              <button className="w-full text-left px-3 py-2 bg-deep-700 hover:bg-deep-600 text-gray-300 rounded-lg transition-colors">
                <Globe className="w-4 h-4 inline mr-2" />
                Global Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
