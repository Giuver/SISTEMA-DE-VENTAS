import { useEffect, useState } from 'react';
import ventaService from '../services/ventaService';
import productService from '../services/productService';
import userService from '../services/userService';
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';

const ResumenCards = () => {
    const [loading, setLoading] = useState(true);
    const [resumen, setResumen] = useState({
        ingresos: 0,
        ventas: 0,
        usuarios: 0,
        usuariosActivos: 0,
        productos: 0,
        variaciones: {
            ingresos: 0,
            ventas: 0,
            usuarios: 0,
            productos: 0
        }
    });
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ventasResumen = await ventaService.getResumen();
                const productosResumen = await productService.getResumen();
                const usuarios = await userService.getAll();
                const usuariosActivos = usuarios.filter(u => u.activo).length;
                setResumen({
                    ingresos: ventasResumen.totalIngresos || 0,
                    ventas: ventasResumen.totalVentas || 0,
                    usuarios: usuarios.length,
                    usuariosActivos,
                    productos: productosResumen.totalProductos || 0,
                    variaciones: {
                        ingresos: ventasResumen.variacionIngresos || 0,
                        ventas: ventasResumen.variacionVentas || 0,
                        usuarios: 0,
                        productos: productosResumen.variacionProductos || 0
                    }
                });
            } catch (e) { }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    const cardData = [
        {
            title: 'Ingresos Totales',
            value: `$${resumen.ingresos.toLocaleString()}`,
            variation: resumen.variaciones.ingresos,
            subtitle: 'vs mes anterior',
            icon: resumen.variaciones.ingresos >= 0 ? <ArrowUpwardIcon color="success" fontSize="small" /> : <ArrowDownwardIcon color="error" fontSize="small" />,
            color: resumen.variaciones.ingresos >= 0 ? 'success.main' : 'error.main'
        },
        {
            title: 'Ventas Realizadas',
            value: resumen.ventas.toLocaleString(),
            variation: resumen.variaciones.ventas,
            subtitle: 'este mes',
            icon: resumen.variaciones.ventas >= 0 ? <ArrowUpwardIcon color="success" fontSize="small" /> : <ArrowDownwardIcon color="error" fontSize="small" />,
            color: resumen.variaciones.ventas >= 0 ? 'success.main' : 'error.main'
        },
        {
            title: 'Usuarios Activos',
            value: resumen.usuariosActivos,
            variation: resumen.usuarios,
            subtitle: 'usuarios registrados',
            icon: <ArrowUpwardIcon color="success" fontSize="small" />, // Siempre positivo
            color: 'success.main'
        },
        {
            title: 'Productos',
            value: resumen.productos.toLocaleString(),
            variation: resumen.variaciones.productos,
            subtitle: 'en inventario',
            icon: resumen.variaciones.productos >= 0 ? <ArrowUpwardIcon color="success" fontSize="small" /> : <ArrowDownwardIcon color="error" fontSize="small" />,
            color: resumen.variaciones.productos >= 0 ? 'success.main' : 'error.main'
        }
    ];

    return (
        <Grid container columns={12} spacing={2} mb={2}>
            {cardData.map((card, idx) => (
                <Grid sx={{ gridColumn: 'span 3' }} key={card.title}>
                    <Card sx={{ minHeight: 120, boxShadow: 2, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }} gutterBottom>
                                {card.title}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="h4" color="primary" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
                                    {card.value}
                                </Typography>
                                <Box display="flex" alignItems="center" color={card.color}>
                                    {card.icon}
                                    <Typography variant="body2" color={card.color} fontWeight={600}>
                                        {card.variation >= 0 ? '+' : ''}{card.variation}%
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {card.subtitle}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ResumenCards; 