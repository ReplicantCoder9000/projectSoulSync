import { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getTheme } from '../../styles/theme.js';
import PropTypes from 'prop-types';

const ThemeProvider = ({ children }) => {
  const themeMode = useSelector((state) => state.settings.theme);
  const baseTheme = getTheme(themeMode);

  // Extend the theme with custom properties
  const theme = createTheme({
    ...baseTheme,
    gradients: {
      auth: 'linear-gradient(135deg, #4B0082 0%, #FF69B4 100%)',
      primary: 'linear-gradient(135deg, #9370DB 0%, #4B0082 100%)',
      secondary: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
      window: 'linear-gradient(180deg, #C0C0C0 0%, #FFFFFF 100%)',
      background: 'linear-gradient(135deg, #F8F8FF 0%, #E6E6FA 100%)',
      metallic: 'linear-gradient(180deg, #E8E8E8 0%, #B0B0B0 50%, #E8E8E8 100%)',
      crt: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
      neon: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FF1493 100%)',
      electric: 'linear-gradient(135deg, #00FFFF 0%, #4169E1 50%, #00FFFF 100%)'
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ThemeProvider;
