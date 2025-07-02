import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, Paper, Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Add, Search, Edit, Delete, CheckCircle, Cancel, Person, SupervisorAccount, AdminPanelSettings } from '@mui/icons-material';
import userService from '../services/userService';
import { useTheme } from '@mui/material/styles';

const roles = [
    { value: 'administrador', label: 'Administrador', icon: <AdminPanelSettings fontSize="small" /> },
    { value: 'vendedor', label: 'Vendedor', icon: <Person fontSize="small" /> },
    { value: 'supervisor', label: 'Supervisor', icon: <SupervisorAccount fontSize="small" /> }
];
const estados = [
    { value: true, label: 'Activo', color: 'success' },
    { value: false, label: 'Inactivo', color: 'error' }
];

const resumenDefault = {
    total: 0,
    activos: 0,
    ventas: 0,
    promedio: 0
};

const UsuarioModal = ({ open, onClose, onSave, initialData }) => {
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'vendedor', activo: true });
    const [error, setError] = useState('');
    useEffect(() => {
        if (initialData) setForm({ ...initialData, password: '' });
        else setForm({ nombre: '', email: '', password: '', rol: 'vendedor', activo: true });
        setError('');
    }, [open, initialData]);
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = e => {
        e.preventDefault();
        if (!form.nombre || !form.email || (!initialData && !form.password)) {
            setError('Nombre, email y contraseña son obligatorios');
            return;
        }
        setError('');
        onSave(form);
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required type="email" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Rol</InputLabel>
                                <Select name="rol" value={form.rol} label="Rol" onChange={handleChange}>
                                    {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.icon} {r.label}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Estado</InputLabel>
                                <Select name="activo" value={form.activo} label="Estado" onChange={e => setForm({ ...form, activo: e.target.value === 'true' })}>
                                    <MenuItem value={'true'}>Activo</MenuItem>
                                    <MenuItem value={'false'}>Inactivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {!initialData && (
                            <Grid item xs={12} md={6}>
                                <TextField label="Contraseña" name="password" value={form.password} onChange={handleChange} fullWidth required type="password" />
                            </Grid>
                        )}
                    </Grid>
                    {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">{initialData ? 'Guardar' : 'Crear'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [resumen, setResumen] = useState(resumenDefault);
    const [busqueda, setBusqueda] = useState('');
    const [rolFiltro, setRolFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
    const theme = useTheme();

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await userService.getAll();
            setUsuarios(data);
            calcularResumen(data);
        } catch {
            setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' });
        }
    };

    const calcularResumen = (data) => {
        const total = data.length;
        const activos = data.filter(u => u.activo).length;
        const ventas = data.reduce((acc, u) => acc + (u.ventas || 0), 0);
        const promedio = activos ? data.reduce((acc, u) => acc + (u.montoTotal || 0), 0) / activos : 0;
        setResumen({ total, activos, ventas, promedio });
    };

    const handleBuscar = e => setBusqueda(e.target.value);
    const handleRolFiltro = e => setRolFiltro(e.target.value);
    const handleEstadoFiltro = e => setEstadoFiltro(e.target.value);
    const handleLimpiarFiltros = () => {
        setBusqueda('');
        setRolFiltro('');
        setEstadoFiltro('');
    };

    const usuariosFiltrados = usuarios.filter(u =>
        (rolFiltro ? u.rol === rolFiltro : true) &&
        (estadoFiltro ? String(u.activo) === estadoFiltro : true) &&
        (
            u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.email.toLowerCase().includes(busqueda.toLowerCase())
        )
    );

    // Ranking de vendedores
    const ranking = usuarios
        .filter(u => u.rol === 'vendedor')
        .sort((a, b) => (b.ventas || 0) - (a.ventas || 0))
        .slice(0, 3);

    const handleOpenAdd = () => {
        setModalData(null);
        setModalOpen(true);
    };
    const handleOpenEdit = (usuario) => {
        setModalData(usuario);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const handleSaveUser = async (data) => {
        try {
            if (modalData) {
                await userService.update(modalData._id, data);
                setSnackbar({ open: true, message: 'Usuario actualizado', severity: 'success' });
            } else {
                await userService.create(data);
                setSnackbar({ open: true, message: 'Usuario creado', severity: 'success' });
            }
            setModalOpen(false);
            cargarUsuarios();
        } catch {
            setSnackbar({ open: true, message: 'Error al guardar usuario', severity: 'error' });
        }
    };
    const handleOpenDelete = (id) => {
        setDeleteDialog({ open: true, id });
    };
    const handleCloseDelete = () => {
        setDeleteDialog({ open: false, id: null });
    };
    const handleDeleteUser = async () => {
        try {
            await userService.remove(deleteDialog.id);
            setSnackbar({ open: true, message: 'Usuario eliminado', severity: 'success' });
            setDeleteDialog({ open: false, id: null });
            cargarUsuarios();
        } catch {
            setSnackbar({ open: true, message: 'Error al eliminar usuario', severity: 'error' });
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Gestión de Usuarios
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Administra usuarios y sus permisos
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Total Usuarios</Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>{resumen.total}</Typography>
                        <Typography variant="caption" color="text.secondary">usuarios registrados</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Usuarios Activos</Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>{resumen.activos}</Typography>
                        <Typography variant="caption" color="text.secondary">conectados recientemente</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Ventas Totales</Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>${resumen.ventas.toFixed(2)}</Typography>
                        <Typography variant="caption" color="text.secondary">transacciones</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Promedio por Usuario</Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>${resumen.promedio.toFixed(2)}</Typography>
                        <Typography variant="caption" color="text.secondary">por vendedor</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por nombre, email o ID..."
                            value={busqueda}
                            onChange={handleBuscar}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Rol</InputLabel>
                            <Select value={rolFiltro} label="Rol" onChange={handleRolFiltro}>
                                <MenuItem value="">Todos los roles</MenuItem>
                                {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select value={estadoFiltro} label="Estado" onChange={handleEstadoFiltro}>
                                <MenuItem value="">Todos los estados</MenuItem>
                                <MenuItem value={'true'}>Activo</MenuItem>
                                <MenuItem value={'false'}>Inactivo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="outlined" color="secondary" onClick={handleLimpiarFiltros}>Limpiar filtros</Button>
                    </Grid>
                    <Grid item xs={12} md={3} textAlign={{ xs: 'left', md: 'right' }}>
                        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ minWidth: 180 }}>
                            Crear Usuario
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Lista de Usuarios
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Último Acceso</TableCell>
                                <TableCell>Ventas</TableCell>
                                <TableCell>Monto Total</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuariosFiltrados.map(u => (
                                <TableRow key={u._id}>
                                    <TableCell>
                                        <Typography fontWeight={600}>{u.nombre}</Typography>
                                        <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={roles.find(r => r.value === u.rol)?.label || u.rol} color={u.rol === 'administrador' ? 'primary' : u.rol === 'supervisor' ? 'secondary' : 'default'} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={u.activo ? 'Activo' : 'Inactivo'} color={u.activo ? 'success' : 'error'} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        {u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleString() : '-'}
                                    </TableCell>
                                    <TableCell>{u.ventas || 0}</TableCell>
                                    <TableCell>${u.montoTotal?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" size="small" onClick={() => handleOpenEdit(u)}><Edit /></IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleOpenDelete(u._id)}><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Rendimiento de Vendedores</Typography>
                {ranking.map((u, i) => (
                    <Box key={u._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Chip label={i + 1} color={i === 0 ? 'warning' : i === 1 ? 'info' : 'default'} />
                        <Typography fontWeight={600}>{u.nombre}</Typography>
                        <Typography variant="caption" color="text.secondary">{u.ventas} ventas</Typography>
                        <Typography variant="body2" sx={{ ml: 'auto' }}>${u.montoTotal?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                ))}
            </Paper>
            <UsuarioModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUser}
                initialData={modalData}
            />
            <Dialog open={deleteDialog.open} onClose={handleCloseDelete}>
                <DialogTitle>¿Seguro que deseas eliminar este usuario?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="secondary">Cancelar</Button>
                    <Button onClick={handleDeleteUser} color="error" variant="contained">Eliminar</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default Usuarios; 