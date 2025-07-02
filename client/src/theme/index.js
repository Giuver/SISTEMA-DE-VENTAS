import { createTheme } from '@mui/material/styles';

// Paletas de colores predefinidas
export const colorPalettes = {
    default: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
            contrastText: '#ffffff'
        }
    },
    corporate: {
        primary: {
            main: '#2c3e50',
            light: '#34495e',
            dark: '#1a252f',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#3498db',
            light: '#5dade2',
            dark: '#2980b9',
            contrastText: '#ffffff'
        }
    },
    modern: {
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#ffffff'
        }
    },
    elegant: {
        primary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#ec4899',
            light: '#f472b6',
            dark: '#db2777',
            contrastText: '#ffffff'
        }
    },
    nature: {
        primary: {
            main: '#059669',
            light: '#10b981',
            dark: '#047857',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#ffffff'
        }
    }
};

// Configuración de componentes personalizada
const componentOverrides = {
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                borderRadius: 12,
                fontWeight: 600,
                padding: '10px 24px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
            },
            contained: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }
            },
            outlined: {
                borderWidth: 2,
                '&:hover': {
                    borderWidth: 2
                }
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                }
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
            },
            elevation1: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            },
            elevation2: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            },
            elevation3: {
                boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 12,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0,0,0,0.3)'
                        }
                    },
                    '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2
                        }
                    }
                }
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 20,
                fontWeight: 500,
                '&.MuiChip-colorSuccess': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    color: '#2e7d32'
                },
                '&.MuiChip-colorWarning': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    color: '#f57c00'
                },
                '&.MuiChip-colorError': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    color: '#d32f2f'
                }
            }
        }
    },
    MuiTableHead: {
        styleOverrides: {
            root: {
                '& .MuiTableCell-head': {
                    fontWeight: 700,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderBottom: '2px solid rgba(0,0,0,0.1)'
                }
            }
        }
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                padding: '16px 12px'
            }
        }
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }
        }
    },
    MuiSnackbar: {
        styleOverrides: {
            root: {
                '& .MuiAlert-root': {
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
            }
        }
    },
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                borderRadius: 10,
                height: 8,
                backgroundColor: 'rgba(0,0,0,0.05)'
            },
            bar: {
                borderRadius: 10
            }
        }
    },
    MuiCircularProgress: {
        styleOverrides: {
            root: {
                color: 'inherit'
            }
        }
    }
};

// Configuración de tipografía
const typographyConfig = {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.2
    },
    h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3
    },
    h3: {
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.3
    },
    h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4
    },
    h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4
    },
    h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4
    },
    subtitle1: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.5
    },
    subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.5
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.6
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6
    },
    button: {
        fontWeight: 600,
        textTransform: 'none'
    }
};

// Función para crear tema
export const createAppTheme = (paletteName = 'default', mode = 'light') => {
    const palette = colorPalettes[paletteName] || colorPalettes.default;

    return createTheme({
        palette: {
            mode,
            primary: palette.primary,
            secondary: palette.secondary,
            background: {
                default: mode === 'dark' ? '#0a0a0a' : '#f8fafc',
                paper: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                gradient: mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            },
            text: {
                primary: mode === 'dark' ? '#ffffff' : '#1a202c',
                secondary: mode === 'dark' ? '#a0aec0' : '#4a5568'
            },
            divider: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            success: {
                main: '#10b981',
                light: '#34d399',
                dark: '#059669'
            },
            warning: {
                main: '#f59e0b',
                light: '#fbbf24',
                dark: '#d97706'
            },
            error: {
                main: '#ef4444',
                light: '#f87171',
                dark: '#dc2626'
            },
            info: {
                main: '#3b82f6',
                light: '#60a5fa',
                dark: '#2563eb'
            }
        },
        typography: typographyConfig,
        components: componentOverrides,
        shape: {
            borderRadius: 12
        },
        shadows: [
            'none',
            '0 1px 3px rgba(0,0,0,0.05)',
            '0 2px 8px rgba(0,0,0,0.08)',
            '0 4px 12px rgba(0,0,0,0.1)',
            '0 6px 16px rgba(0,0,0,0.12)',
            '0 8px 24px rgba(0,0,0,0.15)',
            '0 12px 32px rgba(0,0,0,0.18)',
            '0 16px 40px rgba(0,0,0,0.2)',
            '0 20px 48px rgba(0,0,0,0.22)',
            '0 24px 56px rgba(0,0,0,0.25)',
            '0 28px 64px rgba(0,0,0,0.28)',
            '0 32px 72px rgba(0,0,0,0.3)',
            '0 36px 80px rgba(0,0,0,0.32)',
            '0 40px 88px rgba(0,0,0,0.35)',
            '0 44px 96px rgba(0,0,0,0.38)',
            '0 48px 104px rgba(0,0,0,0.4)',
            '0 52px 112px rgba(0,0,0,0.42)',
            '0 56px 120px rgba(0,0,0,0.45)',
            '0 60px 128px rgba(0,0,0,0.48)',
            '0 64px 136px rgba(0,0,0,0.5)',
            '0 68px 144px rgba(0,0,0,0.52)',
            '0 72px 152px rgba(0,0,0,0.55)',
            '0 76px 160px rgba(0,0,0,0.58)',
            '0 80px 168px rgba(0,0,0,0.6)'
        ]
    });
};

// Tema por defecto
export const defaultTheme = createAppTheme('default', 'light'); 