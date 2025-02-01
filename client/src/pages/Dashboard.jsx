import { Box, Grid, Stack } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useEntries } from '../hooks/useEntries';
import { useState, useEffect } from 'react';
import NewEntryButton from '../components/entries/NewEntryButton';
import EntryForm from '../components/entries/EntryForm';
import MoodStats from '../components/stats/MoodStats';
import CardContainer from '../components/ui/CardContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatusChip from '../components/ui/StatusChip';

const Dashboard = () => {
  const { user } = useAuth();
  const { entries, getEntries } = useEntries();
  const [recentEntries, setRecentEntries] = useState([]);
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);

  // Fetch entries initially and set up polling
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        await getEntries();
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      }
    };

    // Initial fetch
    fetchEntries();

    // Set up polling every 30 seconds
    const pollInterval = setInterval(fetchEntries, 30000);

    // Cleanup function to clear interval
    return () => clearInterval(pollInterval);
  }, []); // Remove getEntries from dependencies to prevent unnecessary re-renders

  // Update recent entries when entries change
  useEffect(() => {
    if (entries?.length) {
      setRecentEntries(entries.slice(0, 5));
    } else {
      setRecentEntries([]);
    }
  }, [entries]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <CardContainer
            sx={{
              background: (theme) =>
                `linear-gradient(to right, ${theme.palette.primary[100]}, ${theme.palette.secondary[100]})`,
              mb: 4
            }}
          >
            <SectionHeader
              title={`Welcome back, ${user?.username}!`}
              subtitle="Track your mood and journal your thoughts. Your mental well-being matters."
              sx={{ color: 'text.primary' }}
            />
          </CardContainer>
        </Grid>

        {/* Stats Section */}
        <Grid item xs={12}>
          <MoodStats entries={entries || []} />
        </Grid>

        {/* Recent Entries */}
        <Grid item xs={12}>
          <CardContainer>
            <SectionHeader
              title="Recent Entries"
              action={
                <StatusChip
                  label={`${entries?.length || 0} Total`}
                  variant="outlined"
                  size="small"
                />
              }
            />
            <Stack spacing={2}>
              {recentEntries.length > 0 ? (
                recentEntries.map((entry) => (
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
                        <StatusChip
                          label={entry.mood}
                          type="mood"
                          size="small"
                        />
                        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          {new Date(entry.createdAt).toLocaleDateString()}
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
                  Start journaling your first entry to track your mood!
                </Box>
              )}
            </Stack>
          </CardContainer>
        </Grid>
      </Grid>

      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24
        }}
      >
        <NewEntryButton onClick={() => setIsEntryFormOpen(true)} />
      </Box>
      <EntryForm open={isEntryFormOpen} onClose={() => setIsEntryFormOpen(false)} />
    </Box>
  );
};

export default Dashboard;
