import { Button, CircularProgress, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const ActionButton = ({
  children,
  loading = false,
  tooltip,
  startIcon,
  endIcon,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  sx = {},
  ...props
}) => {
  const button = (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={
        loading ? (
          <CircularProgress
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color="inherit"
          />
        ) : (
          startIcon
        )
      }
      endIcon={loading ? null : endIcon}
      sx={{
        position: 'relative',
        minWidth: loading ? '120px' : undefined,
        fontFamily: '"VT323", monospace',
        fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
        border: '2px solid',
        borderColor: variant === 'contained' ? 'transparent' : `${color}.main`,
        boxShadow: (theme) => theme.shadows.retro,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: (theme) => `${theme.shadows.retro}, 0 4px 8px rgba(0,0,0,0.1)`,
        },
        '&:active': {
          transform: 'translateY(1px)',
          boxShadow: 'none',
        },
        '&.MuiButton-contained': {
          background: (theme) => color === 'inherit' ? theme.palette.grey[300] : `linear-gradient(180deg, ${theme.palette[color]?.light || theme.palette.primary.light} 0%, ${theme.palette[color]?.main || theme.palette.primary.main} 100%)`,
          '&:hover': {
            background: (theme) => color === 'inherit' ? theme.palette.grey[400] : `linear-gradient(180deg, ${theme.palette[color]?.main || theme.palette.primary.main} 0%, ${theme.palette[color]?.dark || theme.palette.primary.dark} 100%)`,
          },
          '&:disabled': {
            background: 'linear-gradient(180deg, #E0E0E0 0%, #CCCCCC 100%)',
            color: 'rgba(0, 0, 0, 0.38)',
          }
        },
        '&.MuiButton-outlined': {
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: (theme) => `${theme.palette[color].light}15`,
            borderColor: `${color}.dark`,
          },
          '&:disabled': {
            borderColor: 'grey.300',
            color: 'rgba(0, 0, 0, 0.38)',
          }
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip 
        title={tooltip} 
        placement="top"
        sx={{
          '& .MuiTooltip-tooltip': {
            fontFamily: '"VT323", monospace',
            fontSize: '14px',
            border: '1px solid',
            borderColor: 'grey.300',
            boxShadow: (theme) => theme.shadows.retro,
            backgroundColor: 'background.paper',
            color: 'text.primary'
          }
        }}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  tooltip: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
    'inherit'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object
};

export default ActionButton;
