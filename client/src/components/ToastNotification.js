import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    Snackbar,
    Alert,
    AlertTitle,
    Box,
    IconButton
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe ser usado dentro de ToastProvider');
    }
    return context;
};

const getAlertIcon = (severity) => {
    switch (severity) {
        case 'success':
            return <SuccessIcon />;
        case 'error':
            return <ErrorIcon />;
        case 'warning':
            return <WarningIcon />;
        case 'info':
            return <InfoIcon />;
        default:
            return <InfoIcon />;
    }
};

const getAlertColor = (severity) => {
    switch (severity) {
        case 'success':
            return '#4caf50';
        case 'error':
            return '#f44336';
        case 'warning':
            return '#ff9800';
        case 'info':
            return '#2196f3';
        default:
            return '#2196f3';
    }
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, severity = 'info', title = null, duration = 4000) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            message,
            severity,
            title,
            duration
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, title = 'Éxito') => {
        addToast(message, 'success', title);
    }, [addToast]);

    const error = useCallback((message, title = 'Error') => {
        addToast(message, 'error', title);
    }, [addToast]);

    const warning = useCallback((message, title = 'Advertencia') => {
        addToast(message, 'warning', title);
    }, [addToast]);

    const info = useCallback((message, title = 'Información') => {
        addToast(message, 'info', title);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, warning, info, addToast }}>
            {children}
            {toasts.map((toast) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{
                        '& .MuiSnackbar-root': {
                            top: 24 + (toasts.indexOf(toast) * 80)
                        }
                    }}
                >
                    <Alert
                        severity={toast.severity}
                        variant="filled"
                        onClose={() => removeToast(toast.id)}
                        icon={getAlertIcon(toast.severity)}
                        sx={{
                            minWidth: 300,
                            maxWidth: 400,
                            backgroundColor: getAlertColor(toast.severity),
                            color: 'white',
                            '& .MuiAlert-icon': {
                                color: 'white'
                            },
                            '& .MuiAlert-message': {
                                color: 'white'
                            }
                        }}
                        action={
                            <IconButton
                                size="small"
                                color="inherit"
                                onClick={() => removeToast(toast.id)}
                                sx={{ color: 'white' }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        {toast.title && (
                            <AlertTitle sx={{ color: 'white', fontWeight: 'bold' }}>
                                {toast.title}
                            </AlertTitle>
                        )}
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
}; 