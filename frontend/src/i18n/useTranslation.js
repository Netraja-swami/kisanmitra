import { translations } from './translations';

export function useTranslation(language = 'hinglish') {
  // Normalize language key: 'en', 'hi', 'hinglish'. Fallback other regional languages to 'hi' or 'hinglish'
  let activeLang = language;
  if (activeLang !== 'en' && activeLang !== 'hi' && activeLang !== 'hinglish') {
    activeLang = 'hi';
  }

  const currentDict = translations[activeLang] || translations.hinglish;
  const englishDict = translations.en;

  const t = (key, fallback = '') => {
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    if (englishDict && englishDict[key] !== undefined) {
      return englishDict[key];
    }
    return fallback || key;
  };

  return {
    t,
    lang: activeLang,
    isEnglish: activeLang === 'en',
    isHindi: activeLang === 'hi',
    isHinglish: activeLang === 'hinglish'
  };
}
