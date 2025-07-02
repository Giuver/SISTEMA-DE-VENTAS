import React from 'react';
import {
    Box,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage
} from '@mui/icons-material';

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 25, 50],
    showPageSizeSelector = true,
    showTotalItems = true,
    disabled = false
}) => {
    const handleFirstPage = () => {
        if (currentPage > 1 && !disabled) {
            onPageChange(1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1 && !disabled) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages && !disabled) {
            onPageChange(currentPage + 1);
        }
    };

    const handleLastPage = () => {
        if (currentPage < totalPages && !disabled) {
            onPageChange(totalPages);
        }
    };

    const handlePageSizeChange = (event) => {
        if (onPageSizeChange) {
            onPageSizeChange(event.target.value);
        }
    };

    // Calcular el rango de elementos mostrados
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    if (totalPages <= 1 && !showPageSizeSelector) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper'
            }}
        >
            {/* Información de elementos */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {showTotalItems && (
                    <Typography variant="body2" color="text.secondary">
                        Mostrando {startItem}-{endItem} de {totalItems} elementos
                    </Typography>
                )}

                {showPageSizeSelector && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Por página</InputLabel>
                        <Select
                            value={pageSize}
                            label="Por página"
                            onChange={handlePageSizeChange}
                            disabled={disabled}
                        >
                            {pageSizeOptions.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>

            {/* Controles de paginación */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    onClick={handleFirstPage}
                    disabled={currentPage <= 1 || disabled}
                    size="small"
                    aria-label="Primera página"
                >
                    <FirstPage />
                </IconButton>

                <IconButton
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1 || disabled}
                    size="small"
                    aria-label="Página anterior"
                >
                    <KeyboardArrowLeft />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Página
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                        {currentPage} de {totalPages}
                    </Typography>
                </Box>

                <IconButton
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages || disabled}
                    size="small"
                    aria-label="Página siguiente"
                >
                    <KeyboardArrowRight />
                </IconButton>

                <IconButton
                    onClick={handleLastPage}
                    disabled={currentPage >= totalPages || disabled}
                    size="small"
                    aria-label="Última página"
                >
                    <LastPage />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Pagination; 