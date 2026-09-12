import { useState, useEffect } from 'react';
import { getAutoDetectedSeason } from '../data/seasons';
import { DEFAULT_SOIL } from '../data/soils';
import { DEFAULT_STATE } from '../data/states';

const STORAGE_KEY = 'kisanmitra_farmer_context_v1';

export function useFarmerContext() {
  const [context, setContext] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load farmer context from localStorage', e);
    }
    return {
      state: DEFAULT_STATE,
      soilType: DEFAULT_SOIL,
      season: getAutoDetectedSeason(),
      farmerName: 'Kisan Bhai',
      language: 'hinglish', // 'hinglish' | 'hi' | 'en' | 'pa' | 'mr' | 'gu'
      hasSelectedLanguage: false,
      claudeApiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
      hfApiKey: import.meta.env.VITE_HF_API_KEY || '',
      hasCompletedOnboarding: false,
      landArea: '2-5 Acres'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    } catch (e) {
      console.warn('Failed to persist farmer context', e);
    }
  }, [context]);

  const updateContext = (updates) => {
    setContext((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const selectLanguage = (lang) => {
    setContext((prev) => ({
      ...prev,
      language: lang,
      hasSelectedLanguage: true
    }));
  };

  const resetLanguage = () => {
    setContext((prev) => ({
      ...prev,
      hasSelectedLanguage: false
    }));
  };

  const completeOnboarding = (data) => {
    setContext((prev) => ({
      ...prev,
      ...data,
      hasCompletedOnboarding: true
    }));
  };

  const resetOnboarding = () => {
    setContext((prev) => ({
      ...prev,
      hasCompletedOnboarding: false
    }));
  };

  const updateApiKeys = (claudeKey, hfKey) => {
    setContext((prev) => ({
      ...prev,
      claudeApiKey: claudeKey.trim(),
      hfApiKey: hfKey.trim()
    }));
  };

  return {
    context,
    updateContext,
    selectLanguage,
    resetLanguage,
    completeOnboarding,
    resetOnboarding,
    updateApiKeys
  };
}
