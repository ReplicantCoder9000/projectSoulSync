import { createTheme } from '@mui/material/styles';

// Spacing system based on 8px grid
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem'      // 48px
};

// Custom shadows with retro beveled effects
export const shadows = {
  soft: '2px 2px 0 rgba(0, 0, 0, 0.1), -1px -1px 0 rgba(255, 255, 255, 0.8)',
  medium: '3px 3px 0 rgba(0, 0, 0, 0.15), -1px -1px 0 rgba(255, 255, 255, 0.9)',
  strong: '4px 4px 0 rgba(0, 0, 0, 0.2), -2px -2px 0 rgba(255, 255, 255, 1)',
  focus: '0 0 0 2px rgba(75, 0, 130, 0.2)',  // Electric indigo with opacity
  window: '2px 2px 4px rgba(0, 0, 0, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.8)',
  retro: '2px 2px 0 rgba(0, 0, 0, 0.2), -2px -2px 0 rgba(255, 255, 255, 0.5)'
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
};

// Y2K-inspired gradients and effects
export const gradients = {
  auth: 'linear-gradient(135deg, #4B0082 0%, #FF69B4 100%)',  // Electric indigo to hot pink
  primary: 'linear-gradient(135deg, #9370DB 0%, #4B0082 100%)',  // Medium purple to electric indigo
  secondary: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',  // Light pink to hot pink
  window: 'linear-gradient(180deg, #C0C0C0 0%, #FFFFFF 100%)',  // Classic window gradient
  background: 'linear-gradient(135deg, #F8F8FF 0%, #E6E6FA 100%)',  // Ghost white to lavender
  metallic: 'linear-gradient(180deg, #E8E8E8 0%, #B0B0B0 50%, #E8E8E8 100%)',  // Metallic effect
  crt: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',  // CRT scanline effect
  neon: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FF1493 100%)',  // Neon pink
  electric: 'linear-gradient(135deg, #00FFFF 0%, #4169E1 50%, #00FFFF 100%)'  // Electric blue
};

// Y2K animation keyframes
export const keyframes = {
  blink: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0 }
  },
  scanline: {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(100%)' }
  },
  static: {
    '0%, 100%': { opacity: 0.3 },
    '50%': { opacity: 0.1 }
  }
};

const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#FF1493',     // Deep pink
      light: '#FF69B4',    // Hot pink
      dark: '#C71585'      // Medium violet red
    },
    secondary: {
      main: '#4169E1',     // Royal blue
      light: '#00FFFF',    // Cyan
      dark: '#0000CD'      // Medium blue
    },
    background: {
      default: mode === 'light' ? '#F0F0FF' : '#000033',  // Light blue-tinted / Deep blue-black
      paper: mode === 'light' ? '#FFFFFF' : '#000066',    // White / Navy blue
      accent: mode === 'light' ? '#E6E6FA' : '#191970'    // Lavender / Midnight blue
    },
    text: {
      primary: mode === 'light' ? '#000080' : '#00FFFF',      // Navy / Cyan
      secondary: mode === 'light' ? '#4B0082' : '#FF69B4'     // Indigo / Hot pink
    },
    mood: {
      happy: '#E6C74C',    // Muted gold
      sad: '#7B9EC5',      // Soft blue
      angry: '#C25D5D',    // Muted red
      anxious: '#9B8EB4',  // Soft purple
      neutral: '#A3A3A3',  // Medium gray
      excited: '#E6A94C',  // Muted orange
      peaceful: '#8FB48E'  // Sage green
    },
    divider: mode === 'light' ? 'rgba(75, 0, 130, 0.2)' : 'rgba(255, 105, 180, 0.2)'
  },
  typography: {
    fontFamily: '"VT323", "Orbitron", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    h1: {
      fontFamily: '"Press Start 2P", "Orbitron", monospace',
      fontSize: '24px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
      textShadow: '2px 2px 0 rgba(255, 105, 180, 0.3)'
    },
    h2: {
      fontFamily: '"Press Start 2P", "Orbitron", monospace',
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
      textShadow: '1px 1px 0 rgba(255, 105, 180, 0.3)'
    },
    h3: {
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h6: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '16px',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '14px',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '14px'
    },
    caption: {
      fontSize: '12px',
      lineHeight: 1.5,
      color: mode === 'light' ? '#666666' : '#A0A0A0'
    }
  },
  shape: {
    borderRadius: 4
  },
  breakpoints: {
    values: breakpoints
  },
  spacing: spacing,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '10px 20px',
          fontWeight: 500,
          border: '2px solid',
          borderColor: 'transparent',
          background: (theme) => theme.gradients.metallic,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            borderColor: (theme) => theme.palette.primary.main,
            background: (theme) => theme.gradients.neon
          }
        },
        contained: {
          boxShadow: '2px 2px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)',
          '&:hover': {
            boxShadow: '3px 3px 0 rgba(0,0,0,0.3), -3px -3px 0 rgba(255,255,255,0.3)'
          }
        },
        outlined: {
          borderWidth: 1.5
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: '2px solid',
          borderColor: (theme) => theme.palette.primary.main,
          background: (theme) => `${theme.gradients.metallic} !important`,
          boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: (theme) => theme.gradients.crt,
            opacity: 0.1,
            pointerEvents: 'none'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '2px solid',
          borderColor: (theme) => theme.palette.primary.main,
          boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.3), -3px -3px 0 rgba(255,255,255,0.3)'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: (theme) => theme.gradients.crt,
            opacity: 0.1,
            pointerEvents: 'none',
            animation: 'scanline 8s linear infinite'
          }
        }
      },
      defaultProps: {
        elevation: 0
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: shadows.medium,
          '&:hover': {
            boxShadow: shadows.medium
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 28,
          fontWeight: 500,
          '&.MuiChip-outlined': {
            borderWidth: 1.5
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            border: '2px solid',
            borderColor: (theme) => theme.palette.primary.main,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            fontFamily: '"VT323", monospace',
            fontSize: '18px',
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderWidth: 0
            },
            '&:hover': {
              borderColor: (theme) => theme.palette.secondary.main,
              transform: 'translateY(-1px)'
            },
            '&.Mui-focused': {
              borderColor: (theme) => theme.palette.secondary.main,
              boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 0
              }
            },
            '& input': {
              caretColor: (theme) => theme.palette.secondary.main,
              caretShape: 'block',
              animation: 'blink 1s step-end infinite'
            }
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"VT323", monospace',
            fontSize: '18px',
            color: (theme) => theme.palette.primary.main
          }
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'light' ? '#2C2C2C' : '#FFFFFF',
          color: mode === 'light' ? '#FFFFFF' : '#2C2C2C',
          fontSize: '12px',
          fontWeight: 500,
          padding: '6px 12px',
          borderRadius: 6
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid',
          borderColor: (theme) => theme.palette.divider,
          boxShadow: 'none'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          padding: '10px 16px',
          '&.Mui-selected': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'light'
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
            '&:hover': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark
            }
          }
        }
      }
    }
  }
});

const theme = getTheme();

export { getTheme };
export default theme;
