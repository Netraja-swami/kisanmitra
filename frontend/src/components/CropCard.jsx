import React from 'react';
import { Droplets, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function CropCard({ crop, index, language = 'hinglish' }) {
  const { t, isEnglish, isHindi } = useTranslation(language);
  if (!crop) return null;

  const cropTitle = isEnglish
    ? crop.nameEn || crop.name || crop.nameHi
    : isHindi
    ? crop.nameHi || crop.name || crop.nameEn
    : crop.nameHi || crop.name;

  const cropSubtitle = isEnglish
    ? null
    : isHindi
    ? null
    : crop.nameEn;

  return (
    <div className="bg-white rounded-xl border border-emerald-300 shadow-sm p-3.5 my-2 hover:border-emerald-500 transition-all text-left">
      {/* Top Header with badge */}
      <div className="flex items-start justify-between gap-2 border-b border-emerald-100 pb-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-700 text-white text-xs font-bold">
              {index !== undefined ? index + 1 : '🌱'}
            </span>
            <h4 className="font-bold text-emerald-900 text-base leading-tight">
              {cropTitle}
            </h4>
          </div>
          {cropSubtitle && (
            <p className="text-xs text-slate-500 font-medium pl-6">
              {cropSubtitle}
            </p>
          )}
        </div>
        <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          {t('topChoice')}
        </span>
      </div>

      {/* Why suitable */}
      <div className="mb-2.5 flex items-start gap-1.5 text-xs text-slate-700 bg-emerald-50/60 p-2 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-snug font-medium">
          <strong className="text-emerald-900">{t('whySuitable')}</strong> {crop.why || crop.reason}
        </p>
      </div>

      {/* Stats Grid: Yield & Water */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Yield */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
          <div className="flex items-center gap-1 text-slate-500 mb-0.5 font-medium text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('estimatedYield')}</span>
          </div>
          <div className="font-bold text-slate-900 text-xs">
            {crop.yield || (isEnglish ? '20-25 Quintal/Acre' : '20-25 क्विंटल/एकड़')}
          </div>
        </div>

        {/* Water Requirement */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
          <div className="flex items-center gap-1 text-slate-500 mb-0.5 font-medium text-[11px]">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('waterRequirement')}</span>
          </div>
          <div className="font-bold text-slate-900 text-xs">
            {crop.water || (isEnglish ? 'Moderate Irrigation' : 'मध्यम सिंचाई')}
          </div>
        </div>
      </div>
    </div>
  );
}
