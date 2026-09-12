import React from 'react';
import { MessageSquare, Sprout, Store, UserCheck } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function BottomNav({ activeTab, onChangeTab, language = 'hinglish' }) {
  const { t } = useTranslation(language);

  const tabs = [
    {
      id: 'chat',
      label: t('navChat'),
      icon: MessageSquare
    },
    {
      id: 'crops',
      label: t('navCrops'),
      icon: Sprout
    },
    {
      id: 'mandi',
      label: t('navMandi'),
      icon: Store
    },
    {
      id: 'profile',
      label: t('navProfile'),
      icon: UserCheck
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg select-none">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-emerald-800' : 'text-slate-500'
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>
              <span className={`text-xs mt-1 leading-tight ${isActive ? 'font-extrabold text-emerald-900' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
