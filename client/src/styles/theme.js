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

// Custom shadows
export const shadows = {
  soft: '0 1px 4px rgba(0, 0, 0, 0.05)',
  medium: '0 2px 8px rgba(0, 0, 0, 0.08)',
  strong: '0 4px 16px rgba(0, 0, 0, 0.12)'
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
};

const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#556B2F',     // Muted olive green
      light: '#8B9E72',    // Light sage
      dark: '#3B4A1F'      // Deep forest
    },
    secondary: {
      main: '#D4C5B9',     // Warm beige
      light: '#E8E0D9',    // Light beige
      dark: '#A69B91'      // Taupe
    },
    background: {
      default: mode === 'light' ? '#FAFAF8' : '#1A1A1A',  // Off-white / Dark gray
      paper: mode === 'light' ? '#FFFFFF' : '#2D2D2D',    // White / Darker gray
      accent: mode === 'light' ? '#F4F6F0' : '#2A2A2A'    // Light sage / Dark accent
    },
    text: {
      primary: mode === 'light' ? '#2C2C2C' : '#FFFFFF',
      secondary: mode === 'light' ? '#666666' : '#A0A0A0'
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
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    h1: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
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
    borderRadius: 8
  },
  breakpoints: {
    values: breakpoints
  },
  spacing: spacing,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'light' 
                ? theme.palette.primary.light
                : theme.palette.primary.dark
          }
        },
        contained: {
          boxShadow: shadows.soft,
          '&:hover': {
            boxShadow: shadows.soft
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
          borderRadius: 12,
          boxShadow: shadows.soft,
          border: '1px solid',
          borderColor: (theme) => theme.palette.divider
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: shadows.soft
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
            borderRadius: 8,
            '& fieldset': {
              borderWidth: 1.5
            }
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
