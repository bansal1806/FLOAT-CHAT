// lib/logger.ts
/**
 * Structured Logging Utility
 * Provides environment-aware logging with support for external services
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment: boolean
  private isProduction: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`🔍 [DEBUG] ${message}`, context || '')
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`ℹ️  [INFO] ${message}`, context || '')
    }
    // In production, send to logging service
    this.sendToLoggingService('info', message, context)
  }

  /**
   * Log warnings
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`⚠️  [WARN] ${message}`, context || '')
    this.sendToLoggingService('warn', message, context)
  }

  /**
   * Log errors
   */
  error(message: string, error?: Error | any, context?: LogContext): void {
    console.error(`❌ [ERROR] ${message}`, error || '', context || '')
    this.sendToLoggingService('error', message, { error, ...context })
    
    // In production, send to error tracking (Sentry, etc.)
    if (this.isProduction && typeof window !== 'undefined') {
      // Future: window.Sentry?.captureException(error)
    }
  }

  /**
   * Send logs to external logging service
   * Placeholder for future integration with services like LogRocket, Datadog, etc.
   */
  private sendToLoggingService(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): void {
    if (!this.isProduction) return

    // Future implementation:
    // - Send to LogRocket
    // - Send to Datadog
    // - Send to custom logging endpoint
    
    const canUseBeacon = typeof navigator !== 'undefined' && navigator.sendBeacon
    
    if (canUseBeacon && level === 'error') {
      try {
        const logData = JSON.stringify({
          level,
          message,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        })
        
        // Example: Send to your logging endpoint
        // navigator.sendBeacon('/api/logs', logData)
      } catch (e) {
        // Silently fail if logging fails
      }
    }
  }

  /**
   * Performance timing logger
   */
  time(label: string): void {
    if (this.isDevelopment && typeof console.time === 'function') {
      console.time(label)
    }
  }

  /**
   * End performance timing
   */
  timeEnd(label: string): void {
    if (this.isDevelopment && typeof console.timeEnd === 'function') {
      console.timeEnd(label)
    }
  }

  /**
   * Log data stream events
   */
  dataStream(source: string, count: number, dataType: string): void {
    this.info(`📡 Data stream updated`, {
      source,
      count,
      dataType,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log service lifecycle events
   */
  service(action: 'start' | 'stop', serviceName: string): void {
    const emoji = action === 'start' ? '🚀' : '🛑'
    this.info(`${emoji} Service ${action}ed: ${serviceName}`)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export type for consumers
export type { LogContext, LogLevel }
