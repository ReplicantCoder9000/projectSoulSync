import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
      try {
        const result = await dispatch(createEntry(entryData)).unwrap();
        return result;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleGetEntries = useCallback(
    async (params) => {
      try {
        await dispatch(getEntries(params)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleGetEntry = useCallback(
    async (id) => {
      try {
        const result = await dispatch(getEntry(id)).unwrap();
        return result;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleUpdateEntry = useCallback(
    async (id, entryData) => {
      try {
        const result = await dispatch(updateEntry({ id, entryData })).unwrap();
        return result;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleDeleteEntry = useCallback(
    async (id) => {
      try {
        await dispatch(deleteEntry(id)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleGetMoodStats = useCallback(
    async (params) => {
      try {
        const result = await dispatch(getMoodStats(params)).unwrap();
        return result;
      } catch {
        return false;
      }
    },
    [dispatch]
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
