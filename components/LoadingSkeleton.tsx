'use client'

import React from 'react'

interface LoadingSkeletonProps {
    className?: string
    count?: number
    height?: string
    width?: string
    variant?: 'text' | 'circular' | 'rectangular'
}

/**
 * Loading Skeleton Component
 * Provides visual feedback while content is loading
 */
export function LoadingSkeleton({
    className = '',
    count = 1,
    height = '1rem',
    width = '100%',
    variant = 'text'
}: LoadingSkeletonProps) {
    const baseClasses = 'animate-pulse bg-gray-700/50 rounded'

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    }

    const items = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ height, width }}
            aria-hidden="true"
        />
    ))

    return <div className="space-y-2">{items}</div>
}

/**
 * Specific skeleton variants
 */
export function ChartSkeleton() {
    return (
        <div className="space-y-4" aria-label="Loading chart">
            <LoadingSkeleton height="2rem" width="60%" variant="text" />
            <LoadingSkeleton height="300px" variant="rectangular" />
            <div className="flex gap-4">
                <LoadingSkeleton height="1rem" width="20%" variant="text" />
                <LoadingSkeleton height="1rem" width="20%" variant="text" />
                <LoadingSkeleton height="1rem" width="20%" variant="text" />
            </div>
        </div>
    )
}

export function CardSkeleton() {
    return (
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 space-y-4" aria-label="Loading card">
            <div className="flex items-center gap-3">
                <LoadingSkeleton height="48px" width="48px" variant="circular" />
                <div className="flex-1 space-y-2">
                    <LoadingSkeleton height="1.25rem" width="40%" variant="text" />
                    <LoadingSkeleton height="1rem" width="60%" variant="text" />
                </div>
            </div>
            <LoadingSkeleton height="4px" width="100%" variant="rectangular" />
            <LoadingSkeleton count={3} height="0.875rem" variant="text" />
        </div>
    )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2" aria-label="Loading table">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-700">
                {[1, 2, 3, 4].map((i) => (
                    <LoadingSkeleton key={i} height="1rem" width="80%" variant="text" />
                ))}
            </div>
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 py-2">
                    {[1, 2, 3, 4].map((j) => (
                        <LoadingSkeleton key={j} height="0.875rem" width="70%" variant="text" />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default LoadingSkeleton
