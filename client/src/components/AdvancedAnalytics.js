import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    Chip,
    IconButton,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    MoreVert,
    Star,
    StarBorder
} from '@mui/icons-material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const AdvancedAnalytics = () => {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('week');
    const [selectedMetric, setSelectedMetric] = useState('sales');

    // Datos simulados para demostración
    const salesData = [
        { day: 'Lun', ventas: 1200, ingresos: 2400, clientes: 45 },
        { day: 'Mar', ventas: 1800, ingresos: 3600, clientes: 62 },
        { day: 'Mié', ventas: 1500, ingresos: 3000, clientes: 53 },
        { day: 'Jue', ventas: 2200, ingresos: 4400, clientes: 78 },
        { day: 'Vie', ventas: 2800, ingresos: 5600, clientes: 95 },
        { day: 'Sáb', ventas: 3200, ingresos: 6400, clientes: 112 },
        { day: 'Dom', ventas: 2600, ingresos: 5200, clientes: 88 }
    ];

    const categoryData = [
        { name: 'Bebidas', value: 35, color: '#8884d8' },
        { name: 'Snacks', value: 25, color: '#82ca9d' },
        { name: 'Lácteos', value: 20, color: '#ffc658' },
        { name: 'Otros', value: 20, color: '#ff7300' }
    ];

    const topProducts = [
        { name: 'Red Bull 500ml', sales: 156, growth: 12.5, rating: 4.8 },
        { name: 'Coca Cola 2L', sales: 142, growth: 8.3, rating: 4.6 },
        { name: 'Doritos Nacho', sales: 128, growth: -2.1, rating: 4.4 },
        { name: 'Leche Entera 1L', sales: 115, growth: 15.7, rating: 4.9 },
        { name: 'Pan Integral', sales: 98, growth: 5.2, rating: 4.3 }
    ];

    const performanceMetrics = [
        {
            title: 'Tasa de Conversión',
            value: 68.5,
            target: 75,
            unit: '%',
            trend: 'up',
            change: 2.3
        },
        {
            title: 'Ticket Promedio',
            value: 45.20,
            target: 50,
            unit: 'S/',
            trend: 'up',
            change: 5.8
        },
        {
            title: 'Retención Clientes',
            value: 82.1,
            target: 85,
            unit: '%',
            trend: 'down',
            change: -1.2
        },
        {
            title: 'Satisfacción',
            value: 4.6,
            target: 4.8,
            unit: '/5',
            trend: 'up',
            change: 0.1
        }
    ];

    const getTrendIcon = (trend) => {
        return trend === 'up' ? (
            <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
        ) : (
            <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
        );
    };

    const getProgressColor = (value, target) => {
        const percentage = (value / target) * 100;
        if (percentage >= 90) return 'success';
        if (percentage >= 70) return 'warning';
        return 'error';
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? (
                    <Star key={i} sx={{ fontSize: 16, color: 'warning.main' }} />
                ) : (
                    <StarBorder key={i} sx={{ fontSize: 16, color: 'text.disabled' }} />
                )
            );
        }
        return stars;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Análisis Avanzado
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Métricas detalladas y tendencias del negocio
            </Typography>

            {/* Métricas de Rendimiento */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {performanceMetrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {metric.title}
                                    </Typography>
                                    {getTrendIcon(metric.trend)}
                                </Box>

                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {metric.value}{metric.unit}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color={metric.trend === 'up' ? 'success.main' : 'error.main'}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                    >
                                        {metric.trend === 'up' ? '+' : ''}{metric.change}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        vs mes anterior
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(metric.value / metric.target) * 100}
                                        color={getProgressColor(metric.value, metric.target)}
                                        sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {Math.round((metric.value / metric.target) * 100)}%
                                    </Typography>
                                </Box>

                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    Meta: {metric.target}{metric.unit}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Gráficos */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Gráfico de Ventas */}
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Tendencia de Ventas
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {['week', 'month', 'quarter'].map((range) => (
                                        <Chip
                                            key={range}
                                            label={range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Trimestre'}
                                            variant={timeRange === range ? 'filled' : 'outlined'}
                                            size="small"
                                            onClick={() => setTimeRange(range)}
                                            clickable
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
                                    <YAxis stroke={theme.palette.text.secondary} />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 8
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="ventas"
                                        stroke={theme.palette.primary.main}
                                        fillOpacity={1}
                                        fill="url(#colorVentas)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico de Categorías */}
                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Ventas por Categoría
                            </Typography>

                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            <Box sx={{ mt: 2 }}>
                                {categoryData.map((category, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: category.color,
                                                mr: 1
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                            {category.name}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {category.value}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Productos Top */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Productos Más Vendidos
                    </Typography>

                    <List>
                        {topProducts.map((product, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {index + 1}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={product.name}
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {product.sales} ventas
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {renderStars(product.rating)}
                                                </Box>
                                            </Box>
                                        }
                                    />

                                    <ListItemSecondaryAction>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Chip
                                                label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                                                color={product.growth > 0 ? 'success' : 'error'}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <IconButton size="small">
                                                <MoreVert />
                                            </IconButton>
                                        </Box>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < topProducts.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdvancedAnalytics; 