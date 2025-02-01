import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEntries } from '../../hooks/useEntries';
import PropTypes from 'prop-types';
import ActionButton from '../ui/ActionButton';
import StatusChip from '../ui/StatusChip';

const validationSchema = yup.object({
  mood: yup.string().required('Please select a mood'),
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  tags: yup.string()
});

const moods = [
  'happy',
  'sad',
  'angry',
  'anxious',
  'neutral',
  'excited',
  'peaceful'
];

const EntryForm = ({ open, onClose }) => {
  const { createEntry } = useEntries();

  const formik = useFormik({
    initialValues: {
      mood: '',
      title: '',
      content: '',
      tags: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const tags = values.tags
          ? values.tags.split(',').map(tag => tag.trim())
          : [];
        await createEntry({ ...values, tags });
        resetForm();
        onClose();
      } catch (error) {
        console.error('Failed to create entry:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'text.primary',
          pb: 1
        }}
      >
        New Journal Entry
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Box sx={{ mb: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
              How are you feeling?
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {moods.map((mood) => (
                <StatusChip
                  key={mood}
                  label={mood}
                  type="mood"
                  variant={formik.values.mood === mood ? 'filled' : 'outlined'}
                  onClick={() => formik.setFieldValue('mood', mood)}
                  size="small"
                />
              ))}
            </Stack>
            {formik.touched.mood && formik.errors.mood && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                {formik.errors.mood}
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <TextField
            fullWidth
            label="Content"
            name="content"
            multiline
            rows={4}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
          />

          <TextField
            fullWidth
            label="Tags (comma-separated)"
            name="tags"
            value={formik.values.tags}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tags && Boolean(formik.errors.tags)}
            helperText={
              (formik.touched.tags && formik.errors.tags) ||
              'Add tags to categorize your entry (e.g., work, family, health)'
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <ActionButton
          variant="outlined"
          color="inherit"
          onClick={handleClose}
          sx={{ mr: 1 }}
        >
          Cancel
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={formik.handleSubmit}
          loading={formik.isSubmitting}
        >
          Save Entry
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};

EntryForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default EntryForm;
