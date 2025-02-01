import { Box, CircularProgress, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingState = ({ loading = false, error = null, onRetry = null, children }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          gap: 2
        }}
      >
        <Typography color="error" gutterBottom>
          {typeof error === 'string' ? error : 'An error occurred'}
        </Typography>
        {onRetry && (
          <Button variant="contained" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </Box>
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
