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
        '&.MuiButton-contained': {
          boxShadow: (theme) => theme.shadows.soft,
          '&:hover': {
            boxShadow: (theme) => theme.shadows.soft,
            backgroundColor: (theme) => 
              theme.palette.mode === 'light' 
                ? theme.palette[color].light
                : theme.palette[color].dark
          }
        },
        '&.MuiButton-outlined': {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? `${theme.palette[color].light}50`
                : `${theme.palette[color].dark}50`
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
      <Tooltip title={tooltip} placement="top">
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
    'success'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object
};

export default ActionButton;
