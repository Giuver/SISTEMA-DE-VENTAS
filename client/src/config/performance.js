// Configuración de rendimiento para el frontend
export const PERFORMANCE_CONFIG = {
    // Configuración de caché
    CACHE: {
        // Duración del caché en milisegundos
        DURATION: 5 * 60 * 1000, // 5 minutos
        // Tamaño máximo del caché
        MAX_SIZE: 100,
        // Claves de caché específicas
        KEYS: {
            DASHBOARD_DATA: 'dashboard_data',
            PRODUCTS_LIST: 'products_list',
            USERS_LIST: 'users_list',
            CATEGORIES_LIST: 'categories_list',
            VENTAS_LIST: 'ventas_list',
            REPORTS_DATA: 'reports_data'
        }
    },

    // Configuración de lazy loading
    LAZY_LOADING: {
        // Tiempo de espera antes de mostrar skeleton
        SKELETON_DELAY: 300,
        // Tiempo máximo de carga antes de mostrar error
        TIMEOUT: 10000,
        // Componentes que deben cargarse inmediatamente
        PRELOAD_COMPONENTS: ['Dashboard', 'Login']
    },

    // Configuración de paginación
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
        MAX_PAGE_SIZE: 100
    },

    // Configuración de notificaciones
    NOTIFICATIONS: {
        // Duración de las notificaciones toast
        TOAST_DURATION: 4000,
        // Máximo número de notificaciones simultáneas
        MAX_TOASTS: 3,
        // Posición de las notificaciones
        POSITION: {
            vertical: 'top',
            horizontal: 'right'
        }
    },

    // Configuración de debounce para búsquedas
    DEBOUNCE: {
        SEARCH_DELAY: 300,
        FORM_SUBMIT_DELAY: 500
    },

    // Configuración de optimización de imágenes
    IMAGES: {
        // Tamaño máximo de imagen antes de comprimir
        MAX_SIZE: 1024 * 1024, // 1MB
        // Formatos soportados
        SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
        // Calidad de compresión
        COMPRESSION_QUALITY: 0.8
    },

    // Configuración de monitoreo de rendimiento
    MONITORING: {
        // Habilitar métricas de rendimiento
        ENABLED: process.env.NODE_ENV === 'production',
        // Intervalo de recolección de métricas
        COLLECTION_INTERVAL: 30000, // 30 segundos
        // Métricas a recolectar
        METRICS: [
            'first-contentful-paint',
            'largest-contentful-paint',
            'first-input-delay',
            'cumulative-layout-shift'
        ]
    },

    // Configuración de service worker
    SERVICE_WORKER: {
        // Habilitar service worker para caché offline
        ENABLED: process.env.NODE_ENV === 'production',
        // Estrategia de caché
        CACHE_STRATEGY: 'network-first',
        // Recursos a cachear
        CACHE_RESOURCES: [
            '/static/js/',
            '/static/css/',
            '/static/media/'
        ]
    },

    // Configuración de compresión
    COMPRESSION: {
        // Habilitar compresión gzip
        ENABLED: true,
        // Nivel de compresión
        LEVEL: 6
    },

    // Configuración de bundle splitting
    BUNDLE_SPLITTING: {
        // Tamaño máximo del chunk principal
        MAX_CHUNK_SIZE: 244 * 1024, // 244KB
        // Tamaño mínimo para crear un nuevo chunk
        MIN_CHUNK_SIZE: 20 * 1024 // 20KB
    }
};

// Funciones de utilidad para rendimiento
export const PerformanceUtils = {
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Memoization simple
    memoize: (fn) => {
        const cache = new Map();
        return (...args) => {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = fn.apply(this, args);
            cache.set(key, result);
            return result;
        };
    },

    // Medir tiempo de ejecución
    measureTime: (fn, name = 'Function') => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    },

    // Lazy load de imágenes
    lazyLoadImage: (imgElement, src) => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            imageObserver.observe(imgElement);
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            imgElement.src = src;
        }
    },

    // Preload de recursos críticos
    preloadResource: (href, as = 'fetch') => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    },

    // Limpiar caché
    clearCache: () => {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
    }
};

// Hook para monitorear rendimiento
export const usePerformanceMonitor = () => {
    const measurePageLoad = () => {
        if (typeof window !== 'undefined') {
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');

                console.log('Performance Metrics:', {
                    pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
                    firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime
                });
            });
        }
    };

    return { measurePageLoad };
}; 