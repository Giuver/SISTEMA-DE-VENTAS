import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Tooltip
} from '@mui/material';
import {
    Palette as PaletteIcon,
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { colorPalettes } from '../theme';

const ThemeSelector = ({ currentTheme, onThemeChange, onModeChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeSelect = (paletteName) => {
        onThemeChange(paletteName);
        handleClose();
    };

    const handleModeToggle = () => {
        onModeChange();
        handleClose();
    };

    const getCurrentPaletteName = () => {
        const primaryColor = currentTheme.palette.primary.main;
        return Object.keys(colorPalettes).find(
            name => colorPalettes[name].primary.main === primaryColor
        ) || 'default';
    };

    const paletteNames = {
        default: 'Predeterminado',
        corporate: 'Corporativo',
        modern: 'Moderno',
        elegant: 'Elegante',
        nature: 'Naturaleza'
    };

    const ColorPreview = ({ color }) => (
        <Box
            sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: color,
                border: '2px solid',
                borderColor: 'divider',
                mr: 1
            }}
        />
    );

    return (
        <>
            <Tooltip title="Cambiar tema">
                <IconButton
                    onClick={handleClick}
                    sx={{
                        color: 'inherit',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    <PaletteIcon />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                    }
                }}
            >
                <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Personalización
                    </Typography>
                </Box>

                <Divider />

                {/* Selector de modo */}
                <MenuItem onClick={handleModeToggle}>
                    <ListItemIcon>
                        {currentTheme.palette.mode === 'dark' ? <LightIcon /> : <DarkIcon />}
                    </ListItemIcon>
                    <ListItemText
                        primary={`Modo ${currentTheme.palette.mode === 'dark' ? 'Claro' : 'Oscuro'}`}
                        secondary="Cambiar entre modo claro y oscuro"
                    />
                </MenuItem>

                <Divider />

                <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Paletas de Colores
                    </Typography>
                </Box>

                {/* Paletas de colores */}
                {Object.entries(colorPalettes).map(([key, palette]) => {
                    const isSelected = getCurrentPaletteName() === key;

                    return (
                        <MenuItem
                            key={key}
                            onClick={() => handleThemeSelect(key)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ColorPreview color={palette.primary.main} />
                                <ListItemText
                                    primary={paletteNames[key]}
                                    secondary={`${palette.primary.main} • ${palette.secondary.main}`}
                                />
                            </Box>

                            {isSelected && (
                                <CheckIcon
                                    sx={{
                                        color: 'primary.main',
                                        fontSize: 20
                                    }}
                                />
                            )}
                        </MenuItem>
                    );
                })}

                <Divider />

                <Box sx={{ p: 2, pt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Los cambios se aplican inmediatamente
                    </Typography>
                </Box>
            </Menu>
        </>
    );
};

export default ThemeSelector; 