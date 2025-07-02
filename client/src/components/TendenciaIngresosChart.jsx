import { useEffect, useState } from 'react';
import ventaService from '../services/ventaService';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgress, Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 12, borderRadius: 8 }}>
                <strong>{label}</strong>
                <div style={{ color: '#1976d2', marginTop: 4 }}>Ingresos: <b>${payload[0].value.toLocaleString()}</b></div>
            </div>
        );
    }
    return null;
};

const TendenciaIngresosChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const ventas = await ventaService.getVentasPorMes();
                if (!ventas || ventas.length === 0) {
                    setData([]);
                    return;
                }
                const datos = ventas.map(v => ({
                    name: `${meses[v._id.mes - 1]} ${v._id.anio}`,
                    ingresos: v.totalIngresos
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
                    No se encontraron ingresos para mostrar en el gráfico
                </Typography>
            </Box>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#1976d2"
                    name="Ingresos"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TendenciaIngresosChart; 