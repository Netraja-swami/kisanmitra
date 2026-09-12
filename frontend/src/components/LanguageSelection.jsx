import React, { useState } from 'react';
import { Languages, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export const SUPPORTED_LANGUAGES = [
  {
    id: 'en',
    name: 'English',
    subname: 'Simple Indian English',
    flag: '🇬🇧',
    recommended: false,
    sampleGreeting: 'Hello farmer friend! Your 24x7 smart crop advisor.'
  },
  {
    id: 'hi',
    name: 'हिंदी (Hindi)',
    subname: 'सरल व शुद्ध हिंदी',
    flag: '🌾',
    recommended: false,
    sampleGreeting: 'नमस्ते किसान भाई! फसल, सिंचाई व मंडी की संपूर्ण जानकारी।'
  },
  {
    id: 'hinglish',
    name: 'हिंग्लिश (Hinglish)',
    subname: 'Hindi + English Mix',
    flag: '🇮🇳',
    recommended: true,
    sampleGreeting: 'राम राम किसान भाई! Fasal aur bimari ki advice yahan milegi.'
  },
  {
    id: 'pa',
    name: 'ਪੰਜਾਬੀ (Punjabi)',
    subname: 'ਪੰਜਾਬੀ ਕਿਸਾਨ ਸਲਾਹਕਾਰ',
    flag: '🚜',
    recommended: false,
    sampleGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਫਸਲ ਦੀ ਪੂਰੀ ਦੇਖਭਾਲ।'
  },
  {
    id: 'mr',
    name: 'मराठी (Marathi)',
    subname: 'शेतकरी मित्र',
    flag: '🌱',
    recommended: false,
    sampleGreeting: 'नमस्कार शेतकरी बांधवांनो! पिकांची योग्य काळजी व मार्गदर्शन।'
  },
  {
    id: 'gu',
    name: 'ગુજરાતી (Gujarati)',
    subname: 'ખેડૂત મિત્ર',
    flag: '🌾',
    recommended: false,
    sampleGreeting: 'નમસ્તે ખેડૂત મિત્ર! પાક અને ખાતર અંગે સંપૂર્ણ માર્ગદર્શન.'
  }
];

export default function LanguageSelection({ currentLanguage = 'hinglish', onSelectLanguage }) {
  const [selectedLang, setSelectedLang] = useState(currentLanguage || 'hinglish');
  const { t } = useTranslation(selectedLang);

  const handleConfirm = () => {
    onSelectLanguage(selectedLang);
  };

  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col justify-between p-4 sm:p-6 text-slate-900 font-sans select-none">
      {/* Brand Header */}
      <div className="w-full max-w-md mx-auto pt-3 pb-2 text-center text-white">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 shadow-xl mb-2 text-2xl">
          🌐
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
          {t('langTitle')}
        </h1>
        <p className="text-xs text-emerald-200 mt-1 font-medium">
          {t('langSubtitle')}
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-4 sm:p-5 flex-1 flex flex-col justify-between border border-emerald-100 my-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" />
              <span>{t('langCardHeader')}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t('langCanChangeLater')}
            </span>
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-1 gap-2.5 overflow-y-auto max-h-[380px] pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.id;

              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLang(lang.id)}
                  className={`min-h-[58px] p-3 rounded-2xl border text-left transition-all flex items-center gap-3 active:scale-98 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-2xl p-2 rounded-xl bg-slate-100 shrink-0">
                    {lang.flag}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">
                          {lang.name}
                        </span>
                        {lang.recommended && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ★ Popular
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      {lang.subname}
                    </div>

                    <div className="text-[11px] text-emerald-800 bg-emerald-100/60 rounded-md px-2 py-0.5 mt-1 font-medium inline-block">
                      "{lang.sampleGreeting}"
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button (Min 48px height) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full min-h-[48px] rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 font-bold text-white shadow-md transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>{t('confirmLangBtn')}</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto text-center text-emerald-200 text-[11px] py-1">
        {t('langFooter')}
      </div>
    </div>
  );
}
