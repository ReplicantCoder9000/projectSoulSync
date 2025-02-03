import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import { useEntries } from '../../hooks/useEntries';

const EntryDialog = ({ open, onClose, entry }) => {
  const { updateEntry } = useEntries();
  const [formData, setFormData] = useState({
    content: '',
    mood: '',
    tags: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        content: entry.content || '',
        mood: entry.mood || '',
        tags: entry.tags?.join(', ') || ''
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      await updateEntry(entry.id, {
        ...formData,
        tags
      });
      onClose(true); // true indicates successful update
    } catch (error) {
      setError(error.message || 'Failed to update entry');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          fontFamily: 'Courier New',
          '& .MuiDialogTitle-root': {
            borderBottom: '1px solid #000',
            bgcolor: '#f0f0f0',
            fontFamily: 'Courier New'
          }
        }
      }}
    >
      <DialogTitle>
        📝 Edit Entry
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Mood</InputLabel>
            <Select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              sx={{ fontFamily: 'Courier New' }}
            >
              <MenuItem value="happy">Happy 😊</MenuItem>
              <MenuItem value="sad">Sad 😢</MenuItem>
              <MenuItem value="angry">Angry 😠</MenuItem>
              <MenuItem value="anxious">Anxious 😰</MenuItem>
              <MenuItem value="neutral">Neutral 😐</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="content"
            label="Content"
            multiline
            rows={4}
            value={formData.content}
            onChange={handleChange}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'Courier New'
              }
            }}
          />

          <TextField
            name="tags"
            label="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
            placeholder="happy, productive, family"
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'Courier New'
              }
            }}
          />

          {error && (
            <Typography color="error" sx={{ fontFamily: 'Courier New' }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        borderTop: '1px solid #000',
        bgcolor: '#f0f0f0',
        p: 2
      }}>
        <Button 
          onClick={() => onClose(false)}
          sx={{ 
            fontFamily: 'Courier New',
            border: '1px solid #000',
            color: '#000',
            '&:hover': {
              bgcolor: '#e0e0e0'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{ 
            fontFamily: 'Courier New',
            border: '1px solid #000',
            bgcolor: '#000',
            color: '#fff',
            '&:hover': {
              bgcolor: '#333'
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntryDialog;
