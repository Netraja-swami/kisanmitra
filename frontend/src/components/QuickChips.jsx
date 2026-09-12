import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export default function QuickChips({ onSelectChip, disabled = false, language = 'hinglish' }) {
  const { t } = useTranslation(language);

  const QUICK_ACTIONS = [
    {
      id: 'crop_recommend',
      label: t('chipCrop'),
      subtext: t('chipCropSub'),
      query: t('chipCropQuery')
    },
    {
      id: 'pest_bimari',
      label: t('chipPest'),
      subtext: t('chipPestSub'),
      query: t('chipPestQuery')
    },
    {
      id: 'paani_schedule',
      label: t('chipWater'),
      subtext: t('chipWaterSub'),
      query: t('chipWaterQuery')
    },
    {
      id: 'mausam_advisory',
      label: t('chipWeather'),
      subtext: t('chipWeatherSub'),
      query: t('chipWeatherQuery')
    },
    {
      id: 'mandi_bhav',
      label: t('chipMandi'),
      subtext: t('chipMandiSub'),
      query: t('chipMandiQuery')
    }
  ];

  return (
    <div className="w-full overflow-x-auto py-2 px-3 no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 min-w-max">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectChip(action.query)}
            className="flex flex-col items-start px-3.5 py-1.5 min-h-[48px] justify-center bg-white border border-emerald-300 rounded-xl text-emerald-900 shadow-2xs hover:bg-emerald-50 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none select-none"
          >
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              {action.label}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {action.subtext}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
