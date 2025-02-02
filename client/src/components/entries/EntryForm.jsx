import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Box,
  Typography,
  styled,
  keyframes
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEntries } from '../../hooks/useEntries';
import PropTypes from 'prop-types';
import ActionButton from '../ui/ActionButton';

const validationSchema = yup.object({
  mood: yup.string().required('Please select a mood'),
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  tags: yup.string()
});

const moods = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'peaceful', emoji: '😌', label: 'Peaceful' }
];

const glowAnimation = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 105, 180, 0.3),
                0 0 10px rgba(255, 105, 180, 0.2),
                0 0 15px rgba(255, 105, 180, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(255, 105, 180, 0.4),
                0 0 20px rgba(255, 105, 180, 0.3),
                0 0 30px rgba(255, 105, 180, 0.2);
  }
`;

const RetroTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid',
    borderColor: theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
    boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderWidth: 0
    },
    '&:hover': {
      transform: 'translateY(-1px)',
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused': {
      borderColor: theme.palette.secondary.main,
      boxShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 0
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '20px',
    color: theme.palette.primary.main
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '16px',
    marginTop: '8px'
  }
}));

const MoodBox = styled(Box)(({ theme, selected }) => ({
  cursor: 'pointer',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: '2px solid',
  borderColor: selected ? theme.palette.primary.main : theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
  backgroundColor: selected ? 'rgba(255, 105, 180, 0.1)' : theme.palette.background.paper,
  boxShadow: selected ? '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)' : 'none',
  transition: 'all 0.2s ease-in-out',
  animation: selected ? `${glowAnimation} 2s infinite` : 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(255, 105, 180, 0.05)'
  }
}));

const EntryForm = ({ open, onClose, isPage = false, onSubmit }) => {
  const { createEntry } = useEntries();

  const formik = useFormik({
    initialValues: {
      mood: '',
      title: '',
      content: '',
      tags: ''
    },
    validationSchema,
  onSubmit: async (values, { setSubmitting, resetForm, setFieldError, setStatus }) => {
    try {
      // Validate required fields
      if (!values.mood) {
        setFieldError('mood', 'Please select a mood');
        return;
      }
      if (!values.title) {
        setFieldError('title', 'Title is required');
        return;
      }
      if (!values.content) {
        setFieldError('content', 'Content is required');
        return;
      }

      const tags = values.tags
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const entryData = {
        title: values.title,
        content: values.content,
        mood: values.mood,
        tags,
        date: new Date()
      };
      
      console.log('Submitting entry:', entryData);
      
      if (isPage && onSubmit) {
        await onSubmit(entryData);
        onClose(true);
      } else {
        const result = await createEntry(entryData);
        console.log('Entry creation result:', result);
        
        if (result && result.entry) {
          console.log('Entry created successfully:', result.entry);
          resetForm();
          onClose();
        } else {
          console.error('Invalid entry creation response:', result);
          setStatus({ error: 'Failed to create entry. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Failed to create entry:', error);
      setStatus({ 
        error: error.response?.data?.error || error.message || 'Failed to create entry. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    formik.setErrors({});
    onClose();
  };

  const formContent = (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3} sx={{ mt: 1 }}>
        <Box>
          <Typography
            sx={{
              mb: 2,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '14px',
              color: 'primary.main',
              textAlign: 'center',
              textShadow: '2px 2px 0 rgba(255, 105, 180, 0.2)'
            }}
          >
            HOW ARE YOU FEELING TODAY?
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            {moods.map((mood) => (
              <MoodBox
                key={mood.value}
                onClick={() => formik.setFieldValue('mood', mood.value)}
                selected={formik.values.mood === mood.value}
              >
                <Stack spacing={1} alignItems="center">
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: '32px',
                      filter: formik.values.mood === mood.value ? 'drop-shadow(0 0 5px rgba(255, 105, 180, 0.5))' : 'none'
                    }}
                  >
                    {mood.emoji}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"VT323", monospace',
                      fontSize: '16px',
                      color: formik.values.mood === mood.value ? 'primary.main' : 'text.secondary',
                      textShadow: formik.values.mood === mood.value ? '1px 1px 0 rgba(255, 105, 180, 0.2)' : 'none'
                    }}
                  >
                    {mood.label}
                  </Typography>
                </Stack>
              </MoodBox>
            ))}
          </Stack>
          {formik.touched.mood && formik.errors.mood && (
            <Typography
              sx={{
                color: 'error.main',
                fontFamily: '"VT323", monospace',
                fontSize: '16px',
                textAlign: 'center',
                mb: 2
              }}
            >
              ⚠️ {formik.errors.mood}
            </Typography>
          )}
        </Box>

        <RetroTextField
          fullWidth
          id="entry-title"
          label="Entry Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          margin="normal"
          inputProps={{
            'aria-label': 'Entry Title',
            id: 'entry-title-input',
            name: 'title'
          }}
        />

        <RetroTextField
          fullWidth
          id="entry-content"
          label="Your Thoughts"
          name="content"
          multiline
          rows={6}
          value={formik.values.content}
          onChange={(e) => {
            formik.setFieldValue('content', e.target.value);
            formik.setFieldTouched('content', true, false);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.content && Boolean(formik.errors.content)}
          helperText={formik.touched.content && formik.errors.content}
          margin="normal"
          inputProps={{
            'aria-label': 'Entry Content',
            id: 'entry-content-input',
            name: 'content'
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#FFFFFF',
              '& textarea': {
                fontFamily: '"VT323", monospace',
                fontSize: '16px',
                lineHeight: '1.5'
              }
            }
          }}
        />

        <RetroTextField
          fullWidth
          id="entry-tags"
          label="Tags"
          name="tags"
          value={formik.values.tags}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tags && Boolean(formik.errors.tags)}
          helperText={
            (formik.touched.tags && formik.errors.tags) ||
            '🏷️ Add tags to categorize your entry (e.g., work, family, health)'
          }
          margin="normal"
          inputProps={{
            'aria-label': 'Entry Tags',
            id: 'entry-tags-input',
            name: 'tags'
          }}
        />
      </Stack>
    </form>
  );

  if (isPage) {
    return (
      <Box>
        {formContent}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <ActionButton
            variant="outlined"
            color="primary"
            onClick={() => onClose()}
            sx={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '12px'
            }}
          >
            CANCEL
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={formik.handleSubmit}
            loading={formik.isSubmitting}
            sx={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '12px',
              background: (theme) => theme.gradients.neon,
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
              '&:hover': {
                background: (theme) => theme.gradients.electric,
                transform: 'translateY(-2px)',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)'
              }
            }}
          >
            {formik.isSubmitting ? 'SAVING...' : 'SAVE ENTRY'}
          </ActionButton>
        </Stack>
      </Box>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '16px',
          color: 'primary.main',
          textAlign: 'center',
          pb: 1,
          textShadow: '2px 2px 0 rgba(255, 105, 180, 0.2)'
        }}
      >
        New Journal Entry
      </DialogTitle>
      <DialogContent>
        {formContent}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <ActionButton
          variant="outlined"
          color="inherit"
          onClick={handleClose}
          sx={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            mr: 1
          }}
        >
          CANCEL
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={formik.handleSubmit}
          loading={formik.isSubmitting}
          sx={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            background: (theme) => theme.gradients.neon,
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
            '&:hover': {
              background: (theme) => theme.gradients.electric,
              transform: 'translateY(-2px)',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)'
            }
          }}
        >
          {formik.isSubmitting ? 'SAVING...' : 'SAVE ENTRY'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};

EntryForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  isPage: PropTypes.bool,
  onSubmit: PropTypes.func
};

export default EntryForm;
