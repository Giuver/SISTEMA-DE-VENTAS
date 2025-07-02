import React, { useState, useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import authService from './services/authService';
import MainLayout from './components/MainLayout';
import { ToastProvider } from './components/ToastNotification';
import { LoadingSpinner } from './components/LazyLoader';
import { createAppTheme } from './theme';

// Lazy loading para componentes pesados
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Inventario = React.lazy(() => import('./components/Inventario'));
const Categorias = React.lazy(() => import('./components/Categorias'));
const Usuarios = React.lazy(() => import('./components/Usuarios'));
const Ventas = React.lazy(() => import('./components/Ventas'));
const Reportes = React.lazy(() => import('./components/Reportes'));
const AdvancedAnalytics = React.lazy(() => import('./components/AdvancedAnalytics'));

const PrivateRoute = ({ children, onlyAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (onlyAdmin && user?.usuario?.rol !== 'administrador') return <Navigate to="/dashboard" />;
  return children;
};

// Componente de carga para lazy loading
const LazyComponent = ({ children }) => (
  <Suspense fallback={<LoadingSpinner message="Cargando módulo..." />}>
    {children}
  </Suspense>
);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPalette, setCurrentPalette] = useState('default');

  const theme = useMemo(() => {
    return createAppTheme(currentPalette, darkMode ? 'dark' : 'light');
  }, [currentPalette, darkMode]);

  const handleThemeChange = (paletteName) => {
    setCurrentPalette(paletteName);
    // Guardar preferencia en localStorage
    localStorage.setItem('themePalette', paletteName);
  };

  const handleModeChange = () => {
    setDarkMode(!darkMode);
    // Guardar preferencia en localStorage
    localStorage.setItem('darkMode', !darkMode);
  };

  // Cargar preferencias guardadas al iniciar
  React.useEffect(() => {
    const savedPalette = localStorage.getItem('themePalette');
    const savedMode = localStorage.getItem('darkMode');

    if (savedPalette) {
      setCurrentPalette(savedPalette);
    }
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login darkMode={darkMode} />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MainLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                  >
                    <LazyComponent>
                      <Dashboard />
                    </LazyComponent>
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/ventas"
              element={
                <PrivateRoute>
                  <MainLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                  >
                    <LazyComponent>
                      <Ventas />
                    </LazyComponent>
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute onlyAdmin={true}>
                  <MainLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                  >
                    <LazyComponent>
                      <Usuarios />
                    </LazyComponent>
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/inventario"
              element={
                <PrivateRoute onlyAdmin={true}>
                  <MainLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                  >
                    <LazyComponent>
                      <Inventario />
                    </LazyComponent>
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/reportes"
              element={
                <PrivateRoute>
                  <MainLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                  >
                    <LazyComponent>
                      <Reportes />
                    </LazyComponent>
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/categorias"
              element={
                <PrivateRoute onlyAdmin={true}>
                  <MainLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                  >
                    <LazyComponent>
                      <Categorias />
                    </LazyComponent>
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <MainLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    onModeChange={handleModeChange}
                  >
                    <LazyComponent>
                      <AdvancedAnalytics />
                    </LazyComponent>
                  </MainLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
