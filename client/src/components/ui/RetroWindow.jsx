import { Box, IconButton, Typography, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Remove as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const scanlineAnimation = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
`;

const staticAnimation = keyframes`
  0%, 100% {
    opacity: 0.03;
  }
  50% {
    opacity: 0.06;
  }
`;

const WindowContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: '2px solid',
  borderColor: theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.gradients.crt,
    opacity: 0.1,
    pointerEvents: 'none'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(transparent 0px, rgba(0, 0, 0, 0.05) 1px, transparent 2px)',
    backgroundSize: '100% 2px',
    animation: `${scanlineAnimation} 8s linear infinite`,
    opacity: 0.1,
    pointerEvents: 'none'
  }
}));

const TitleBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 1),
  background: theme.gradients.metallic,
  borderBottom: '2px solid',
  borderColor: theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.5)'
  }
}));

const WindowButton = styled(IconButton)(({ theme, color }) => ({
  width: 16,
  height: 16,
  padding: 0,
  border: '1px solid',
  borderColor: theme.palette.mode === 'light' ? '#808080' : '#666666',
  backgroundColor: color,
  '&:hover': {
    backgroundColor: color,
    opacity: 0.9,
    transform: 'scale(1.1)'
  },
  '& .MuiSvgIcon-root': {
    fontSize: 12,
    color: '#FFFFFF'
  }
}));

const RetroWindow = ({ title, onClose, children, sx = {} }) => {
  return (
    <WindowContainer sx={sx}>
      <TitleBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="span"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: (theme) => theme.palette.primary.main,
              boxShadow: '0 0 4px rgba(255, 20, 147, 0.5)',
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '12px',
              color: 'text.primary',
              textShadow: '1px 1px 0 rgba(255, 105, 180, 0.3)'
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <WindowButton color="#FFB6C1">
            <MinimizeIcon />
          </WindowButton>
          <WindowButton color="#87CEEB">
            <MaximizeIcon />
          </WindowButton>
          <WindowButton color="#FF69B4" onClick={onClose}>
            <CloseIcon />
          </WindowButton>
        </Box>
      </TitleBar>

      <Box
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)',
            opacity: 0.1,
            pointerEvents: 'none',
            animation: `${staticAnimation} 4s ease-in-out infinite`
          }
        }}
      >
        {children}
      </Box>
    </WindowContainer>
  );
};

RetroWindow.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object
};

export default RetroWindow;
