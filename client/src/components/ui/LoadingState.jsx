import { Box, Typography, Button, keyframes, styled } from '@mui/material';
import PropTypes from 'prop-types';

const loadingDotAnimation = keyframes`
  0%, 20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60% {
    content: '...';
  }
  80%, 100% {
    content: '';
  }
`;

const progressBarAnimation = keyframes`
  0% {
    width: 0%;
    background-position: 0% 50%;
  }
  50% {
    width: 100%;
    background-position: 100% 50%;
  }
  100% {
    width: 0%;
    background-position: 0% 50%;
  }
`;

const RetroLoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  position: 'relative',
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
  }
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '14px',
  color: theme.palette.primary.main,
  textShadow: '2px 2px 0 rgba(255, 105, 180, 0.2)',
  '&::after': {
    content: '""',
    animation: `${loadingDotAnimation} 1.5s infinite`
  }
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  width: '200px',
  height: '20px',
  border: '2px solid',
  borderColor: theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: `linear-gradient(90deg, 
      ${theme.palette.primary.main} 0%, 
      ${theme.palette.secondary.main} 50%, 
      ${theme.palette.primary.main} 100%
    )`,
    backgroundSize: '200% 100%',
    animation: `${progressBarAnimation} 2s linear infinite`
  }
}));

const RetroButton = styled(Button)(({ theme }) => ({
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '12px',
  padding: theme.spacing(1.5, 3),
  border: '2px solid',
  borderColor: theme.palette.error.main,
  background: theme.gradients.neon,
  color: theme.palette.common.white,
  boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
  '&:hover': {
    background: theme.gradients.electric,
    transform: 'translateY(-2px)',
    boxShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)'
  }
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  fontFamily: '"VT323", monospace',
  fontSize: '20px',
  color: theme.palette.error.main,
  textAlign: 'center',
  textShadow: '2px 2px 0 rgba(0, 0, 0, 0.2)',
  padding: theme.spacing(2),
  border: '2px solid',
  borderColor: theme.palette.error.main,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
  maxWidth: '80%',
  margin: '0 auto'
}));

const LoadingState = ({ loading = false, error = null, onRetry = null, children }) => {
  if (loading) {
    return (
      <RetroLoadingContainer>
        <LoadingText>LOADING</LoadingText>
        <ProgressBar />
        <Typography
          sx={{
            fontFamily: '"VT323", monospace',
            fontSize: '16px',
            color: 'text.secondary',
            mt: 1
          }}
        >
          Please wait while system initializes
        </Typography>
      </RetroLoadingContainer>
    );
  }

  if (error) {
    return (
      <RetroLoadingContainer>
        <ErrorText>
          {typeof error === 'string' ? error : 'SYSTEM ERROR: Operation failed'}
        </ErrorText>
        {onRetry && (
          <RetroButton onClick={onRetry}>
            RETRY OPERATION
          </RetroButton>
        )}
      </RetroLoadingContainer>
    );
  }

  return children;
};

LoadingState.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onRetry: PropTypes.func,
  children: PropTypes.node.isRequired
};

export default LoadingState;
