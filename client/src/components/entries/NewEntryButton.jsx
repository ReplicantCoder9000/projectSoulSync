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
          boxShadow: (theme) => theme.shadows.medium,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.dark,
            boxShadow: (theme) => theme.shadows.medium
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
