import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useEntries } from '../hooks/useEntries';
import CardContainer from '../components/ui/CardContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatusChip from '../components/ui/StatusChip';

const Entries = () => {
  const { entries, getEntries, error: entriesError } = useEntries();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        await getEntries();
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [getEntries]);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading entries...</Typography>
      </Box>
    );
  }

  if (entriesError) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
        <Typography>
          {entriesError.message || 'Failed to load entries. Please try again.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardContainer>
            <SectionHeader
              title="Journal Entries"
              subtitle="Your complete mood journey"
              action={
                <StatusChip
                  label={`${entries?.length || 0} Total`}
                  variant="outlined"
                  size="small"
                  type="tag"
                />
              }
            />
            <Grid container spacing={2}>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <Grid item xs={12} key={entry.id}>
                    <CardContainer
                      elevation={0}
                      sx={{
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <StatusChip
                            label={entry.mood}
                            type="mood"
                            size="small"
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            {new Date(entry.date || entry.createdAt).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: 'text.primary',
                            fontSize: '0.875rem',
                            lineHeight: 1.6
                          }}
                        >
                          {entry.content}
                        </Typography>
                      </Box>
                      {entry.tags?.length > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap'
                          }}
                        >
                          {entry.tags.map((tag) => (
                            <StatusChip
                              key={tag}
                              label={tag}
                              type="tag"
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </CardContainer>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      color: 'text.secondary',
                      py: 6,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography>
                      No entries yet. Start journaling to track your mood!
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Entries;
