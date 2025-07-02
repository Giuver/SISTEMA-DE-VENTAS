import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import {
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Help as HelpIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const getDialogIcon = (type) => {
    switch (type) {
        case 'warning':
            return <WarningIcon sx={{ color: '#ff9800', fontSize: 48 }} />;
        case 'error':
            return <ErrorIcon sx={{ color: '#f44336', fontSize: 48 }} />;
        case 'info':
            return <InfoIcon sx={{ color: '#2196f3', fontSize: 48 }} />;
        case 'question':
            return <HelpIcon sx={{ color: '#9c27b0', fontSize: 48 }} />;
        default:
            return <WarningIcon sx={{ color: '#ff9800', fontSize: 48 }} />;
    }
};

const getDialogColor = (type) => {
    switch (type) {
        case 'warning':
            return '#ff9800';
        case 'error':
            return '#f44336';
        case 'info':
            return '#2196f3';
        case 'question':
            return '#9c27b0';
        default:
            return '#ff9800';
    }
};

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title = 'Confirmar acción',
    message = '¿Estás seguro de que quieres realizar esta acción?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning',
    severity = 'warning',
    showCancel = true,
    confirmButtonColor = 'primary',
    maxWidth = 'sm',
    fullWidth = true
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
        >
            <DialogTitle sx={{
                pb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `2px solid ${getDialogColor(type)}20`
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getDialogIcon(type)}
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <DialogContentText sx={{
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: 'text.primary'
                }}>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{
                px: 3,
                pb: 3,
                gap: 1
            }}>
                {showCancel && (
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        {cancelText}
                    </Button>
                )}
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={confirmButtonColor}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        minWidth: 100
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog; 