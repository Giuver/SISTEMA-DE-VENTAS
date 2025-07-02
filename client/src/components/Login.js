import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Fade,
    Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import authService from '../services/authService';
import logo from '../assets/sellsync-logo.png';
import '../Login.css';

const BlueBackground = styled(Box)(({ theme, darkMode }) => ({
    minHeight: '100vh',
    width: '100vw',
    background: darkMode
        ? 'linear-gradient(135deg, #0a1a2f 0%, #123a6d 100%)'
        : 'linear-gradient(135deg, #1678fa 0%, #0a357a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
}));

const Sphere = styled('div')(({ size, top, left, blur, darkMode }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: darkMode
        ? 'radial-gradient(circle at 60% 40%, #3a8dde 70%, #1678fa 100%)'
        : 'radial-gradient(circle at 60% 40%, #2196f3 60%, #1678fa 100%)',
    filter: `blur(${blur}) brightness(${darkMode ? 1.25 : 1})`,
    top: top,
    left: left,
    opacity: darkMode ? 0.38 : 0.22,
    zIndex: 1,
    boxShadow: darkMode
        ? '0 0 80px 20px #3a8dde55, 0 0 120px 40px #2196f355'
        : 'none',
    animation: 'floatSphere 12s ease-in-out infinite',
    '@keyframes floatSphere': {
        '0%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-30px)' },
        '100%': { transform: 'translateY(0px)' }
    }
}));

const LoginCard = styled(Paper)(({ theme, darkMode }) => ({
    width: '100%',
    maxWidth: 900,
    minHeight: 480,
    display: 'flex',
    borderRadius: 24,
    boxShadow: darkMode
        ? '0 12px 40px rgba(10, 26, 47, 0.25)'
        : '0 12px 40px rgba(22, 120, 250, 0.10)',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
    background: 'none',
}));

const LeftPanel = styled(Box)(({ theme, darkMode }) => ({
    flex: 1.1,
    background: darkMode
        ? 'linear-gradient(135deg, #1e2a4a 0%, #123a6d 100%)'
        : 'linear-gradient(135deg, #2196f3 0%, #1678fa 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 4),
    position: 'relative',
    zIndex: 2,
}));

const RightPanel = styled(Box)(({ theme, darkMode }) => ({
    flex: 1,
    background: darkMode ? '#18243a' : '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 4),
    zIndex: 2,
}));

const LogoImg = styled('img')(() => ({
    width: 80,
    height: 80,
    marginBottom: 24,
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(22, 120, 250, 0.15)',
    background: 'white',
    objectFit: 'contain',
}));

const StyledTextField = styled(TextField)(({ theme, darkMode }) => ({
    marginBottom: theme.spacing(2.5),
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        backgroundColor: darkMode ? '#232e43' : '#f5f8fa',
        color: darkMode ? '#fff' : '#222',
        '&:hover': {
            backgroundColor: darkMode ? '#232e43' : '#e3f0fa'
        },
        '&.Mui-focused': {
            backgroundColor: darkMode ? '#232e43' : '#e3f0fa',
            boxShadow: darkMode ? '0 0 0 2px #3a8dde55' : '0 0 0 2px #1678fa22',
            color: darkMode ? '#fff' : '#222',
        }
    },
    '& .MuiInputLabel-root': {
        color: darkMode ? '#b0c4de' : theme.palette.text.secondary
    },
    '& .MuiInputBase-input': {
        color: darkMode ? '#fff' : '#222',
    }
}));

const LoginButton = styled(Button)(({ theme, darkMode }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    background: darkMode
        ? 'linear-gradient(90deg, #3a8dde 0%, #1678fa 100%)'
        : 'linear-gradient(90deg, #1678fa 0%, #0a357a 100%)',
    color: 'white',
    boxShadow: darkMode
        ? '0 4px 16px rgba(58, 141, 222, 0.10)'
        : '0 4px 16px rgba(22, 120, 250, 0.10)',
    '&:hover': {
        background: darkMode
            ? 'linear-gradient(90deg, #1678fa 0%, #3a8dde 100%)'
            : 'linear-gradient(90deg, #0a357a 0%, #1678fa 100%)',
        color: 'white',
        boxShadow: darkMode
            ? '0 8px 24px rgba(58, 141, 222, 0.15)'
            : '0 8px 24px rgba(22, 120, 250, 0.15)',
        transform: 'translateY(-2px)'
    },
    transition: 'all 0.3s ease'
}));

const Login = ({ darkMode }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            }
        } catch (err) {
            setError(err.mensaje || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <BlueBackground darkMode={darkMode}>
            {/* Esferas animadas de fondo */}
            <Sphere size="320px" top="-80px" left="-100px" blur="0px" darkMode={darkMode} />
            <Sphere size="180px" top="60%" left="-60px" blur="0px" darkMode={darkMode} />
            <Sphere size="140px" top="80%" left="70%" blur="8px" darkMode={darkMode} />
            <Sphere size="220px" top="-60px" left="70%" blur="0px" darkMode={darkMode} />
            <Sphere size="100px" top="70%" left="90%" blur="12px" darkMode={darkMode} />
            <Container maxWidth="md" sx={{ zIndex: 2 }}>
                <LoginCard elevation={0} darkMode={darkMode}>
                    {/* Panel izquierdo: Bienvenida */}
                    <LeftPanel darkMode={darkMode}>
                        <LogoImg src={logo} alt="Logo SellSync" />
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: 1 }}>
                            ¡Bienvenido!
                        </Typography>
                        <Typography variant="h6" fontWeight={500} sx={{ mb: 2, letterSpacing: 1 }}>
                            SellSync
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mb: 2, maxWidth: 300, opacity: 0.9 }}>
                            Impulsando tu negocio al siguiente nivel
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 13, maxWidth: 320 }}>
                            Gestiona tus ventas, inventario y reportes de manera profesional y eficiente.
                        </Typography>
                    </LeftPanel>
                    {/* Panel derecho: Formulario */}
                    <RightPanel darkMode={darkMode}>
                        <Fade in timeout={800}>
                            <Box sx={{ width: '100%', maxWidth: 340 }}>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: darkMode ? '#fff' : '#0a357a' }}>
                                    Iniciar sesión
                                </Typography>
                                {error && (
                                    <Fade in>
                                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                            {error}
                                        </Alert>
                                    </Fade>
                                )}
                                <Box component="form" onSubmit={handleSubmit}>
                                    <StyledTextField
                                        variant="outlined"
                                        fullWidth
                                        required
                                        id="email"
                                        label="Correo Electrónico"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        darkMode={darkMode}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <StyledTextField
                                        variant="outlined"
                                        fullWidth
                                        required
                                        name="password"
                                        label="Contraseña"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        darkMode={darkMode}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleTogglePassword}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <LoginButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loading}
                                        size="large"
                                        darkMode={darkMode}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Iniciar Sesión'
                                        )}
                                    </LoginButton>
                                </Box>
                            </Box>
                        </Fade>
                    </RightPanel>
                </LoginCard>
            </Container>
        </BlueBackground>
    );
};

export default Login; 