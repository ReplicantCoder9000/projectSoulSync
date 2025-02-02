import { createTheme } from '@mui/material/styles';

// Windows 95 color palette
const win95Colors = {
  titleBarActive: '#000080',      // Classic Windows title bar blue
  titleBarGradient: '#1084d0',    // Title bar gradient end
  buttonFace: '#C0C0C0',         // Default button/window color
  buttonLight: '#FFFFFF',         // Button highlight
  buttonShadow: '#808080',       // Button shadow
  buttonDarkShadow: '#000000',   // Dark button shadow
  windowFrame: '#DFDFDF',        // Window frame color
  dialogBackground: '#ECE9D8',   // Dialog background
  textPrimary: '#000000',        // Primary text color
  textInactive: '#808080',       // Inactive text
  accent1: '#6A5ACD',           // Slate blue (gender-neutral primary)
  accent2: '#9DC183',           // Sage green (gender-neutral secondary)
  accent3: '#D4C5B9'            // Warm beige (gender-neutral accent)
};

// Spacing system based on 8px grid
const spacing = 8; // Base spacing unit in pixels

// Windows 95-style shadows
export const shadows = {
  button: `inset -1px -1px 0 ${win95Colors.buttonDarkShadow},
           inset 1px 1px 0 ${win95Colors.buttonLight},
           inset -2px -2px 0 ${win95Colors.buttonShadow},
           inset 2px 2px 0 ${win95Colors.windowFrame}`,
  buttonPressed: `inset -1px -1px 0 ${win95Colors.buttonLight},
                  inset 1px 1px 0 ${win95Colors.buttonDarkShadow},
                  inset -2px -2px 0 ${win95Colors.windowFrame},
                  inset 2px 2px 0 ${win95Colors.buttonShadow}`,
  window: `inset -1px -1px 0 ${win95Colors.buttonDarkShadow},
           inset 1px 1px 0 ${win95Colors.buttonLight}`,
  field: `inset -1px -1px 0 ${win95Colors.buttonLight},
          inset 1px 1px 0 ${win95Colors.buttonShadow}`,
  focus: `0 0 0 1px ${win95Colors.accent1}`
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
};

// Windows 95-inspired gradients
export const gradients = {
  titleBar: `linear-gradient(180deg, ${win95Colors.titleBarActive} 0%, ${win95Colors.titleBarGradient} 100%)`,
  window: `linear-gradient(180deg, ${win95Colors.windowFrame} 0%, ${win95Colors.buttonFace} 100%)`,
  background: `linear-gradient(135deg, #E6EFF6 0%, #F0F0F0 100%)`,
  primary: `linear-gradient(180deg, ${win95Colors.accent1} 0%, ${win95Colors.accent1} 100%)`,
  secondary: `linear-gradient(180deg, ${win95Colors.accent2} 0%, ${win95Colors.accent2} 100%)`,
  accent: `linear-gradient(180deg, ${win95Colors.accent3} 0%, ${win95Colors.accent3} 100%)`,
  neon: `linear-gradient(180deg, #FF69B4 0%, #FF1493 100%)`,
  electric: `linear-gradient(180deg, #FF1493 0%, #C71585 100%)`,
  crt: `repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)`
};

// Mood colors
const moodColors = {
  happy: '#FFD700',    // Gold
  sad: '#4682B4',      // Steel Blue
  angry: '#DC143C',    // Crimson
  anxious: '#9932CC',  // Dark Orchid
  neutral: '#808080',  // Gray
  excited: '#FF69B4',  // Hot Pink
  peaceful: '#98FB98'  // Pale Green
};

const getTheme = (mode = 'light') => {
  // Create array of shadows for different elevations
  const defaultShadows = [
    'none', // 0
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)', // 1
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)', // 2
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)', // 3
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)', // 4
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)', // 5
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)', // 6
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)', // 7
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)', // 8
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)', // 9
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)', // 10
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)', // 11
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)', // 12
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)', // 13
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)', // 14
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)', // 15
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)', // 16
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)', // 17
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)', // 18
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)', // 19
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)', // 20
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)', // 21
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)', // 22
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)', // 23
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)' // 24
  ];

  const baseTheme = createTheme({
    shadows: defaultShadows,
    palette: {
      mode,
      primary: {
        main: win95Colors.accent1,
        light: win95Colors.accent2,
        dark: win95Colors.accent3
      },
      secondary: {
        main: win95Colors.accent2,
        light: win95Colors.accent3,
        dark: win95Colors.accent1
      },
      background: {
        default: mode === 'light' ? '#E6EFF6' : '#000033',
        paper: mode === 'light' ? win95Colors.buttonFace : '#000066',
        accent: mode === 'light' ? win95Colors.windowFrame : '#191970'
      },
      text: {
        primary: win95Colors.textPrimary,
        secondary: win95Colors.textInactive
      },
      divider: win95Colors.buttonShadow,
      mood: moodColors
    },
    typography: {
      fontFamily: '"Microsoft Sans Serif", "VT323", system-ui, -apple-system, sans-serif',
      h1: {
        fontFamily: '"Microsoft Sans Serif", system-ui',
        fontSize: '24px',
        fontWeight: 400,
        lineHeight: 1.5
      },
      h2: {
        fontFamily: '"Microsoft Sans Serif", system-ui',
        fontSize: '20px',
        fontWeight: 400,
        lineHeight: 1.5
      },
      h3: {
        fontSize: '18px',
        fontWeight: 400,
        lineHeight: 1.4
      },
      h4: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.4
      },
      h5: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.4
      },
      h6: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: 1.4
      },
      body1: {
        fontSize: '14px',
        lineHeight: 1.5
      },
      body2: {
        fontSize: '12px',
        lineHeight: 1.5
      },
      button: {
        textTransform: 'none',
        fontWeight: 400,
        fontSize: '14px'
      }
    },
    shape: {
      borderRadius: 0
    },
    breakpoints: {
      values: breakpoints
    },
    spacing,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            padding: '6px 16px',
            minHeight: '23px',
            fontWeight: 400,
            backgroundColor: win95Colors.buttonFace,
            color: win95Colors.textPrimary,
            boxShadow: shadows.button,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: win95Colors.buttonFace
            },
            '&:active': {
              backgroundColor: win95Colors.buttonFace,
              boxShadow: shadows.buttonPressed,
              transform: 'translateY(1px)'
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              backgroundColor: '#FFFFFF',
              boxShadow: shadows.field,
              '& fieldset': {
                borderWidth: 0
              },
              '&:hover fieldset': {
                borderWidth: 0
              },
              '&.Mui-focused fieldset': {
                borderWidth: 0
              },
              '& input': {
                padding: '4px 8px',
                caretColor: win95Colors.textPrimary,
                fontFamily: '"Microsoft Sans Serif", system-ui'
              }
            },
            '& .MuiInputLabel-root': {
              fontFamily: '"Microsoft Sans Serif", system-ui',
              fontSize: '14px',
              color: win95Colors.textPrimary,
              '&.Mui-focused': {
                color: win95Colors.textPrimary
              }
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundColor: win95Colors.buttonFace,
            boxShadow: shadows.window
          }
        }
      }
    }
  });

  return {
    ...baseTheme,
    gradients,
    shadows
  };
};

const theme = getTheme();

export { getTheme };
export default theme;
