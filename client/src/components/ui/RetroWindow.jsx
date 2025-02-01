import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Remove as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const WindowContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows.window,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    border: `1px solid ${theme.palette.divider}`,
    pointerEvents: 'none'
  }
}));

const TitleBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.25, 0.5),
  minHeight: 20,
  background: theme.gradients.titleBar,
  color: theme.palette.common.white,
  userSelect: 'none'
}));

const WindowButton = styled(IconButton)(({ theme }) => ({
  width: 16,
  height: 14,
  minWidth: 16,
  padding: 0,
  marginLeft: 2,
  borderRadius: 0,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.text.primary}`,
  boxShadow: theme.shadows.button,
  '&:hover': {
    backgroundColor: theme.palette.background.paper
  },
  '&:active': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows.buttonPressed,
    '& .MuiSvgIcon-root': {
      transform: 'translate(1px, 1px)'
    }
  },
  '& .MuiSvgIcon-root': {
    fontSize: 10,
    color: theme.palette.text.primary
  }
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  position: 'relative'
}));

const TitleBarIcon = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.5),
  '& img': {
    width: 14,
    height: 14
  }
}));

const TitleBarText = styled(Typography)({
  fontFamily: '"Microsoft Sans Serif", system-ui',
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: 1,
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  gap: 2
});

const RetroWindow = ({ title, onClose, children, sx = {} }) => {
  return (
    <WindowContainer sx={sx}>
      <TitleBar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TitleBarIcon>
            {/* You can add a window icon here */}
            <span role="img" aria-label="window icon" style={{ fontSize: '14px' }}>
              💻
            </span>
          </TitleBarIcon>
          <TitleBarText>{title}</TitleBarText>
        </Box>
        <ButtonContainer>
          <WindowButton size="small" aria-label="minimize">
            <MinimizeIcon />
          </WindowButton>
          <WindowButton size="small" aria-label="maximize">
            <MaximizeIcon />
          </WindowButton>
          <WindowButton 
            size="small" 
            aria-label="close"
            onClick={onClose}
            sx={{ marginRight: 0 }}
          >
            <CloseIcon />
          </WindowButton>
        </ButtonContainer>
      </TitleBar>

      <ContentContainer>
        {children}
      </ContentContainer>
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
