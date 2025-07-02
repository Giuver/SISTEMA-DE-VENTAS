import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../components/ToastNotification';

// Cache simple en memoria
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useApi = (apiCall, dependencies = [], options = {}) => {
    const {
        cacheKey = null,
        cacheDuration = CACHE_DURATION,
        autoExecute = true,
        showLoading = true,
        showErrors = true,
        onSuccess = null,
        onError = null
    } = options;

    const { success, error: showError, info } = useToast();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(autoExecute);
    const [apiError, setApiError] = useState(null);
    const abortControllerRef = useRef(null);

    const execute = useCallback(async (params = {}) => {
        try {
            // Cancelar request anterior si existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            setLoading(true);
            setApiError(null);

            // Verificar caché
            if (cacheKey && cache.has(cacheKey)) {
                const cached = cache.get(cacheKey);
                if (Date.now() - cached.timestamp < cacheDuration) {
                    setData(cached.data);
                    setLoading(false);
                    if (onSuccess) onSuccess(cached.data);
                    return cached.data;
                } else {
                    cache.delete(cacheKey);
                }
            }

            if (showLoading) {
                info('Cargando datos...');
            }

            const result = await apiCall(params, abortControllerRef.current.signal);

            setData(result);

            // Guardar en caché
            if (cacheKey) {
                cache.set(cacheKey, {
                    data: result,
                    timestamp: Date.now()
                });
            }

            if (onSuccess) onSuccess(result);

            return result;
        } catch (err) {
            if (err.name === 'AbortError') {
                return; // Request cancelado
            }

            const errorMessage = err.response?.data?.message || err.message || 'Error en la operación';
            setApiError(errorMessage);

            if (showErrors) {
                showError(errorMessage);
            }

            if (onError) onError(err);

            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiCall, cacheKey, cacheDuration, showLoading, showErrors, onSuccess, onError, info, showError]);

    const invalidateCache = useCallback(() => {
        if (cacheKey && cache.has(cacheKey)) {
            cache.delete(cacheKey);
        }
    }, [cacheKey]);

    const clearCache = useCallback(() => {
        cache.clear();
    }, []);

    useEffect(() => {
        if (autoExecute) {
            execute();
        }
    }, dependencies);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        data,
        loading,
        error: apiError,
        execute,
        invalidateCache,
        clearCache,
        refetch: () => execute()
    };
};

// Hook para operaciones de mutación (POST, PUT, DELETE)
export const useMutation = (apiCall, options = {}) => {
    const {
        showLoading = true,
        showErrors = true,
        showSuccess = true,
        onSuccess = null,
        onError = null,
        successMessage = 'Operación completada exitosamente',
        errorMessage = 'Error en la operación'
    } = options;

    const { success, error: showError, info } = useToast();
    const [loading, setLoading] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const abortControllerRef = useRef(null);

    const execute = useCallback(async (params = {}) => {
        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            setLoading(true);
            setMutationError(null);

            if (showLoading) {
                info('Procesando...');
            }

            const result = await apiCall(params, abortControllerRef.current.signal);

            if (showSuccess) {
                success(successMessage);
            }

            if (onSuccess) onSuccess(result);

            return result;
        } catch (err) {
            if (err.name === 'AbortError') {
                return;
            }

            const errorMsg = err.response?.data?.message || errorMessage;
            setMutationError(errorMsg);

            if (showErrors) {
                showError(errorMsg);
            }

            if (onError) onError(err);

            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiCall, showLoading, showErrors, showSuccess, onSuccess, onError, successMessage, errorMessage, info, success, showError]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        loading,
        error: mutationError,
        execute
    };
};

// Hook para paginación
export const usePagination = (apiCall, pageSize = 10, options = {}) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const { data, loading, error, execute, refetch } = useApi(
        async (params = {}) => {
            const result = await apiCall({ ...params, page, limit: pageSize });
            setTotalPages(Math.ceil(result.total / pageSize));
            setTotalItems(result.total);
            return result.data || result;
        },
        [page, pageSize],
        options
    );

    const goToPage = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    const nextPage = useCallback(() => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }, [page, totalPages]);

    const prevPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    return {
        data,
        loading,
        error,
        page,
        totalPages,
        totalItems,
        goToPage,
        nextPage,
        prevPage,
        refetch
    };
}; 