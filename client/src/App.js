import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Inventario from './components/Inventario';
import Categorias from './components/Categorias';
import Usuarios from './components/Usuarios';
import authService from './services/authService';
import MainLayout from './components/MainLayout';
import Ventas from './components/Ventas';
import Reportes from './components/Reportes';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const PrivateRoute = ({ children, onlyAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (onlyAdmin && user?.usuario?.rol !== 'administrador') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#181c24' : '#f5f5f5',
        paper: darkMode ? '#23272f' : '#fff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login darkMode={darkMode} />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} >
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <PrivateRoute>
                <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} >
                  <Ventas />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute onlyAdmin={true}>
                <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} >
                  <Usuarios />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <PrivateRoute onlyAdmin={true}>
                <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} >
                  <Inventario />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <PrivateRoute>
                <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} >
                  <Reportes />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <PrivateRoute onlyAdmin={true}>
                <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} >
                  <Categorias />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
