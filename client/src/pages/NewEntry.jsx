import { Box, Stack } from '@mui/material';
import ActionButton from '../components/ui/ActionButton';
import { useNavigate } from 'react-router-dom';
import EntryForm from '../components/entries/EntryForm';
import SectionHeader from '../components/ui/SectionHeader';
import CardContainer from '../components/ui/CardContainer';
import { Edit as EditIcon } from '@mui/icons-material';

const NewEntry = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <Box>
      <CardContainer>
        <SectionHeader
          title="New Journal Entry"
          subtitle="Record your thoughts and feelings. Take a moment to reflect on your day."
          icon={EditIcon}
        />
        <Box sx={{ mt: 3 }}>
          <EntryForm isPage />
        </Box>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <ActionButton
            variant="outlined"
            color="inherit"
            onClick={handleClose}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={() => {
              // The form will handle its own submission
              handleClose();
            }}
          >
            Save Entry
          </ActionButton>
        </Stack>
      </CardContainer>
    </Box>
  );
};

export default NewEntry;
