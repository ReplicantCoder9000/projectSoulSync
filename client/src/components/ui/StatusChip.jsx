import { Chip, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const StatusChip = ({
  label,
  type = 'mood',
  variant = 'filled',
  size = 'medium',
  onDelete,
  onClick,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  const getChipColors = () => {
    if (type === 'mood') {
      const moodColor = theme.palette.mood[label.toLowerCase()];
      return {
        bgcolor: variant === 'outlined' ? 'transparent' : moodColor,
        color: variant === 'outlined' ? theme.palette.text.primary : '#FFF',
        borderColor: moodColor
      };
    }
    
    if (variant === 'outlined') {
      return {
        bgcolor: 'transparent',
        color: theme.palette.text.primary,
        borderColor: theme.palette.primary.main
      };
    }

    return {
      bgcolor: theme.palette.primary[100],
      color: theme.palette.primary.main
    };
  };

  const colors = getChipColors();

  return (
    <Chip
      label={label}
      size={size}
      variant={variant}
      onClick={onClick}
      onDelete={onDelete}
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize',
        borderRadius: '6px',
        height: size === 'small' ? '24px' : '28px',
        ...colors,
        '& .MuiChip-deleteIcon': {
          color: 'inherit',
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
            color: 'inherit'
          }
        },
        '&:hover': onClick || onDelete ? {
          opacity: 0.9
        } : undefined,
        ...sx
      }}
      {...props}
    />
  );
};

StatusChip.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['mood', 'tag']),
  variant: PropTypes.oneOf(['filled', 'outlined']),
  size: PropTypes.oneOf(['small', 'medium']),
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  sx: PropTypes.object
};

export default StatusChip;
