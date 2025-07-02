import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useTheme, styled } from '@mui/material/styles';
import AnimatedBackground from './AnimatedBackground';

const LoginContainer = styled(Container)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    position: 'relative',
    zIndex: 1
}));

const LoginCard = styled(Card)(({ theme }) => ({
    borderRadius: 24,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(10px)',
    maxWidth: 400,
    width: '100%',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.2)'
    }
}));

const Login = ({ darkMode }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData.email, formData.password);
            if (response.success) {
                navigate('/dashboard');
            } else {
                setError(response.message || 'Error en el inicio de sesión');
            }
        } catch (err) {
            setError('Error de conexión. Verifique su conexión a internet.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AnimatedBackground>
            <LoginContainer>
                <LoginCard>
                    <CardContent sx={{ p: 4 }}>
                        {/* Logo y título */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                component="img"
                                src="/logo192.png"
                                alt="SellSync Logo"
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    borderRadius: 2,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Typography variant="h4" fontWeight={800} gutterBottom>
                                SellSync
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Sistema de Gestión de Ventas
                            </Typography>
                        </Box>

                        {/* Formulario */}
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                        boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:disabled': {
                                        background: theme.palette.action.disabledBackground,
                                        color: theme.palette.action.disabled,
                                        transform: 'none'
                                    }
                                }}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>

                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                ¿Problemas para acceder? Contacte al administrador
                            </Typography>
                        </Box>
                    </CardContent>
                </LoginCard>
            </LoginContainer>
        </AnimatedBackground>
    );
};

export default Login; 