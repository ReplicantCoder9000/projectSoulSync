import { Box, Grid, Stack, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useEntries } from '../hooks/useEntries';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import MoodStats from '../components/stats/MoodStats';
import CardContainer from '../components/ui/CardContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatusChip from '../components/ui/StatusChip';

const Dashboard = () => {
  const { user } = useAuth();
  const { entries, getEntries, error: entriesError } = useEntries();
  const [recentEntries, setRecentEntries] = useState([]);
  const lastFetchTimeRef = useRef(null);
  const requestInFlightRef = useRef(false);
  const abortControllerRef = useRef(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
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
  const fetchEntries = useCallback(async () => {
    if (requestInFlightRef.current) {
      console.log('Dashboard: Skipping fetch - request in flight');
      return;
    }

    if (!isOnline) {
      console.log('Dashboard: Skipping fetch - offline');
      return;
    }

    // Check if enough time has passed since last fetch
    const now = Date.now();
    if (lastFetchTimeRef.current && now - lastFetchTimeRef.current < POLL_INTERVAL) {
      console.log('Dashboard: Skipping fetch - too soon');
      return;
    }

    try {
      requestInFlightRef.current = true;

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      console.log('Dashboard: Fetching entries');
      await getEntries({
        limit: MAX_ENTRIES,
        sort: 'date',
        order: 'desc',
        signal: abortControllerRef.current.signal
      });

      lastFetchTimeRef.current = Date.now();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Dashboard: Request aborted');
        return;
      }
      console.error('Dashboard: Failed to fetch entries:', {
        message: error.message,
        status: error.response?.status
      });
    } finally {
      requestInFlightRef.current = false;
    }
  }, [isOnline, getEntries]);

  useEffect(() => {
    let pollTimeout = null;
    let visibilityTimeout = null;

    const schedulePoll = () => {
      if (pollTimeout) clearTimeout(pollTimeout);

      if (document.visibilityState === 'visible' && isOnline) {
        pollTimeout = setTimeout(() => {
          fetchEntries().then(() => schedulePoll());
        }, POLL_INTERVAL);
      }
    };

    // Initial fetch only if conditions are met
    if (document.visibilityState === 'visible' && isOnline) {
      fetchEntries();
    }

    schedulePoll();

    // Visibility change handler with debounce
    const handleVisibilityChange = () => {
      if (visibilityTimeout) clearTimeout(visibilityTimeout);

      visibilityTimeout = setTimeout(() => {
        if (document.visibilityState === 'visible' && isOnline) {
          fetchEntries().then(() => schedulePoll());
        } else {
          if (pollTimeout) clearTimeout(pollTimeout);
        }
      }, 300); // Debounce visibility changes
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (pollTimeout) clearTimeout(pollTimeout);
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchEntries, isOnline]);

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
