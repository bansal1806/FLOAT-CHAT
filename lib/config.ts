/**
 * Configuration Management
 * Centralized configuration for the application
 */

// API Endpoints
export const API_CONFIG = {
    oceanData: process.env.NEXT_PUBLIC_API_URL || '/api/ocean-data',
    argoEndpoint: process.env.NEXT_PUBLIC_ARGO_URL || '/api/ocean-data/argo',
    incoisEndpoint: process.env.NEXT_PUBLIC_INCOIS_URL || '/api/ocean-data/incois',
} as const

// Real-time Data Configuration
export const REALTIME_CONFIG = {
    argoUpdateInterval: Number(process.env.NEXT_PUBLIC_ARGO_INTERVAL) || 300000, // 5 minutes
    incoisUpdateInterval: Number(process.env.NEXT_PUBLIC_INCOIS_INTERVAL) || 60000, // 1 minute
    autoStart: process.env.NEXT_PUBLIC_AUTO_START !== 'false',
} as const

// Feature Flags
export const FEATURES = {
    enableRealtime: process.env.NEXT_PUBLIC_ENABLE_REALTIME !== 'false',
    enableAR: process.env.NEXT_PUBLIC_ENABLE_AR !== 'false',
    enable3D: process.env.NEXT_PUBLIC_ENABLE_3D !== 'false',
    enablePredictions: process.env.NEXT_PUBLIC_ENABLE_PREDICTIONS !== 'false',
} as const

// Application Configuration
export const APP_CONFIG = {
    name: 'FloatChat',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const

// Logging Configuration
export const LOGGING_CONFIG = {
    enableLogging: process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
    logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
    endpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
} as const

// External Service URLs (for documentation/links)
export const EXTERNAL_SERVICES = {
    argoGdac: 'ftp://ftp.ifremer.fr/ifremer/argo/',
    incoisOcean: 'https://incois.gov.in/OON/index.jsp',
    oceanOps: 'https://www.ocean-ops.org/',
    noaa: 'https://data.nodc.noaa.gov/',
    worldOceanAtlas: 'https://www.ncei.noaa.gov/data/oceans/woa/',
} as const

export type ApiConfig = typeof API_CONFIG
export type RealtimeConfig = typeof REALTIME_CONFIG
export type Features = typeof FEATURES
export type AppConfig = typeof APP_CONFIG
