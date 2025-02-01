import { Box, Stack, Typography, keyframes, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEntries } from '../hooks/useEntries';
import EntryForm from '../components/entries/EntryForm';
import RetroWindow from '../components/ui/RetroWindow';

const scanlineAnimation = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
`;

const staticAnimation = keyframes`
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.06; }
`;

const RetroBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: 'calc(100vh - 128px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
    backgroundSize: '100% 2px',
    animation: `${scanlineAnimation} 8s linear infinite`,
    opacity: 0.05,
    pointerEvents: 'none'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
    opacity: 0.1,
    animation: `${staticAnimation} 4s ease-in-out infinite`,
    pointerEvents: 'none'
  }
}));

const StatusText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '14px',
  color: theme.palette.primary.main,
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  textShadow: '2px 2px 0 rgba(255, 105, 180, 0.2)',
  '& span': {
    color: theme.palette.secondary.main
  }
}));

const NewEntry = () => {
  const navigate = useNavigate();
  const { createEntry } = useEntries();

  const handleClose = (success = false) => {
    navigate(success ? '/entries' : '/dashboard');
  };

  const handleSubmit = async (values) => {
    try {
      await createEntry(values);
      handleClose(true);
    } catch (error) {
      console.error('Failed to create entry:', error);
      throw error;
    }
  };

  return (
    <RetroBackground>
      <StatusText>
        SYSTEM STATUS: <span>READY FOR NEW ENTRY</span>
      </StatusText>
      <RetroWindow
        title="📝 Create New Entry"
        onClose={() => handleClose()}
        sx={{
          width: '100%',
          maxWidth: 800,
          animation: 'windowOpen 300ms cubic-bezier(0.2, 0, 0, 1.2)',
          '& .MuiBox-root': {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme => theme.gradients.crt,
              opacity: 0.05,
              pointerEvents: 'none'
            }
          }
        }}
      >
        <Stack spacing={3}>
          <Typography
            sx={{
              fontFamily: '"VT323", monospace',
              fontSize: '18px',
              color: 'text.secondary',
              textAlign: 'center',
              mb: 2,
              textShadow: '1px 1px 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            Share your thoughts and feelings in this digital time capsule
          </Typography>
          <EntryForm isPage onSubmit={handleSubmit} onClose={handleClose} />
        </Stack>
      </RetroWindow>
    </RetroBackground>
  );
};

export default NewEntry;
