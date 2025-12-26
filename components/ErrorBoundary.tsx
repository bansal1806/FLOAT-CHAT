'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { logger } from '@/lib/logger'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        }
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error to our logging service
        logger.error('ErrorBoundary caught an error', error, {
            componentStack: errorInfo.componentStack,
            errorBoundary: true
        })

        // Call optional error callback
        this.props.onError?.(error, errorInfo)

        // Update state with error info
        this.setState({
            errorInfo
        })
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        })
    }

    handleGoHome = (): void => {
        if (typeof window !== 'undefined') {
            window.location.href = '/'
        }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gradient-deep flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                                <p className="text-gray-400 mt-1">We encountered an unexpected error</p>
                            </div>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-gray-800/60 rounded-lg border border-gray-700/50">
                                <h2 className="text-sm font-semibold text-red-400 mb-2">Error Details (Development Only)</h2>
                                <pre className="text-xs text-gray-300 overflow-x-auto">
                                    {this.state.error.toString()}
                                </pre>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                                            Component Stack
                                        </summary>
                                        <pre className="text-xs text-gray-400 mt-2 overflow-x-auto">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <p className="text-gray-300 mb-6">
                            Don't worry! Your data is safe. You can try refreshing the page or go back to the home page.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
                            <p className="text-xs text-gray-400">
                                If this problem persists, please contact support with the error details above.
                            </p>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
