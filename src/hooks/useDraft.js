
// hooks/useDraft.js
import { useState, useEffect, useCallback } from 'react';

export const useDraft = (initialData, draftKey, options = {}) => {
  const {
    debounceDelay = 1000,
    autoSave = true,
    onSaveSuccess,
    onSaveError
  } = options;

  const [data, setData] = useState(() => {
    // Try to load from localStorage first
    const savedDraft = localStorage.getItem(draftKey);
    return savedDraft ? JSON.parse(savedDraft) : initialData;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save when data changes (with debounce)
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    const timer = setTimeout(() => {
      saveDraft();
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [data, debounceDelay, isDirty]);

  // Track changes
  const updateData = useCallback((newData) => {
    setData(prev => {
      const updated = typeof newData === 'function' ? newData(prev) : newData;
      setIsDirty(true);
      setHasUnsavedChanges(true);
      return updated;
    });
  }, []);

  // Save draft to localStorage
  const saveDraft = useCallback(async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      localStorage.setItem(draftKey, JSON.stringify(data));
      setLastSaved(new Date());
      setIsDirty(false);
      
      if (onSaveSuccess) onSaveSuccess(data);
    } catch (error) {
      console.error('Failed to save draft:', error);
      if (onSaveError) onSaveError(error);
    } finally {
      setIsSaving(false);
    }
  }, [data, draftKey, isDirty, onSaveSuccess, onSaveError]);

  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
    setData(initialData);
    setIsDirty(false);
    setHasUnsavedChanges(false);
    setLastSaved(null);
  }, [draftKey, initialData]);

  // Load draft from storage
  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setData(JSON.parse(savedDraft));
      setHasUnsavedChanges(true);
      return true;
    }
    return false;
  }, [draftKey]);

  return {
    data,
    setData: updateData,
    saveDraft,
    clearDraft,
    loadDraft,
    isDirty,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges
  };
};