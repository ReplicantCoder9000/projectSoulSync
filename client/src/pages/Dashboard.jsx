import { Box, Grid, Stack, Typography, IconButton, Menu, MenuItem, TextField, Select, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useEntries } from '../hooks/useEntries';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import MoodStats from '../components/stats/MoodStats';
import CardContainer from '../components/ui/CardContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatusChip from '../components/ui/StatusChip';
import EntryDialog from '../components/entries/EntryDialog';

const Dashboard = () => {
  const { user } = useAuth();
  const { entries, getEntries, deleteEntry, error: entriesError } = useEntries();
  const [recentEntries, setRecentEntries] = useState([]);
  const lastFetchTimeRef = useRef(null);
  const requestInFlightRef = useRef(false);
  const abortControllerRef = useRef(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const POLL_INTERVAL = 30000; // 30 seconds
  const MAX_ENTRIES = 5;

  // Filtering state
  const [sortBy, setSortBy] = useState('date');
  const [filterMood, setFilterMood] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

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
        sort: sortBy,
        order: 'desc',
        mood: filterMood !== 'all' ? filterMood : undefined,
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
  }, [isOnline, getEntries, sortBy, filterMood]);

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

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return entries?.filter(entry => {
      const matchesMood = filterMood === 'all' || entry.mood === filterMood;
      const matchesSearch = !searchTerm || 
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesMood && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
      }
      return 0;
    }) || [];
  }, [entries, filterMood, searchTerm, sortBy]);

  // Update recent entries with memoization
  const recentEntriesData = useMemo(() => {
    return filteredEntries.slice(0, MAX_ENTRIES);
  }, [filteredEntries]);

  useEffect(() => {
    setRecentEntries(recentEntriesData);
  }, [recentEntriesData]);

  // Handle menu actions
  const handleMenuOpen = (event, entryId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEntryId(entryId);
    setSelectedEntry(entries.find(e => e.id === entryId));
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEntryId(null);
    setSelectedEntry(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedEntryId) {
      await deleteEntry(selectedEntryId);
      fetchEntries();
    }
    handleMenuClose();
  };

  const handleEditDialogClose = (success) => {
    setEditDialogOpen(false);
    setSelectedEntry(null);
    if (success) {
      fetchEntries();
    }
  };

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

        {/* Filters Section */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ fontFamily: 'Courier New' }}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="mood">Mood</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Mood</InputLabel>
              <Select
                value={filterMood}
                label="Mood"
                onChange={(e) => setFilterMood(e.target.value)}
                sx={{ fontFamily: 'Courier New' }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="happy">Happy</MenuItem>
                <MenuItem value="sad">Sad</MenuItem>
                <MenuItem value="angry">Angry</MenuItem>
                <MenuItem value="anxious">Anxious</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                flexGrow: 1,
                '& .MuiInputBase-root': {
                  fontFamily: 'Courier New'
                }
              }}
            />
          </Stack>
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
                  <Box
                    key={entry.id}
                    sx={{
                      border: '1px solid #000',
                      p: 2,
                      bgcolor: '#fff',
                      fontFamily: 'Courier New',
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ 
                      borderBottom: '1px solid #000',
                      pb: 1,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box>
                        <Typography sx={{ 
                          fontFamily: 'Courier New',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}>
                          From: {user?.username}@soulsync.com
                        </Typography>
                        <Typography sx={{ 
                          fontFamily: 'Courier New',
                          fontSize: '0.875rem'
                        }}>
                          Date: {new Date(entry.date || entry.createdAt).toLocaleString()}
                        </Typography>
                        <Typography sx={{ 
                          fontFamily: 'Courier New',
                          fontSize: '0.875rem'
                        }}>
                          Subject: Mood - {entry.mood}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, entry.id)}
                          sx={{ fontFamily: 'Courier New' }}
                        >
                          ⚙️
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'Courier New',
                      fontSize: '0.875rem',
                      mb: 2
                    }}>
                      {entry.content}
                    </Typography>
                    {entry.tags?.length > 0 && (
                      <Box sx={{ 
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                        borderTop: '1px solid #000',
                        pt: 1
                      }}>
                        {entry.tags.map((tag) => (
                          <Typography
                            key={tag}
                            sx={{
                              fontFamily: 'Courier New',
                              fontSize: '0.75rem',
                              bgcolor: '#f0f0f0',
                              border: '1px solid #000',
                              px: 1,
                              borderRadius: 0
                            }}
                          >
                            {tag}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    border: '1px solid #000',
                    fontFamily: 'Courier New'
                  }}
                >
                  No entries found. Start journaling to track your mood!
                </Box>
              )}
            </Stack>
          </CardContainer>
        </Grid>
      </Grid>

      {/* Entry Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit} sx={{ fontFamily: 'Courier New' }}>
          ✏️ Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontFamily: 'Courier New', color: 'error.main' }}>
          ❌ Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <EntryDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        entry={selectedEntry}
      />
    </Box>
  );
};

export default Dashboard;
