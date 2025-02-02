import { Box, Grid, Stack } from '@mui/material';
import { useEntries } from '../hooks/useEntries';
import { useEffect } from 'react';
import CardContainer from '../components/ui/CardContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatusChip from '../components/ui/StatusChip';
import LoadingState from '../components/ui/LoadingState';

const Entries = () => {
  const { entries, loading, getEntries } = useEntries();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        await getEntries();
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      }
    };

    fetchEntries();
  }, [getEntries]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardContainer>
            <SectionHeader
              title="Journal Entries"
              action={
                <StatusChip
                  label={`${entries?.length || 0} Total`}
                  variant="outlined"
                  size="small"
                  type="tag"
                />
              }
            />
            <Stack spacing={2}>
              {entries?.length > 0 ? (
                entries.map((entry) => (
                  <CardContainer
                    key={entry.id}
                    elevation={0}
                    sx={{
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <StatusChip
                            label={entry.mood}
                            type="mood"
                            size="small"
                          />
                          <Box sx={{ color: 'text.primary', fontWeight: 500 }}>
                            {entry.title}
                          </Box>
                        </Box>
                        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          {new Date(entry.date).toLocaleDateString()}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          color: 'text.primary',
                          fontSize: '0.875rem',
                          lineHeight: 1.6
                        }}
                      >
                        {entry.content}
                      </Box>
                      {entry.tags?.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {entry.tags.map((tag) => (
                            <StatusChip
                              key={tag}
                              label={tag}
                              type="tag"
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </CardContainer>
                ))
              ) : (
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
                  No entries found. Start journaling to track your mood!
                </Box>
              )}
            </Stack>
          </CardContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Entries;
