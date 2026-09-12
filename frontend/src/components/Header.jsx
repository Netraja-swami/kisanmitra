import React from 'react';
import { Sprout, RefreshCw, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { INDIAN_STATES } from '../data/states';
import { SOIL_TYPES } from '../data/soils';
import { SEASONS } from '../data/seasons';
import { useTranslation } from '../i18n/useTranslation';

export default function Header({ farmerContext, onOpenProfile, onResetContext }) {
  const { t, isEnglish, isHindi } = useTranslation(farmerContext?.language);

  const currentState = INDIAN_STATES.find((s) => s.id === farmerContext?.state || (s.id === 'uttar_pradesh' && (farmerContext?.state === 'up' || farmerContext?.state === 'UP')));
  const currentSoil = SOIL_TYPES.find((s) => s.id === farmerContext?.soilType);
  const currentSeason = SEASONS.find((s) => s.id === farmerContext?.season);

  const stateDisplayName = isEnglish ? currentState?.name : currentState?.hindi || currentState?.name;
  const soilDisplayName = isEnglish ? currentSoil?.name : currentSoil?.hindi || currentSoil?.name;
  const seasonDisplayName = isEnglish ? currentSeason?.name : currentSeason?.hindi || currentSeason?.name;

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md select-none border-b border-emerald-700/50">
      <div className="max-w-2xl mx-auto px-3.5 py-2.5 flex items-center justify-between">
        {/* Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-emerald-950 flex items-center justify-center text-xl shadow-xs shrink-0 font-bold">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base tracking-tight text-white leading-tight">
                {t('appName')}
              </h1>
              <span className="text-amber-400 font-bold text-xs">
                ({t('appSubname')})
              </span>
            </div>
            {/* Status & Online dot */}
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('onlineBadge')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Profile & Reset) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenProfile}
            title={t('settings')}
            className="min-h-[42px] px-2.5 py-1 rounded-xl bg-emerald-900/60 hover:bg-emerald-700/70 active:scale-95 border border-emerald-600/50 text-xs font-semibold text-emerald-100 flex items-center gap-1 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('settings')}</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Active Farmer Context Chips */}
      <div className="bg-emerald-900/90 px-3.5 py-1.5 border-t border-emerald-700/40 text-[11px] text-emerald-100 overflow-x-auto no-scrollbar">
        <div className="max-w-2xl mx-auto flex items-center gap-2 min-w-max">
          <span className="text-emerald-300 font-semibold">{t('farmDetails')}</span>
          <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-600/40 font-medium">
            📍 {stateDisplayName || 'Uttar Pradesh'}
          </span>
          <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-600/40 font-medium">
            {currentSoil?.icon} {soilDisplayName || 'Loamy Soil'}
          </span>
          <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-600/40 font-medium">
            {currentSeason?.icon} {seasonDisplayName || 'Rabi'}
          </span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30 font-semibold">
            🌐 {farmerContext?.language ? farmerContext.language.toUpperCase() : 'EN'}
          </span>
        </div>
      </div>
    </header>
  );
}
