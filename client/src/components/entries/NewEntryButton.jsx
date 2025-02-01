import { Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const NewEntryButton = ({ onClick }) => {
  return (
    <Tooltip title="Add New Entry" placement="left">
      <Fab
        color="primary"
        aria-label="add entry"
        onClick={onClick}
        sx={{
          width: 56,
          height: 56,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.dark,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }
        }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

NewEntryButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default NewEntryButton;
