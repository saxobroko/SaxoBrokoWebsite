// Real User Monitoring (RUM) for SaxoBroko Website
// Tracks performance metrics and user experience in production

class RealUserMonitoring {
    constructor() {
        this.metrics = {
            performance: {},
            errors: [],
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            url: window.location.href
        };
        
        this.init();
    }
    
    init() {
        // Wait for page to fully load
        if (document.readyState === 'complete') {
            this.collectMetrics();
        } else {
            window.addEventListener('load', () => this.collectMetrics());
        }
        
        // Setup error tracking
        this.setupErrorTracking();
        
        // Setup user interaction tracking
        this.setupInteractionTracking();
        
        // Setup visibility tracking
        this.setupVisibilityTracking();
    }
    
    collectMetrics() {
        // Navigation Timing
        if (performance.timing) {
            const timing = performance.timing;
            this.metrics.performance = {
                // Page load metrics
                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                loadComplete: timing.loadEventEnd - timing.navigationStart,
                
                // Network metrics
                dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
                tcpConnect: timing.connectEnd - timing.connectStart,
                serverResponse: timing.responseEnd - timing.requestStart,
                
                // Processing metrics
                domProcessing: timing.domComplete - timing.domLoading,
                
                // Time to first byte
                timeToFirstByte: timing.responseStart - timing.navigationStart
            };
        }
        
        // Core Web Vitals
        this.collectCoreWebVitals();
        
        // Resource timing
        this.collectResourceTiming();
        
        // Send metrics after a delay to ensure all are collected
        setTimeout(() => this.sendMetrics(), 2000);
    }
    
    collectCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.performance.lcp = lastEntry.startTime;
            }).observe({entryTypes: ['largest-contentful-paint']});
            
            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                if (firstInput) {
                    this.metrics.performance.fid = firstInput.processingStart - firstInput.startTime;
                }
            }).observe({type: 'first-input', buffered: true});
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.performance.cls = clsValue;
            }).observe({type: 'layout-shift', buffered: true});
        }
        
        // First Contentful Paint (FCP)
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.performance.fcp = entry.startTime;
                }
            });
        }
    }
    
    collectResourceTiming() {
        if (performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            
            // Analyze key resources
            const cssResources = resources.filter(r => r.name.includes('.css'));
            const jsResources = resources.filter(r => r.name.includes('.js'));
            const imageResources = resources.filter(r => r.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i));
            
            this.metrics.performance.resources = {
                css: {
                    count: cssResources.length,
                    totalSize: cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
                    avgLoadTime: cssResources.reduce((sum, r) => sum + r.duration, 0) / cssResources.length || 0
                },
                javascript: {
                    count: jsResources.length,
                    totalSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
                    avgLoadTime: jsResources.reduce((sum, r) => sum + r.duration, 0) / jsResources.length || 0
                },
                images: {
                    count: imageResources.length,
                    totalSize: imageResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
                    avgLoadTime: imageResources.reduce((sum, r) => sum + r.duration, 0) / imageResources.length || 0
                }
            };
        }
    }
    
    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.metrics.errors.push({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now()
            });
        });
        
        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.errors.push({
                type: 'promise',
                message: event.reason?.message || 'Unhandled promise rejection',
                timestamp: Date.now()
            });
        });
        
        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.metrics.errors.push({
                    type: 'resource',
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: Date.now()
                });
            }
        }, true);
    }
    
    setupInteractionTracking() {
        // Track time to first interaction
        let firstInteraction = null;
        
        ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (!firstInteraction) {
                    firstInteraction = Date.now();
                    this.metrics.performance.timeToFirstInteraction = firstInteraction - this.metrics.timestamp;
                }
            }, { once: true, passive: true });
        });
        
        // Track bounce rate indicator
        let hasEngaged = false;
        setTimeout(() => {
            document.addEventListener('click', () => hasEngaged = true, { once: true });
            document.addEventListener('scroll', () => hasEngaged = true, { once: true });
            document.addEventListener('keydown', () => hasEngaged = true, { once: true });
            
            // Check engagement after 30 seconds
            setTimeout(() => {
                this.metrics.performance.userEngaged = hasEngaged;
            }, 30000);
        }, 1000);
    }
    
    setupVisibilityTracking() {
        let startTime = Date.now();
        let totalVisibleTime = 0;
        
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                totalVisibleTime += Date.now() - startTime;
            } else {
                startTime = Date.now();
            }
        });
        
        // Track total visible time on page unload
        window.addEventListener('beforeunload', () => {
            if (document.visibilityState === 'visible') {
                totalVisibleTime += Date.now() - startTime;
            }
            this.metrics.performance.totalVisibleTime = totalVisibleTime;
        });
    }
    
    sendMetrics() {
        // Only send in production (not localhost)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('RUM Metrics (Development Mode):', this.metrics);
            return;
        }
        
        // Send to your analytics endpoint
        const analyticsEndpoint = '/api/analytics/rum';
        
        fetch(analyticsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.metrics),
            keepalive: true
        }).catch(error => {
            console.warn('Failed to send RUM metrics:', error);
        });
        
        // Also log to console in development for debugging
        if (window.location.search.includes('debug=true')) {
            console.log('RUM Metrics:', this.metrics);
        }
    }
    
    // Public method to manually track custom metrics
    trackCustomMetric(name, value, category = 'custom') {
        if (!this.metrics.custom) {
            this.metrics.custom = {};
        }
        
        if (!this.metrics.custom[category]) {
            this.metrics.custom[category] = {};
        }
        
        this.metrics.custom[category][name] = {
            value: value,
            timestamp: Date.now()
        };
    }
    
    // Performance grading
    getPerformanceGrade() {
        const metrics = this.metrics.performance;
        let score = 100;
        
        // Deduct points based on Core Web Vitals
        if (metrics.lcp > 2500) score -= 20; // Poor LCP
        else if (metrics.lcp > 1000) score -= 10; // Needs improvement
        
        if (metrics.fid > 100) score -= 20; // Poor FID
        else if (metrics.fid > 25) score -= 10; // Needs improvement
        
        if (metrics.cls > 0.25) score -= 20; // Poor CLS
        else if (metrics.cls > 0.1) score -= 10; // Needs improvement
        
        if (metrics.fcp > 3000) score -= 15; // Poor FCP
        else if (metrics.fcp > 1800) score -= 8; // Needs improvement
        
        // Deduct points for slow load times
        if (metrics.loadComplete > 5000) score -= 15;
        else if (metrics.loadComplete > 3000) score -= 8;
        
        return Math.max(0, score);
    }
}

// Initialize RUM when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.rumMonitor = new RealUserMonitoring();
    });
} else {
    window.rumMonitor = new RealUserMonitoring();
}

// Export for manual usage
window.RealUserMonitoring = RealUserMonitoring;
