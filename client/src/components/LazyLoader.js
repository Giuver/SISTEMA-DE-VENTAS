import React from 'react';
import {
    Card,
    CardContent,
    Skeleton,
    Grid,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

// Skeleton para cards de resumen
export const ResumenCardSkeleton = () => (
    <Card sx={{ minWidth: 275, height: 140 }}>
        <CardContent>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
        </CardContent>
    </Card>
);

// Skeleton para tabla
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    {Array.from({ length: columns }).map((_, index) => (
                        <TableCell key={index}>
                            <Skeleton variant="text" width="100%" height={24} />
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton variant="text" width="100%" height={20} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

// Skeleton para grid de productos
export const ProductGridSkeleton = ({ items = 6 }) => (
    <Grid container spacing={3}>
        {Array.from({ length: items }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="40%" height={20} />
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

// Skeleton para formularios
export const FormSkeleton = ({ fields = 4 }) => (
    <Box sx={{ p: 2 }}>
        {Array.from({ length: fields }).map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={40} />
            </Box>
        ))}
        <Box sx={{ mt: 3 }}>
            <Skeleton variant="rectangular" width="120px" height={36} />
        </Box>
    </Box>
);

// Skeleton para gráficos
export const ChartSkeleton = ({ height = 300 }) => (
    <Card>
        <CardContent>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={height} />
        </CardContent>
    </Card>
);

// Componente de carga general
export const LoadingSpinner = ({ message = "Cargando..." }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            gap: 2
        }}
    >
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="120px" height={20} />
    </Box>
); 