import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import axios from 'axios';
import { useTheme, styled } from '@mui/material/styles';

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
    background: '#fff',
    color: '#222',
    border: '1.5px solid #e3eaf5',
    p: 3,
    transition: 'box-shadow 0.2s, transform 0.2s',
    '&:hover': {
        boxShadow: '0 8px 32px rgba(60,60,60,0.13)',
        transform: 'translateY(-2px) scale(1.01)',
    }
}));

const Dashboard = () => {
    const theme = useTheme();
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
            bg: '#1976d2',
            color: '#fff'
        },
        {
            title: 'Ventas Hoy',
            value: stats.ventasHoy || 0,
            subtitle: '',
            icon: <ShoppingCartIcon fontSize="large" />,
            bg: '#2e7d32',
            color: '#fff'
        },
        {
            title: 'Usuarios Activos',
            value: stats.usuariosActivos || 0,
            subtitle: `${stats.totalUsuarios || 0} usuarios registrados`,
            icon: <PeopleIcon fontSize="large" />,
            bg: '#ed6c02',
            color: '#fff'
        },
        {
            title: 'Productos',
            value: stats.totalProductos || 0,
            subtitle: `${stats.totalCategorias || 0} categorías`,
            icon: <InventoryIcon fontSize="large" />,
            bg: '#9c27b0',
            color: '#fff'
        }
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;
            console.log('Token:', token ? 'Presente' : 'No encontrado');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            console.log('Iniciando fetch de datos del dashboard...');

            // Obtener resumen de ventas (hoy)
            console.log('Obteniendo resumen de ventas...');
            const ventasResumenRes = await axios.get('http://localhost:5001/api/ventas/resumen', config);
            console.log('Respuesta ventas resumen:', ventasResumenRes.data);
            const ventasResumen = ventasResumenRes.data.data;

            // Obtener resumen de productos
            console.log('Obteniendo resumen de productos...');
            const productosResumenRes = await axios.get('http://localhost:5001/api/products/resumen', config);
            console.log('Respuesta productos resumen:', productosResumenRes.data);
            const productosResumen = productosResumenRes.data.data;

            // Obtener usuarios
            console.log('Obteniendo usuarios...');
            const usuariosRes = await axios.get('http://localhost:5001/api/users', config);
            console.log('Respuesta usuarios:', usuariosRes.data);
            const usuarios = Array.isArray(usuariosRes.data.data) ? usuariosRes.data.data : (usuariosRes.data.usuarios || []);

            // Usuarios activos (si hay campo activo, si no, total)
            const usuariosActivos = usuarios.filter(u => u.activo !== false).length;

            console.log('Datos obtenidos:', {
                ventasResumen,
                productosResumen,
                usuarios: usuarios.length,
                usuariosActivos
            });

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
            console.log('Obteniendo ventas por mes...');
            const ventasPorMesRes = await axios.get('http://localhost:5001/api/ventas/por-mes', config);
            console.log('Respuesta ventas por mes:', ventasPorMesRes.data);
            const ventasPorMes = ventasPorMesRes.data.data;
            setDataBarras(ventasPorMes.map(v => ({
                mes: `${v._id.mes}/${v._id.anio}`,
                ventas: v.totalVentas,
                ingresos: v.totalIngresos
            })));

            // Gráfico de torta: ventas por categoría
            console.log('Obteniendo ventas por categoría...');
            const ventasPorCategoriaRes = await axios.get('http://localhost:5001/api/ventas/por-categoria', config);
            console.log('Respuesta ventas por categoría:', ventasPorCategoriaRes.data);
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

            console.log('Dashboard data cargado exitosamente');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', background: theme.palette.mode === 'dark' ? '#232e43' : '#f5f6fa' }}>
            <MainContent>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Resumen general del sistema de ventas
                </Typography>
                {/* Tarjetas de resumen en una sola línea con scroll horizontal en móvil */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {resumen.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={item.title}>
                            <Paper elevation={3} sx={{
                                p: 3,
                                borderRadius: 4,
                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
                                color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                minHeight: 140,
                                height: '100%',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
                            }}>
                                <Avatar sx={{
                                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : item.bg,
                                    color: item.color,
                                    width: 64,
                                    height: 64,
                                    mr: 2
                                }}>
                                    {item.icon}
                                </Avatar>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                    <Typography variant="subtitle2" fontSize={18} sx={{ color: theme.palette.text.primary }}>{item.title}</Typography>
                                    <Typography variant="h5" fontWeight={700} fontSize={28} sx={{ color: theme.palette.text.primary }}>{item.value.toLocaleString('es-PE')}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Gráficos */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={8}>
                        <CardPaper sx={{ height: { xs: 340, md: 480 }, minHeight: 320 }}>
                            <Typography variant="h6" gutterBottom>Ventas e Ingresos</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Evolución mensual de ventas e ingresos</Typography>
                            <Box sx={{ height: 300 }}>
                                {dataBarras.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dataBarras}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis dataKey="mes" stroke="#666" />
                                            <YAxis stroke="#666" />
                                            <Tooltip />
                                            <Bar dataKey="ventas" fill="#1976d2" radius={[4, 4, 0, 0]} name="Ventas" />
                                            <Bar dataKey="ingresos" fill="#2e7d32" radius={[4, 4, 0, 0]} name="Ingresos" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <Typography variant="body1" color="text.secondary">Sin datos para mostrar</Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardPaper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <CardPaper sx={{ height: { xs: 340, md: 480 }, minHeight: 320 }}>
                            <Typography variant="h6" gutterBottom>Distribución por Categoría</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Ventas por categoría de producto</Typography>
                            <Box sx={{ height: 300 }}>
                                {dataPie.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dataPie}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {dataPie.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <Typography variant="body1" color="text.secondary">Sin datos para mostrar</Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardPaper>
                    </Grid>
                </Grid>

                {/* Gráfico de línea */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <CardPaper sx={{ height: 400 }}>
                            <Typography variant="h6" gutterBottom>Tendencia de Ingresos</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Ingresos acumulados por mes</Typography>
                            <Box sx={{ height: 300 }}>
                                {dataLinea.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dataLinea}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis dataKey="mes" stroke="#666" />
                                            <YAxis stroke="#666" />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="ingresos" stroke="#1976d2" strokeWidth={3} dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <Typography variant="body1" color="text.secondary">Sin datos para mostrar</Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardPaper>
                    </Grid>
                </Grid>
            </MainContent>
        </Box>
    );
};

export default Dashboard;