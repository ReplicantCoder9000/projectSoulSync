import { Box, Grid, Stack, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useEntries } from '../hooks/useEntries';
import { useState, useEffect, useMemo } from 'react';
import MoodStats from '../components/stats/MoodStats';
import CardContainer from '../components/ui/CardContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatusChip from '../components/ui/StatusChip';

const Dashboard = () => {
  const { user } = useAuth();
  const { entries, getEntries, error: entriesError } = useEntries();
  const [recentEntries, setRecentEntries] = useState([]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const POLL_INTERVAL = 30000; // 30 seconds
  const MAX_ENTRIES = 5;

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch entries with smart polling
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        if (!isOnline) {
          console.log('Dashboard: Skipping fetch - offline');
          return;
        }

        // Check if enough time has passed since last fetch
        const now = Date.now();
        if (lastFetchTime && now - lastFetchTime < POLL_INTERVAL) {
          console.log('Dashboard: Skipping fetch - too soon');
          return;
        }

        console.log('Dashboard: Fetching entries');
        await getEntries({
          limit: MAX_ENTRIES,
          sort: 'date',
          order: 'desc'
        });
        setLastFetchTime(now);
      } catch (error) {
        console.error('Dashboard: Failed to fetch entries:', {
          message: error.message,
          status: error.response?.status
        });
      }
    };

    // Initial fetch
    fetchEntries();

    // Set up polling
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchEntries();
      }
    }, POLL_INTERVAL);

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEntries();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [getEntries, isOnline, lastFetchTime]);

  // Update recent entries with memoization
  const recentEntriesData = useMemo(() => {
    return entries?.slice(0, MAX_ENTRIES) || [];
  }, [entries]);

  useEffect(() => {
    setRecentEntries(recentEntriesData);
  }, [recentEntriesData]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <CardContainer
            sx={{
              background: (theme) =>
                `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
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
          {entriesError ? (
            <CardContainer>
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'error.main',
                  p: 3
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Error Loading Stats
                </Typography>
                <Typography>
                  {entriesError.message || 'Failed to load mood statistics. Please try again.'}
                </Typography>
              </Box>
            </CardContainer>
          ) : (
            <MoodStats entries={entries || []} />
          )}
        </Grid>

        {/* Recent Entries */}
        <Grid item xs={12}>
          <CardContainer>
            {!isOnline && (
              <Box
                sx={{
                  bgcolor: 'warning.light',
                  color: 'warning.dark',
                  p: 1,
                  mb: 2,
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2">
                  You are currently offline. Some features may be limited.
                </Typography>
              </Box>
            )}
            <SectionHeader
              title="Recent Entries"
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
                          {new Date(entry.date || entry.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
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

    </Box>
  );
};

export default Dashboard;
