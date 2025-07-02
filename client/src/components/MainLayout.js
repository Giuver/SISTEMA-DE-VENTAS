import React from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CategoryIcon from '@mui/icons-material/Category';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import authService from '../services/authService';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import Divider from '@mui/material/Divider';
import logo from '../assets/sellsync-logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 220;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/ventas' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios', admin: true },
    { text: 'Inventario', icon: <InventoryIcon />, path: '/inventario' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
    { text: 'Categorías', icon: <CategoryIcon />, path: '/categorias', admin: true },
];

const SidebarPaper = styled('div')(({ theme, collapsed }) => ({
    height: '100%',
    width: collapsed ? 64 : drawerWidth,
    background: theme.palette.mode === 'dark'
        ? 'rgba(24, 36, 58, 0.92)'
        : 'rgba(255, 255, 255, 0.85)',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 32px rgba(10,26,47,0.25), 0 1.5px 0 #3a8dde44'
        : '0 8px 32px rgba(22,120,250,0.10)',
    borderRadius: '32px',
    border: theme.palette.mode === 'dark' ? '1.5px solid #232e43' : '1.5px solid #e3eaf5',
    margin: 12,
    marginLeft: 8,
    marginTop: 16,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
}));

const MainLayout = ({ children, darkMode, setDarkMode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(false);
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleCollapseToggle = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const drawer = (
        <SidebarPaper collapsed={collapsed}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: collapsed ? 1.5 : 3, position: 'relative' }}>
                <img src={logo} alt="SellSync Logo" style={{ width: collapsed ? 38 : 56, height: collapsed ? 38 : 56, marginBottom: collapsed ? 6 : 10, borderRadius: 14, boxShadow: '0 4px 24px rgba(22, 120, 250, 0.13)', background: 'white', objectFit: 'contain', transition: 'all 0.2s' }} />
                <IconButton onClick={handleCollapseToggle} size="small" sx={{ position: 'absolute', top: 8, right: 8, display: { xs: 'none', sm: 'block' }, color: theme.palette.mode === 'dark' ? '#b0c4de' : '#1976d2' }}>
                    <MenuIcon />
                </IconButton>
                {!collapsed && (
                    <>
                        <Typography variant="h6" fontWeight={800} color={theme.palette.mode === 'dark' ? '#3a8dde' : 'primary'} sx={{ letterSpacing: 1, mb: 0.5 }}>
                            SellSync
                        </Typography>
                        <Typography variant="body2" color={theme.palette.mode === 'dark' ? '#b0c4de' : 'text.secondary'} sx={{ mb: 1 }}>
                            Panel Admin
                        </Typography>
                    </>
                )}
            </Box>
            <Divider sx={{ mb: 1, borderColor: theme.palette.mode === 'dark' ? '#232e43' : '#e3eaf5' }} />
            {!collapsed && (
                <Typography variant="caption" color={theme.palette.mode === 'dark' ? '#b0c4de' : 'text.secondary'} sx={{ pl: 3, mb: 1, fontWeight: 700, letterSpacing: 1 }}>
                    NAVEGACIÓN PRINCIPAL
                </Typography>
            )}
            <List sx={{ flex: 1, gap: collapsed ? 1.5 : 0 }}>
                {menuItems.map((item) => {
                    if (item.admin && user?.usuario?.rol !== 'administrador') return null;
                    const isActive = location.pathname === item.path;
                    return (
                        <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
                            <ListItem
                                button
                                selected={isActive}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: collapsed ? 'column' : 'row',
                                    px: collapsed ? 0 : 2.5,
                                    py: collapsed ? 1.2 : 1.5,
                                    borderRadius: 2.5,
                                    mb: 0.5,
                                    minHeight: collapsed ? 56 : 48,
                                    background: isActive
                                        ? (theme.palette.mode === 'dark' ? 'linear-gradient(90deg, #123a6d 60%, #1678fa 100%)' : 'linear-gradient(90deg, #e3f2fd 60%, #b6d6ff 100%)')
                                        : 'none',
                                    color: isActive
                                        ? (theme.palette.mode === 'dark' ? '#fff' : '#1976d2')
                                        : (theme.palette.mode === 'dark' ? '#b0c4de' : '#222'),
                                    boxShadow: isActive ? (theme.palette.mode === 'dark' ? '0 2px 8px #3a8dde33' : '0 2px 8px #1976d233') : 'none',
                                    fontWeight: isActive ? 700 : 500,
                                    transition: 'all 0.18s',
                                    '&:hover': {
                                        background: theme.palette.mode === 'dark' ? 'rgba(26, 60, 110, 0.25)' : 'rgba(22, 120, 250, 0.10)',
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
                                        transform: 'scale(1.06)'
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, mb: collapsed ? 0.5 : 0, mr: collapsed ? 0 : 2, justifyContent: 'center', color: isActive ? (theme.palette.mode === 'dark' ? '#fff' : '#1976d2') : (theme.palette.mode === 'dark' ? '#3a8dde' : '#1976d2'), fontSize: collapsed ? 30 : 24, transition: 'font-size 0.2s' }}>
                                    {item.icon}
                                </ListItemIcon>
                                {!collapsed && <ListItemText primary={item.text} sx={{ fontWeight: isActive ? 700 : 500 }} />}
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>
            <Box sx={{ pb: 2, px: collapsed ? 0 : 2 }}>
                <Divider sx={{ mb: 1, borderColor: theme.palette.mode === 'dark' ? '#232e43' : '#e3eaf5' }} />
                <List sx={{ gap: collapsed ? 1.5 : 0 }}>
                    <Tooltip title={collapsed ? (darkMode ? 'Modo claro' : 'Modo oscuro') : ''} placement="right">
                        <ListItem button onClick={() => setDarkMode(!darkMode)} sx={{ justifyContent: 'center', borderRadius: 2.5, mb: 1, color: theme.palette.mode === 'dark' ? '#b0c4de' : '#1976d2', py: collapsed ? 1.2 : 1, '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(26, 60, 110, 0.18)' : 'rgba(22, 120, 250, 0.10)' } }}>
                            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: theme.palette.mode === 'dark' ? '#3a8dde' : '#1976d2', fontSize: collapsed ? 30 : 24 }}>{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}</ListItemIcon>
                            {!collapsed && <ListItemText primary={darkMode ? 'Modo claro' : 'Modo oscuro'} />}
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={collapsed ? 'Configuración' : ''} placement="right">
                        <ListItem button sx={{ justifyContent: 'center', borderRadius: 2.5, color: theme.palette.mode === 'dark' ? '#b0c4de' : '#1976d2', py: collapsed ? 1.2 : 1, '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(26, 60, 110, 0.18)' : 'rgba(22, 120, 250, 0.10)' } }}>
                            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: theme.palette.mode === 'dark' ? '#3a8dde' : '#1976d2', fontSize: collapsed ? 30 : 24 }}><SettingsIcon /></ListItemIcon>
                            {!collapsed && <ListItemText primary="Configuración" />}
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={collapsed ? 'Cerrar sesión' : ''} placement="right">
                        <ListItem button onClick={handleLogout} sx={{ justifyContent: 'center', borderRadius: 2.5, mt: 1, color: theme.palette.mode === 'dark' ? '#d72638' : '#d72638', py: collapsed ? 1.2 : 1, '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(215,38,56,0.13)' : 'rgba(215,38,56,0.10)' } }}>
                            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: '#d72638', fontSize: collapsed ? 30 : 24 }}><LogoutIcon /></ListItemIcon>
                            {!collapsed && <ListItemText primary="Cerrar sesión" />}
                        </ListItem>
                    </Tooltip>
                </List>
            </Box>
        </SidebarPaper>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Box
                component="nav"
                sx={{ width: { sm: collapsed ? 64 : drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="sidebar"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: collapsed ? 64 : drawerWidth,
                            transition: 'width 0.2s',
                            overflowX: 'hidden',
                            background: theme.palette.mode === 'dark' ? '#18243a' : '#fff',
                            color: theme.palette.mode === 'dark' ? '#b0c4de' : '#222',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${collapsed ? 64 : drawerWidth}px)` }, transition: 'width 0.2s, margin 0.2s' }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout; 