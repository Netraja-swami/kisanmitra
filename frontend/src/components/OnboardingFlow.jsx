import React, { useState } from 'react';
import { INDIAN_STATES } from '../data/states';
import { SOIL_TYPES } from '../data/soils';
import { SEASONS, getAutoDetectedSeason } from '../data/seasons';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function OnboardingFlow({ onComplete, initialContext }) {
  const { t, isEnglish, isHindi } = useTranslation(initialContext?.language);

  const [step, setStep] = useState(1);
  const [state, setState] = useState(initialContext?.state || 'uttar_pradesh');
  const [soilType, setSoilType] = useState(initialContext?.soilType || 'loamy');
  const [season, setSeason] = useState(initialContext?.season || getAutoDetectedSeason());
  const [farmerName, setFarmerName] = useState(initialContext?.farmerName || 'Kisan Bhai');
  const [searchState, setSearchState] = useState('');

  const filteredStates = INDIAN_STATES.filter((s) => s.name.toLowerCase().includes(searchState.toLowerCase()) || s.hindi.includes(searchState)).sort((a, b) => a.name.localeCompare(b.name));

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        state,
        soilType,
        season,
        farmerName
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col justify-between p-4 sm:p-6 text-slate-900 font-sans">
      {/* Top Brand Banner */}
      <div className="w-full max-w-md mx-auto pt-2 pb-3 text-center text-white">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 shadow-lg mb-2 text-2xl">
          🌱
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
          {t('appName')} <span className="text-amber-400 font-bold block sm:inline text-xl sm:text-2xl">({t('appSubname')})</span>
        </h1>
        <p className="text-xs text-emerald-200 mt-1 font-medium">
          {t('tagline')}
        </p>

        {/* Stepper Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-amber-400'
                  : s < step
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-emerald-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-5 flex-1 flex flex-col justify-between border border-emerald-100">
        {/* STEP 1: STATE / REGION */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {t('step1Tag')}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">
                {t('step1Title')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('step1Desc')}
              </p>
            </div>

            {/* State Search */}
            <div className="mb-3">
              <input
                type="text"
                placeholder={t('searchStatePlaceholder')}
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* States List */}
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[300px] pr-1 no-scrollbar">
              {filteredStates.map((st) => {
                const isSelected = state === st.id;
                const primaryName = isEnglish ? st.name : st.hindi;
                const secondaryName = isEnglish ? null : st.name;

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setState(st.id)}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left transition-all flex flex-col justify-center ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold leading-tight">{primaryName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                    </div>
                    {secondaryName && <span className="text-[11px] text-slate-500">{secondaryName}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SOIL TYPE */}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {t('step2Tag')}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">
                {t('step2Title')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('step2Desc')}
              </p>
            </div>

            {/* Soil Cards */}
            <div className="grid grid-cols-1 gap-2.5 overflow-y-auto max-h-[320px] pr-1">
              {SOIL_TYPES.map((soil) => {
                const isSelected = soilType === soil.id;
                const title = isEnglish ? soil.name : soil.hindi;
                const desc = isEnglish ? soil.description : soil.hindiDesc;

                return (
                  <button
                    key={soil.id}
                    type="button"
                    onClick={() => setSoilType(soil.id)}
                    className={`min-h-[58px] p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-2 rounded-xl bg-slate-100">
                      {soil.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-sm">
                          {title}
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                        {desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: CURRENT SEASON */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {t('step3Tag')}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2 mb-1">
                {t('step3Title')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('step3Desc')}
              </p>
            </div>

            {/* Season Cards */}
            <div className="grid grid-cols-1 gap-2.5 mb-3">
              {SEASONS.map((sn) => {
                const isSelected = season === sn.id;
                const isDetected = getAutoDetectedSeason() === sn.id;
                const name = isEnglish ? sn.name : sn.hindi;
                const period = isEnglish ? sn.period : sn.hindiPeriod;
                const desc = isEnglish ? sn.description : sn.hindiDesc;

                return (
                  <button
                    key={sn.id}
                    type="button"
                    onClick={() => setSeason(sn.id)}
                    className={`min-h-[58px] p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 shrink-0">
                      {sn.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{name}</span>
                          {isDetected && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                              {t('currentTag')}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{period}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                        {desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Farmer Name Input */}
            <div className="mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t('farmerNameOptional')}
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder={t('farmerNamePlaceholder')}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        )}

        {/* Navigation Actions (Large 48px Buttons) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="min-h-[48px] px-4 rounded-2xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 active:scale-98 transition-all text-sm flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="min-h-[48px] flex-1 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 font-bold text-white shadow-md transition-all text-sm flex items-center justify-center gap-1.5"
          >
            <span>{step === 3 ? t('startAdvisoryBtn') : t('next')}</span>
            {step === 3 ? <Sparkles className="w-4 h-4 text-amber-300" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
