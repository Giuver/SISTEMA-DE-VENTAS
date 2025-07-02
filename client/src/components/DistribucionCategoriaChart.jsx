import { useEffect, useState } from 'react';
import ventaService from '../services/ventaService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgress, Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const COLORS = ['#1976d2', '#43a047', '#e53935', '#fb8c00', '#8e24aa', '#00acc1'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 12, borderRadius: 8 }}>
                <strong>{data.name}</strong>
                <div style={{ marginTop: 4 }}>Cantidad: <b>{data.value}</b></div>
                <div style={{ color: '#666' }}>Porcentaje: <b>{data.porcentaje}%</b></div>
            </div>
        );
    }
    return null;
};

const DistribucionCategoriaChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const ventas = await ventaService.getVentasPorCategoria();
                if (!ventas || ventas.length === 0) {
                    setData([]);
                    return;
                }
                const total = ventas.reduce((sum, v) => sum + v.totalVentas, 0);
                const datos = ventas.map(v => ({
                    name: v._id.categoria,
                    value: v.totalVentas,
                    porcentaje: ((v.totalVentas / total) * 100).toFixed(1)
                }));
                setData(datos);
            } catch (e) {
                setError('Error al cargar los datos');
                console.error('Error:', e);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height={300}
                bgcolor="background.paper"
                borderRadius={2}
                p={3}
            >
                <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                    No hay datos disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    No se encontraron categorías para mostrar en el gráfico
                </Typography>
            </Box>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                        <span style={{ color: '#666' }}>{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DistribucionCategoriaChart; 