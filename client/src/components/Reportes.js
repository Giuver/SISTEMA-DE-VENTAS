import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Tabs, Tab, Button, Stack, Avatar, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const resumen = [
    {
        title: 'Ingresos del Mes',
        value: 95430,
        icon: <TrendingUpIcon fontSize="large" color="primary" />,
        subtitle: '+15.3% vs mes anterior',
        color: '#1976d2',
        bg: '#e3f2fd',
        prefix: 'S/'
    },
    {
        title: 'Órdenes Procesadas',
        value: 1847,
        icon: <ShoppingCartIcon fontSize="large" color="success" />,
        subtitle: '+8.7% este mes',
        color: '#43a047',
        bg: '#e8f5e9',
        prefix: ''
    },
    {
        title: 'Nuevos Clientes',
        value: 342,
        icon: <PeopleIcon fontSize="large" color="info" />,
        subtitle: '+23.1% vs mes anterior',
        color: '#0288d1',
        bg: '#e1f5fe',
        prefix: ''
    },
    {
        title: 'Ticket Promedio',
        value: 51.7,
        icon: <ReceiptIcon fontSize="large" color="warning" />,
        subtitle: '+5.2% por orden',
        color: '#fbc02d',
        bg: '#fffde7',
        prefix: 'S/'
    }
];

const dataVentas = [
    { mes: 'Ene', ventas: 65000 },
    { mes: 'Feb', ventas: 60000 },
    { mes: 'Mar', ventas: 70000 },
    { mes: 'Abr', ventas: 75000 },
    { mes: 'May', ventas: 80000 },
    { mes: 'Jun', ventas: 100000 },
];

const dataPie = [
    { name: 'Electrónicos', value: 45 },
    { name: 'Ropa', value: 25 },
    { name: 'Hogar', value: 20 },
    { name: 'Deportes', value: 10 },
];
const coloresPie = ['#1976d2', '#43a047', '#fbc02d', '#d72638'];

const dataHora = [
    { hora: '08:00', ventas: 1200 },
    { hora: '09:00', ventas: 1800 },
    { hora: '10:00', ventas: 2500 },
    { hora: '11:00', ventas: 3200 },
    { hora: '12:00', ventas: 4000 },
    { hora: '13:00', ventas: 4200 },
    { hora: '14:00', ventas: 3900 },
    { hora: '15:00', ventas: 4500 },
    { hora: '16:00', ventas: 4100 },
    { hora: '17:00', ventas: 3500 },
    { hora: '18:00', ventas: 2000 },
    { hora: '19:00', ventas: 1200 },
];

const productosMasVendidos = [
    {
        nombre: 'iPhone 15 Pro',
        cantidad: 156,
        total: 155400,
        precioUnidad: 996.15,
    },
    {
        nombre: 'Laptop Dell XPS',
        cantidad: 89,
        total: 115670,
        precioUnidad: 1299.66,
    },
    {
        nombre: 'Nike Air Max',
        cantidad: 234,
        total: 23400,
        precioUnidad: 100.00,
    },
    {
        nombre: 'Samsung TV 55"',
        cantidad: 67,
        total: 53600,
        precioUnidad: 800.00,
    },
    {
        nombre: 'AirPods Pro',
        cantidad: 198,
        total: 39600,
        precioUnidad: 200.00,
    },
];

const dataRendimiento = productosMasVendidos.map(p => ({ nombre: p.nombre, cantidad: p.cantidad }));

const tabs = [
    { label: 'Ventas' },
    { label: 'Productos' },
    { label: 'Clientes' },
    { label: 'Rendimiento' },
];

const vendedoresTop = [
    { nombre: 'María García', monto: 12500, color: '#b2f2bb' },
    { nombre: 'Carlos Ruiz', monto: 8900, color: '#a5d8ff' },
    { nombre: 'Luis Martín', monto: 7200, color: '#ffe066' },
];

const metricasRendimiento = [
    { label: 'Tasa de Conversión', value: '23.5%' },
    { label: 'Tiempo Prom. de Venta', value: '15 min' },
    { label: 'Satisfacción Cliente', value: '4.8/5' },
];

const Reportes = () => {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ventasResumen, setVentasResumen] = useState(null);
    const [ventasPorMes, setVentasPorMes] = useState([]);
    const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const [resVentasResumen, resVentasMes, resVentasCat, resVentas, resProductos, resUsuarios] = await Promise.all([
                    axios.get('http://localhost:5001/api/ventas/resumen', { headers }),
                    axios.get('http://localhost:5001/api/ventas/por-mes', { headers }),
                    axios.get('http://localhost:5001/api/ventas/por-categoria', { headers }),
                    axios.get('http://localhost:5001/api/ventas', { headers }),
                    axios.get('http://localhost:5001/api/products', { headers }),
                    axios.get('http://localhost:5001/api/users', { headers })
                ]);
                setVentasResumen(resVentasResumen.data.data);
                setVentasPorMes(resVentasMes.data.data);
                setVentasPorCategoria(resVentasCat.data);
                setVentas(resVentas.data.data);
                setProductos(resProductos.data.data);
                setUsuarios(resUsuarios.data.data);
            } catch (err) {
                setError('Error al cargar los datos de reportes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Typography>Cargando datos de reportes...</Typography></Box>;
    }
    if (error) {
        return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;
    }

    // --- DATOS REALES PARA LA PESTAÑA VENTAS ---
    // Cards de resumen
    const resumenVentas = [
        {
            title: 'Ingresos del Mes',
            value: ventasPorMes.length > 0 ? ventasPorMes[ventasPorMes.length - 1].totalIngresos : 0,
            icon: <TrendingUpIcon fontSize="large" color="primary" />,
            subtitle: ventasPorMes.length > 1 ? `${(((ventasPorMes[ventasPorMes.length - 1].totalIngresos - ventasPorMes[ventasPorMes.length - 2].totalIngresos) / ventasPorMes[ventasPorMes.length - 2].totalIngresos) * 100).toFixed(1)}% vs mes anterior` : '',
            color: '#1976d2',
            bg: '#e3f2fd',
            prefix: 'S/'
        },
        {
            title: 'Órdenes Procesadas',
            value: ventasPorMes.length > 0 ? ventasPorMes[ventasPorMes.length - 1].totalVentas : 0,
            icon: <ShoppingCartIcon fontSize="large" color="success" />,
            subtitle: ventasPorMes.length > 1 ? `${(((ventasPorMes[ventasPorMes.length - 1].totalVentas - ventasPorMes[ventasPorMes.length - 2].totalVentas) / ventasPorMes[ventasPorMes.length - 2].totalVentas) * 100).toFixed(1)}% este mes` : '',
            color: '#43a047',
            bg: '#e8f5e9',
            prefix: ''
        },
        {
            title: 'Nuevos Clientes',
            value: usuarios.length,
            icon: <PeopleIcon fontSize="large" color="info" />,
            subtitle: '',
            color: '#0288d1',
            bg: '#e1f5fe',
            prefix: ''
        },
        {
            title: 'Ticket Promedio',
            value: ventasResumen?.promedio || 0,
            icon: <ReceiptIcon fontSize="large" color="warning" />,
            subtitle: '',
            color: '#fbc02d',
            bg: '#fffde7',
            prefix: 'S/'
        }
    ];

    // Evolución de ventas (gráfico de área)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const dataVentas = ventasPorMes.map(v => ({
        mes: meses[(v._id.mes - 1)],
        ventas: v.totalIngresos
    }));

    // Ventas por hora (gráfico de línea)
    const ventasPorHora = Array.from({ length: 12 }, (_, i) => {
        const hora = 8 + i;
        const label = `${hora.toString().padStart(2, '0')}:00`;
        const ventasEnHora = ventas.filter(v => {
            const h = new Date(v.fecha).getHours();
            return h === hora;
        });
        return {
            hora: label,
            ventas: ventasEnHora.reduce((acc, v) => acc + v.total, 0)
        };
    });

    // Ventas por categoría (gráfico de pastel)
    const dataPie = ventasPorCategoria.map(cat => ({ name: cat.categoria, value: cat.totalVentas }));

    // --- DATOS REALES PARA LA PESTAÑA PRODUCTOS ---
    // Calcular productos más vendidos
    const productosVendidos = {};
    ventas.forEach(v => {
        v.productos.forEach(item => {
            if (!productosVendidos[item.producto]) {
                productosVendidos[item.producto] = { cantidad: 0, total: 0, precioUnidad: item.precio };
            }
            productosVendidos[item.producto].cantidad += item.cantidad;
            productosVendidos[item.producto].total += item.cantidad * item.precio;
        });
    });
    // Convertir a array y ordenar por cantidad vendida
    const productosMasVendidos = Object.entries(productosVendidos)
        .map(([nombre, data]) => ({ nombre, ...data }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);
    const dataRendimiento = productosMasVendidos.map(p => ({ nombre: p.nombre, cantidad: p.cantidad }));

    // --- DATOS REALES PARA LA PESTAÑA CLIENTES ---
    const totalClientes = usuarios.length;
    const clientesActivos = usuarios.filter(u => u.activo !== false).length;
    // Tasa de retención: porcentaje de clientes activos sobre el total
    const tasaRetencion = totalClientes > 0 ? ((clientesActivos / totalClientes) * 100).toFixed(1) + '%' : '0%';
    const resumenClientes = [
        { label: 'Total Clientes', value: totalClientes, color: '#1976d2' },
        { label: 'Clientes Activos', value: clientesActivos, color: '#43a047' },
        { label: 'Tasa de Retención', value: tasaRetencion, color: '#ff9800' },
    ];

    // --- DATOS REALES PARA LA PESTAÑA RENDIMIENTO ---
    // Vendedores top por monto total
    const vendedoresTop = usuarios
        .filter(u => u.rol === 'vendedor')
        .map(u => ({ nombre: u.nombre, monto: u.montoTotal || 0 }))
        .sort((a, b) => b.monto - a.monto)
        .slice(0, 3)
        .map((v, idx) => ({
            ...v,
            color: idx === 0 ? '#b2f2bb' : idx === 1 ? '#a5d8ff' : '#ffe066'
        }));
    // Métricas de rendimiento (mock calculado)
    // Tasa de conversión: ventas/usuarios
    const tasaConversion = usuarios.length > 0 ? ((ventas.length / usuarios.length) * 100).toFixed(1) + '%' : '0%';
    // Tiempo promedio de venta: simulado (no hay campo en ventas)
    const tiempoPromVenta = '15 min';
    // Satisfacción cliente: simulado (no hay campo en usuarios)
    const satisfaccionCliente = '4.8/5';
    const metricasRendimiento = [
        { label: 'Tasa de Conversión', value: tasaConversion },
        { label: 'Tiempo Prom. de Venta', value: tiempoPromVenta },
        { label: 'Satisfacción Cliente', value: satisfaccionCliente },
    ];

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, width: '100%', maxWidth: 1600, mx: 'auto' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Reportes y Análisis
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Análisis detallado del rendimiento del negocio
            </Typography>
            {/* Cards de resumen */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {resumenVentas.map((item, idx) => (
                    <Grid item xs={12} md={3} key={item.title}>
                        <Paper elevation={2} sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
                            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Avatar sx={{
                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : item.bg,
                                color: item.color,
                                width: 56,
                                height: 56
                            }}>
                                {item.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>{item.title}</Typography>
                                <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>{item.prefix}{item.value.toLocaleString('es-PE', { minimumFractionDigits: item.title === 'Ticket Promedio' ? 2 : 0 })}</Typography>
                                <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {/* Filtros y acciones */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    {tabs.map((t, i) => <Tab key={t.label} label={t.label} />)}
                </Tabs>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<CalendarMonthIcon />}>Periodo</Button>
                    <Button variant="outlined" startIcon={<FilterListIcon />}>Filtros</Button>
                    <Button variant="contained" color="primary" startIcon={<FileDownloadIcon />}>Exportar</Button>
                </Stack>
            </Stack>
            {/* Contenido dinámico según tab */}
            {tab === 0 && (
                <>
                    {/* Gráfica principal */}
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Evolución de Ventas</Typography>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={dataVentas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="ventas" stroke="#1976d2" fillOpacity={1} fill="url(#colorVentas)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                    {/* Gráficas secundarias */}
                    <Grid container spacing={2} sx={{ flexWrap: 'nowrap' }}>
                        <Grid item xs={12} md sx={{ flexBasis: { md: '70%' }, maxWidth: { md: '70%' }, display: 'flex' }}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 320, width: '100%' }}>
                                <Typography variant="h6" gutterBottom>Ventas por Hora</Typography>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={ventasPorHora} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hora" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="ventas" stroke="#1976d2" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md sx={{ flexBasis: { md: '30%' }, maxWidth: { md: '30%' }, display: 'flex' }}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 320, width: '100%' }}>
                                <Typography variant="h6" gutterBottom>Ventas por Categoría</Typography>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={dataPie}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {dataPie.map((entry, index) => (
                                                <Cell key={`cell-${entry.name}`} fill={coloresPie[index % coloresPie.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
            {tab === 1 && (
                <>
                    {/* Productos más vendidos */}
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Productos Más Vendidos</Typography>
                        <Grid container spacing={2}>
                            {productosMasVendidos.map((prod, idx) => (
                                <Grid item xs={12} key={prod.nombre}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: idx < 3 ? (theme.palette.mode === 'dark' ? '#23272f' : '#f5faff') : 'transparent', borderRadius: 2, p: 2, mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#cd7f32' : '#e0e0e0', color: '#fff', width: 36, height: 36, fontWeight: 700 }}>{idx + 1}</Avatar>
                                            <Box>
                                                <Typography fontWeight={700} sx={{ color: idx < 3 && theme.palette.mode === 'dark' ? '#fff' : 'inherit' }}>{prod.nombre}</Typography>
                                                <Typography variant="body2" color="text.secondary">{prod.cantidad} unidades vendidas</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography fontWeight={700} color="primary">S/ {prod.total.toLocaleString('es-PE')}</Typography>
                                            <Typography variant="body2" color="text.secondary">S/ {prod.precioUnidad.toLocaleString('es-PE', { minimumFractionDigits: 2 })} por unidad</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                    {/* Gráfico de barras de rendimiento de productos */}
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Rendimiento de Productos</Typography>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={dataRendimiento} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nombre" angle={-25} textAnchor="end" interval={0} height={60} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="cantidad" fill="#1976d2" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </>
            )}
            {tab === 2 && (
                <>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Análisis de Clientes</Typography>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            {resumenClientes.map((item, idx) => (
                                <Grid item xs={12} md={4} key={item.label}>
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4" fontWeight={700} color={item.color}>{item.value}</Typography>
                                        <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </>
            )}
            {tab === 3 && (
                <>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Rendimiento del Equipo</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Vendedores Top</Typography>
                                {vendedoresTop.map((v, idx) => (
                                    <Box key={v.nombre} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: v.color, mr: 2 }} />
                                        <Typography sx={{ flex: 1 }}>{v.nombre}</Typography>
                                        <Typography fontWeight={700} color="primary">${v.monto.toLocaleString('en-US')}</Typography>
                                    </Box>
                                ))}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Métricas de Rendimiento</Typography>
                                {metricasRendimiento.map((m) => (
                                    <Box key={m.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography color="text.secondary">{m.label}</Typography>
                                        <Typography fontWeight={700}>{m.value}</Typography>
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default Reportes; 