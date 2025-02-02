import { Box, Grid, Stack, Typography } from '@mui/material';
import { useEntries } from '../hooks/useEntries';
import { useEffect, useState } from 'react';
import Logger from '../utils/logger';
import { AppError, ErrorHandler } from '../utils/errorHandler';
import PerformanceMonitor from '../utils/performance';
import CardContainer from '../components/ui/CardContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatusChip from '../components/ui/StatusChip';
import LoadingState from '../components/ui/LoadingState';

const Entries = () => {
  const { entries = [], loading, error, getEntries } = useEntries();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchEntries = async () => {
      Logger.startGroup('Entries Component: Fetch Operation');
      PerformanceMonitor.start('fetchEntries', { retryCount });

      try {
        // Token validation with detailed logging
        const token = localStorage.getItem('token');
        if (!token) {
          throw new AppError('AUTH_001', 'No authentication token found', {
            component: 'Entries',
            operation: 'fetchEntries'
          });
        }

        // Verify token format
        try {
          const [header, payload, signature] = token.split('.');
          Logger.state('Token Validation', {
            hasHeader: !!header,
            hasPayload: !!payload,
            hasSignature: !!signature,
            tokenLength: token.length,
            expiryTime: JSON.parse(atob(payload)).exp
          });
        } catch (error) {
          throw new AppError('AUTH_002', 'Invalid token format', {
            token: token ? `${token.substring(0, 10)}...` : 'null',
            error: error.message
          });
        }

        Logger.state('Fetch Entries Request', {
          retryCount,
          maxRetries,
          isOnline: navigator.onLine,
          timestamp: new Date().toISOString()
        });

        // Fetch entries with performance tracking
        const result = await PerformanceMonitor.measureAsync(
          'getEntriesAPI',
          () => getEntries({
            page: 1,
            limit: 50,
            sort: 'date',
            order: 'desc',
            timestamp: Date.now()
          })
        );

        // Validate response structure
        if (!result || typeof result !== 'object') {
          throw new AppError('NET_004', 'Invalid response format - not an object', { result });
        }

        if (!Array.isArray(result.entries)) {
          throw new AppError('NET_004', 'Invalid response format - entries not an array', {
            responseType: typeof result.entries,
            result
          });
        }

        Logger.state('Fetch Success', {
          entriesCount: result.entries.length,
          pagination: result.pagination,
          firstEntryId: result.entries[0]?.id,
          lastEntryId: result.entries[result.entries.length - 1]?.id,
          performance: PerformanceMonitor.getMetrics()
        });

        // Reset retry count on success
        setRetryCount(0);

      } catch (error) {
        const errorDetails = ErrorHandler.handle(error, {
          component: 'Entries',
          operation: 'fetchEntries',
          retryCount,
          maxRetries,
          state: { entriesCount: entries.length, loading, error }
        });

        // Handle authentication errors
        if (error.code === 'AUTH_001' || error.code === 'AUTH_002' || error.response?.status === 401) {
          Logger.error('Authentication Error', error, { errorDetails });
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }

        // Handle network errors with retry logic
        if (!error.response || error.code === 'ECONNABORTED' || error.name === 'NetworkError') {
          if (retryCount < maxRetries) {
            Logger.state('Retry Attempt', {
              attempt: retryCount + 1,
              maxRetries,
              error: error.message
            });
            setRetryCount(prev => prev + 1);
            return; // useEffect will re-run due to retryCount change
          }
        }

        throw error;
      } finally {
        PerformanceMonitor.end('fetchEntries');
        Logger.endGroup();
      }
    };

    fetchEntries().catch(error => {
      ErrorHandler.handle(error, {
        component: 'Entries',
        operation: 'fetchEntries',
        fatal: true,
        retryCount
      });
    });

    return () => {
      Logger.state('Component Cleanup', {
        component: 'Entries',
        timestamp: new Date().toISOString()
      });
    };
  }, [getEntries, retryCount, entries, loading, error, maxRetries]);

  Logger.component('Entries', {
    loading,
    entriesCount: entries?.length || 0,
    error,
    retryCount,
    maxRetries,
    authToken: !!localStorage.getItem('token'),
    performance: PerformanceMonitor.getMetrics()
  });

  if (loading) {
    console.log('Entries Page: Showing loading state');
    return (
      <Box sx={{ p: 3 }}>
        <LoadingState />
      </Box>
    );
  }

  if (error) {
    console.error('Entries Page: Error state:', error);
    return (
      <Box
        sx={{
          textAlign: 'center',
          color: 'error.main',
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Entries
        </Typography>
        <Typography color="error.main">
          {error.message || 'Unknown error. Please try again.'}
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
              action={
                <StatusChip
                  label={`${entries.length} Total`}
                  variant="outlined"
                  size="small"
                  type="tag"
                />
              }
            />
            <Stack spacing={2}>
              {entries.length > 0 ? (
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
