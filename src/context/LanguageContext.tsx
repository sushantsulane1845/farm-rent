import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, TranslationBundle } from '../i18n/translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationBundle;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'farmrent_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'mr' || saved === 'hi' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'mr';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
