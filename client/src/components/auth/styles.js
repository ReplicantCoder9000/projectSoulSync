import { styled } from '@mui/material/styles';
import { Box, TextField, Alert } from '@mui/material';

// Windows 95-style background with checkerboard pattern
export const Win95Background = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  backgroundImage: `
    linear-gradient(45deg, ${theme.palette.background.paper} 25%, transparent 25%),
    linear-gradient(-45deg, ${theme.palette.background.paper} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${theme.palette.background.paper} 75%),
    linear-gradient(-45deg, transparent 75%, ${theme.palette.background.paper} 75%)
  `,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  padding: theme.spacing(2)
}));

// Windows 95-style text field
export const RetroTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    minHeight: '32px',
    '& input': {
      padding: '8px',
      fontSize: '12px',
      fontFamily: '"Microsoft Sans Serif", system-ui',
      '&::placeholder': {
        fontSize: '12px',
        opacity: 0.7
      }
    },
    backgroundColor: theme.palette.background.paper,
    border: '2px solid',
    borderColor: theme.palette.mode === 'dark' ? '#4A4A4A' : '#C0C0C0',
    boxShadow: theme.shadows.field,
    '& fieldset': {
      borderWidth: 0
    },
    '&:hover': {
      borderColor: theme.palette.text.primary
    },
    '&.Mui-focused': {
      borderColor: theme.palette.text.primary,
      boxShadow: theme.shadows.field,
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 0
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '12px',
    transform: 'translate(8px, -6px) scale(0.75)',
    '&.Mui-focused': {
      color: theme.palette.text.primary
    }
  },
  '& .MuiFormHelperText-root': {
    fontSize: '11px',
    marginTop: '2px',
    fontFamily: '"Microsoft Sans Serif", system-ui',
    marginLeft: '2px',
    color: theme.palette.error.main
  }
}));

// Windows 95-style alert
export const RetroAlert = styled(Alert)(({ theme }) => ({
  fontFamily: '"Microsoft Sans Serif", system-ui',
  fontSize: '12px',
  padding: '6px 8px',
  borderRadius: 0,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.error.main,
  boxShadow: theme.shadows.field,
  '& .MuiAlert-icon': {
    fontSize: '16px',
    padding: 0
  }
}));

// Common form container styles
export const FormContainer = styled(Box)({
  width: '100%',
  '& .MuiTextField-root': {
    marginBottom: '8px'
  }
});

// Common typography styles
export const commonTypographyStyles = {
  title: {
    textAlign: 'center',
    marginBottom: '8px',
    fontFamily: '"Microsoft Sans Serif", system-ui',
    fontSize: '12px'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '16px',
    fontFamily: '"Microsoft Sans Serif", system-ui',
    fontSize: '11px'
  },
  link: {
    textAlign: 'center',
    fontFamily: '"Microsoft Sans Serif", system-ui',
    fontSize: '11px'
  }
};

// Common button styles
export const commonButtonStyles = {
  button: {
    marginTop: '8px',
    marginBottom: '8px',
    height: '22px',
    fontFamily: '"Microsoft Sans Serif", system-ui',
    fontSize: '12px',
    textTransform: 'none'
  }
};

// Common window styles
export const commonWindowStyles = {
  width: '100%',
  maxWidth: 280
};
