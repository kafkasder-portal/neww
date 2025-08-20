import { CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import React, { useEffect, useState } from 'react'

interface BundleMetrics {
    totalSize: number
    chunkCount: number
    loadTime: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    timeToInteractive: number
}

interface BundleMonitorProps {
    className?: string
}

export const BundleMonitor: React.FC<BundleMonitorProps> = ({ className }) => {
    const [metrics, setMetrics] = useState<BundleMetrics>({
        totalSize: 0,
        chunkCount: 0,
        loadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        timeToInteractive: 0
    })

    const [isMonitoring, setIsMonitoring] = useState(false)

    useEffect(() => {
        // Measure bundle size
        const measureBundleSize = () => {
            const scripts = document.querySelectorAll('script[src]')
            let totalSize = 0
            let chunkCount = 0

            scripts.forEach(script => {
                const src = script.getAttribute('src')
                if (src && src.includes('assets/')) {
                    chunkCount++
                    // Estimate size based on URL patterns
                    if (src.includes('main-')) totalSize += 500 * 1024 // ~500KB
                    else if (src.includes('chunk-')) totalSize += 200 * 1024 // ~200KB
                    else totalSize += 100 * 1024 // ~100KB
                }
            })

            return { totalSize, chunkCount }
        }

        // Measure performance metrics
        const measurePerformance = () => {
            return new Promise<Partial<BundleMetrics>>((resolve) => {
                if ('performance' in window) {
                    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

                    // Get Core Web Vitals
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries()
                        entries.forEach((entry) => {
                            if (entry.entryType === 'paint') {
                                if (entry.name === 'first-contentful-paint') {
                                    resolve({ firstContentfulPaint: entry.startTime })
                                }
                            } else if (entry.entryType === 'largest-contentful-paint') {
                                resolve({ largestContentfulPaint: entry.startTime })
                            }
                        })
                    })

                    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })

                    // Time to Interactive estimation
                    const tti = perfData.loadEventEnd - perfData.fetchStart
                    resolve({
                        loadTime: perfData.loadEventEnd - perfData.fetchStart,
                        timeToInteractive: tti
                    })
                } else {
                    resolve({})
                }
            })
        }

        const startMonitoring = async () => {
            setIsMonitoring(true)

            // Initial measurement
            const bundleMetrics = measureBundleSize()
            const perfMetrics = await measurePerformance()

            setMetrics(prev => ({
                ...prev,
                ...bundleMetrics,
                ...perfMetrics
            }))

            // Continuous monitoring
            const interval = setInterval(() => {
                const newBundleMetrics = measureBundleSize()
                setMetrics(prev => ({
                    ...prev,
                    ...newBundleMetrics
                }))
            }, 5000)

            return () => clearInterval(interval)
        }

        startMonitoring()
    }, [])

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatTime = (ms: number) => {
        return `${ms.toFixed(0)}ms`
    }

    const getPerformanceColor = (value: number, threshold: number) => {
        if (value <= threshold * 0.7) return 'text-green-600'
        if (value <= threshold) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getBundleSizeColor = (size: number) => {
        if (size <= 2 * 1024 * 1024) return 'text-green-600' // < 2MB
        if (size <= 5 * 1024 * 1024) return 'text-yellow-600' // < 5MB
        return 'text-red-600' // > 5MB
    }

    return (
        <CorporateCard className={className}>
            <CorporateCardHeader>
                <CorporateCardTitle className="flex items-center gap-2">
                    📊 Bundle Performance Monitor
                    <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
                </CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
                <div className="grid grid-cols-2 gap-4">
                    {/* Bundle Size Metrics */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700">Bundle Metrics</h4>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total Size:</span>
                                <span className={`text-sm font-medium ${getBundleSizeColor(metrics.totalSize)}`}>
                                    {formatBytes(metrics.totalSize)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Chunks:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {metrics.chunkCount}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Avg Chunk Size:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {metrics.chunkCount > 0 ? formatBytes(metrics.totalSize / metrics.chunkCount) : '0 Bytes'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700">Performance Metrics</h4>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Load Time:</span>
                                <span className={`text-sm font-medium ${getPerformanceColor(metrics.loadTime, 3000)}`}>
                                    {formatTime(metrics.loadTime)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">FCP:</span>
                                <span className={`text-sm font-medium ${getPerformanceColor(metrics.firstContentfulPaint, 1800)}`}>
                                    {formatTime(metrics.firstContentfulPaint)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">LCP:</span>
                                <span className={`text-sm font-medium ${getPerformanceColor(metrics.largestContentfulPaint, 2500)}`}>
                                    {formatTime(metrics.largestContentfulPaint)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">TTI:</span>
                                <span className={`text-sm font-medium ${getPerformanceColor(metrics.timeToInteractive, 3800)}`}>
                                    {formatTime(metrics.timeToInteractive)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Status */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <div className="flex items-center gap-2">
                            {metrics.totalSize > 5 * 1024 * 1024 && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                    Bundle Too Large
                                </span>
                            )}
                            {metrics.loadTime > 3000 && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                    Slow Load
                                </span>
                            )}
                            {metrics.totalSize <= 5 * 1024 * 1024 && metrics.loadTime <= 3000 && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Optimal
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                {metrics.totalSize > 5 * 1024 * 1024 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <h5 className="text-sm font-medium text-yellow-800 mb-1">Optimization Needed</h5>
                        <ul className="text-xs text-yellow-700 space-y-1">
                            <li>• Implement code splitting for large chunks</li>
                            <li>• Optimize vendor dependencies</li>
                            <li>• Enable tree shaking</li>
                            <li>• Use dynamic imports for heavy components</li>
                        </ul>
                    </div>
                )}
            </CorporateCardContent>
        </CorporateCard>
    )
}
