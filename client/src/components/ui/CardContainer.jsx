import { Paper, Box } from '@mui/material';
import PropTypes from 'prop-types';

const CardContainer = ({
  children,
  elevation = 0,
  border = true,
  accent = false,
  sx = {},
  ...props
}) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: border ? '1px solid' : 'none',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        ...sx
      }}
      {...props}
    >
      {accent && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            bgcolor: 'primary.main'
          }}
        />
      )}
      {children}
    </Paper>
  );
};

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  elevation: PropTypes.number,
  border: PropTypes.bool,
  accent: PropTypes.bool,
  sx: PropTypes.object
};

export default CardContainer;
