import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Logger from '../utils/logger';
import { AppError, ErrorHandler } from '../utils/errorHandler';
import PerformanceMonitor from '../utils/performance';
import {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getMoodStats,
  clearCurrentEntry,
  clearError,
  setPage
} from '../store/slices/entriesSlice.js';

export const useEntries = () => {
  const dispatch = useDispatch();
  const {
    entries,
    currentEntry,
    moodStats,
    pagination,
    loading,
    error
  } = useSelector((state) => state.entries);

  const handleCreateEntry = useCallback(
    async (entryData) => {
      Logger.startGroup('Create Entry Operation');
      PerformanceMonitor.start('createEntry', { entryData });

      try {
        Logger.state('Create Entry Request', {
          entryData,
          timestamp: new Date().toISOString()
        });

        const result = await PerformanceMonitor.measureAsync(
          'createEntryDispatch',
          () => dispatch(createEntry(entryData)).unwrap()
        );

        Logger.state('Create Entry Success', {
          result,
          performance: PerformanceMonitor.getMetrics()
        });

        return result;
      } catch (error) {
        ErrorHandler.handle(error, {
          operation: 'createEntry',
          entryData,
          state: { entries, loading, error }
        });
        throw error;
      } finally {
        PerformanceMonitor.end('createEntry');
        Logger.endGroup();
      }
    },
    [dispatch, entries, loading, error]
  );

  const handleGetEntries = useCallback(
    async (params) => {
      Logger.startGroup('Get Entries Operation');
      PerformanceMonitor.start('getEntries', { params });

      try {
        Logger.state('Get Entries Request', {
          params,
          timestamp: new Date().toISOString()
        });

        const result = await PerformanceMonitor.measureAsync(
          'getEntriesDispatch',
          () => dispatch(getEntries(params)).unwrap()
        );

        // Validate response
        if (!result || typeof result !== 'object') {
          throw new AppError('NET_004', 'Invalid response format - not an object', { result });
        }

        if (!Array.isArray(result.entries)) {
          throw new AppError('NET_004', 'Invalid response format - entries not an array', {
            responseType: typeof result.entries,
            result
          });
        }

        Logger.state('Get Entries Success', {
          entriesCount: result.entries.length,
          pagination: result.pagination,
          performance: PerformanceMonitor.getMetrics()
        });

        return result;
      } catch (error) {
        ErrorHandler.handle(error, {
          operation: 'getEntries',
          params,
          state: { entries, loading, error }
        });
        throw error;
      } finally {
        PerformanceMonitor.end('getEntries');
        Logger.endGroup();
      }
    },
    [dispatch, entries, loading, error]
  );

  const handleGetEntry = useCallback(
    async (id) => {
      Logger.startGroup('Get Single Entry Operation');
      PerformanceMonitor.start('getEntry', { id });

      try {
        Logger.state('Get Entry Request', {
          id,
          timestamp: new Date().toISOString()
        });

        const result = await PerformanceMonitor.measureAsync(
          'getEntryDispatch',
          () => dispatch(getEntry(id)).unwrap()
        );

        Logger.state('Get Entry Success', {
          entry: result,
          performance: PerformanceMonitor.getMetrics()
        });

        return result;
      } catch (error) {
        ErrorHandler.handle(error, {
          operation: 'getEntry',
          entryId: id,
          state: { currentEntry, loading, error }
        });
        return false;
      } finally {
        PerformanceMonitor.end('getEntry');
        Logger.endGroup();
      }
    },
    [dispatch, currentEntry, loading, error]
  );

  const handleUpdateEntry = useCallback(
    async (id, entryData) => {
      Logger.startGroup('Update Entry Operation');
      PerformanceMonitor.start('updateEntry', { id, entryData });

      try {
        Logger.state('Update Entry Request', {
          id,
          entryData,
          timestamp: new Date().toISOString()
        });

        const result = await PerformanceMonitor.measureAsync(
          'updateEntryDispatch',
          () => dispatch(updateEntry({ id, entryData })).unwrap()
        );

        Logger.state('Update Entry Success', {
          result,
          performance: PerformanceMonitor.getMetrics()
        });

        return result;
      } catch (error) {
        ErrorHandler.handle(error, {
          operation: 'updateEntry',
          entryId: id,
          entryData,
          state: { currentEntry, loading, error }
        });
        return false;
      } finally {
        PerformanceMonitor.end('updateEntry');
        Logger.endGroup();
      }
    },
    [dispatch, currentEntry, loading, error]
  );

  const handleDeleteEntry = useCallback(
    async (id) => {
      Logger.startGroup('Delete Entry Operation');
      PerformanceMonitor.start('deleteEntry', { id });

      try {
        Logger.state('Delete Entry Request', {
          id,
          timestamp: new Date().toISOString()
        });

        await PerformanceMonitor.measureAsync(
          'deleteEntryDispatch',
          () => dispatch(deleteEntry(id)).unwrap()
        );

        Logger.state('Delete Entry Success', {
          entryId: id,
          performance: PerformanceMonitor.getMetrics()
        });

        return true;
      } catch (error) {
        ErrorHandler.handle(error, {
          operation: 'deleteEntry',
          entryId: id,
          state: { entries, loading, error }
        });
        return false;
      } finally {
        PerformanceMonitor.end('deleteEntry');
        Logger.endGroup();
      }
    },
    [dispatch, entries, loading, error]
  );

  const handleGetMoodStats = useCallback(
    async (params) => {
      Logger.startGroup('Get Mood Stats Operation');
      PerformanceMonitor.start('getMoodStats', { params });

      try {
        Logger.state('Get Mood Stats Request', {
          params,
          timestamp: new Date().toISOString()
        });

        const result = await PerformanceMonitor.measureAsync(
          'getMoodStatsDispatch',
          () => dispatch(getMoodStats(params)).unwrap()
        );

        Logger.state('Get Mood Stats Success', {
          stats: result,
          performance: PerformanceMonitor.getMetrics()
        });

        return result;
      } catch (error) {
        ErrorHandler.handle(error, {
          operation: 'getMoodStats',
          params,
          state: { moodStats, loading, error }
        });
        return false;
      } finally {
        PerformanceMonitor.end('getMoodStats');
        Logger.endGroup();
      }
    },
    [dispatch, moodStats, loading, error]
  );

  const handleClearCurrentEntry = useCallback(() => {
    dispatch(clearCurrentEntry());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetPage = useCallback(
    (page) => {
      dispatch(setPage(page));
    },
    [dispatch]
  );

  return {
    entries,
    currentEntry,
    moodStats,
    pagination,
    loading,
    error,
    createEntry: handleCreateEntry,
    getEntries: handleGetEntries,
    getEntry: handleGetEntry,
    updateEntry: handleUpdateEntry,
    deleteEntry: handleDeleteEntry,
    getMoodStats: handleGetMoodStats,
    clearCurrentEntry: handleClearCurrentEntry,
    clearError: handleClearError,
    setPage: handleSetPage
  };
};
