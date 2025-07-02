import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid, Typography, Paper, Card, CardContent, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import axios from 'axios';
import { useTheme, styled } from '@mui/material/styles';
import { useToast } from './ToastNotification';
import { ResumenCardSkeleton, ChartSkeleton } from './LazyLoader';

const MainContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    p: { xs: 1, sm: 2, md: 4 },
    width: '100%',
    maxWidth: 1800,
    mx: 'auto',
}));

const CardPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 20,
    boxShadow: '0 4px 24px rgba(60,60,60,0.10)',
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1.5px solid ${theme.palette.divider}`,
    p: 3,
    transition: 'box-shadow 0.2s, transform 0.2s',
    '&:hover': {
        boxShadow: '0 8px 32px rgba(60,60,60,0.13)',
        transform: 'translateY(-2px) scale(1.01)',
    }
}));

const MetricCard = styled(Card)(({ theme, color = 'primary' }) => ({
    borderRadius: 16,
    background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].light}10 100%)`,
    border: `1px solid ${theme.palette[color].main}20`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 32px ${theme.palette[color].main}20`,
    }
}));

const Dashboard = () => {
    const theme = useTheme();
    const { success, error, info } = useToast();
    const [dataBarras, setDataBarras] = useState([]);
    const [dataPie, setDataPie] = useState([]);
    const [dataLinea, setDataLinea] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        ingresosHoy: 0,
        ventasHoy: 0,
        ticketPromedio: 0,
        usuariosActivos: 0,
        totalUsuarios: 0,
        totalProductos: 0,
        totalCategorias: 0
    });

    const resumen = [
        {
            title: 'Ingresos Hoy',
            value: stats.ingresosHoy || 0,
            subtitle: `Ticket Promedio: S/ ${(stats.ticketPromedio || 0).toFixed(2)}`,
            icon: <TrendingUpIcon fontSize="large" />,
            color: 'primary',
            trend: '+12.5%',
            trendUp: true
        },
        {
            title: 'Ventas Hoy',
            value: stats.ventasHoy || 0,
            subtitle: `${stats.totalProductos || 0} productos disponibles`,
            icon: <ShoppingCartIcon fontSize="large" />,
            color: 'success',
            trend: '+8.3%',
            trendUp: true
        },
        {
            title: 'Usuarios Activos',
            value: stats.usuariosActivos || 0,
            subtitle: `${stats.totalUsuarios || 0} usuarios registrados`,
            icon: <PeopleIcon fontSize="large" />,
            color: 'warning',
            trend: '+5.2%',
            trendUp: true
        },
        {
            title: 'Productos',
            value: stats.totalProductos || 0,
            subtitle: `${stats.totalCategorias || 0} categorías`,
            icon: <InventoryIcon fontSize="large" />,
            color: 'info',
            trend: '+15.7%',
            trendUp: true
        }
    ];

    const fetchDashboardData = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            if (!token) {
                error('No se encontró token de autenticación');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            info('Cargando datos del dashboard...');

            // Obtener resumen de ventas (hoy)
            const ventasResumenRes = await axios.get('http://localhost:5001/api/ventas/resumen', config);
            const ventasResumen = ventasResumenRes.data.data;

            // Obtener resumen de productos
            const productosResumenRes = await axios.get('http://localhost:5001/api/products/resumen', config);
            const productosResumen = productosResumenRes.data.data;

            // Obtener usuarios
            const usuariosRes = await axios.get('http://localhost:5001/api/users', config);
            const usuarios = Array.isArray(usuariosRes.data.data) ? usuariosRes.data.data : (usuariosRes.data.usuarios || []);

            // Usuarios activos (si hay campo activo, si no, total)
            const usuariosActivos = usuarios.filter(u => u.activo !== false).length;

            setStats({
                ingresosHoy: ventasResumen.ventasHoy || 0,
                ventasHoy: ventasResumen.transaccionesHoy || 0,
                ticketPromedio: ventasResumen.promedio || 0,
                usuariosActivos: usuariosActivos,
                totalUsuarios: usuarios.length,
                totalProductos: productosResumen.totalProductos || 0,
                totalCategorias: productosResumen.categorias || 0
            });

            // Gráfico de barras: ventas e ingresos por mes
            const ventasPorMesRes = await axios.get('http://localhost:5001/api/ventas/por-mes', config);
            const ventasPorMes = ventasPorMesRes.data.data;
            setDataBarras(ventasPorMes.map(v => ({
                mes: `${v._id.mes}/${v._id.anio}`,
                ventas: v.totalVentas,
                ingresos: v.totalIngresos
            })));

            // Gráfico de torta: ventas por categoría
            const ventasPorCategoriaRes = await axios.get('http://localhost:5001/api/ventas/por-categoria', config);
            const ventasPorCategoria = ventasPorCategoriaRes.data;
            setDataPie(ventasPorCategoria.map(cat => ({
                name: cat.categoria,
                value: cat.totalVentas
            })));

            // Gráfico de línea: ingresos por mes (igual que barras, pero solo ingresos)
            setDataLinea(ventasPorMes.map(v => ({
                mes: `${v._id.mes}/${v._id.anio}`,
                ingresos: v.totalIngresos
            })));

            success('Dashboard cargado exitosamente');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            const errorMessage = error.response?.data?.message || 'Error al cargar datos del dashboard';
            error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [success, error, info]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <Box sx={{ position: 'relative', minHeight: '100vh', background: theme.palette.background.default }}>
                <MainContent>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Dashboard
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Resumen general del sistema de ventas
                    </Typography>

                    {/* Skeleton loaders para las tarjetas de resumen */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <ResumenCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Skeleton loaders para los gráficos */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <ChartSkeleton height={400} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <ChartSkeleton height={400} />
                        </Grid>
                    </Grid>
                </MainContent>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', background: theme.palette.background.default }}>
            <MainContent>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Resumen general del sistema de ventas
                </Typography>

                {/* Tarjetas de resumen mejoradas */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {resumen.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={item.title}>
                            <MetricCard color={item.color}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: 3,
                                            backgroundColor: `${theme.palette[item.color].main}20`,
                                            color: theme.palette[item.color].main
                                        }}>
                                            {item.icon}
                                        </Box>
                                        <Chip
                                            label={item.trend}
                                            size="small"
                                            color={item.trendUp ? 'success' : 'error'}
                                            variant="outlined"
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                    </Box>

                                    <Typography variant="h4" fontWeight={700} gutterBottom>
                                        {item.value.toLocaleString()}
                                    </Typography>

                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        {item.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {item.subtitle}
                                    </Typography>
                                </CardContent>
                            </MetricCard>
                        </Grid>
                    ))}
                </Grid>

                {/* Gráficos mejorados */}
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <CardPaper>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Ventas e Ingresos por Mes
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={dataBarras}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis dataKey="mes" stroke={theme.palette.text.secondary} />
                                    <YAxis stroke={theme.palette.text.secondary} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 8
                                        }}
                                    />
                                    <Bar dataKey="ventas" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="ingresos" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardPaper>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <CardPaper>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Ventas por Categoría
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={dataPie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dataPie.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={theme.palette.primary[`${['main', 'light', 'dark', 'contrastText'][index % 4]}`]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 8
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardPaper>
                    </Grid>
                </Grid>
            </MainContent>
        </Box>
    );
};

export default Dashboard;