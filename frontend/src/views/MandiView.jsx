import React, { useState } from 'react';
import { Store, TrendingUp, TrendingDown, Minus, Search, MapPin, MessageSquare } from 'lucide-react';
import { MANDI_PRICES } from '../data/mandiData';
import { useTranslation } from '../i18n/useTranslation';

export default function MandiView({ farmerContext, onAskMandiAdvice }) {
  const { t, isEnglish, isHindi } = useTranslation(farmerContext?.language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  const statesList = Array.from(new Set(MANDI_PRICES.map((m) => m.state))).sort((a, b) => a.localeCompare(b));

  const cleanCommodityName = (commodityStr) => {
    if (!commodityStr) return '';
    if (isEnglish) {
      return commodityStr.split('(')[0].trim();
    } else if (isHindi) {
      const match = commodityStr.match(/\((.*?)\)/);
      return match ? match[1].trim() : commodityStr;
    }
    return commodityStr;
  };

  const filteredPrices = MANDI_PRICES.filter((item) => {
    const matchSearch =
      item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.market.toLowerCase().includes(searchTerm.toLowerCase());
    const matchState = selectedState === 'all' || item.state === selectedState;
    return matchSearch && matchState;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-20">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Store className="w-6 h-6 text-amber-400" />
                <span>{t('mandiViewTitle')}</span>
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {t('mandiViewSub')}
              </p>
            </div>
            <span className="bg-emerald-900 text-amber-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-700/60">
              Live APMC
            </span>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('mandiSearchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-xl bg-emerald-950/70 border border-emerald-600/50 text-white placeholder:text-emerald-300/70 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* State Filter Chips */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedState('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedState === 'all'
                  ? 'bg-amber-500 text-emerald-950'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-700/60'
              }`}
            >
              {t('allStates')}
            </button>
            {statesList.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedState === st
                    ? 'bg-amber-500 text-emerald-950'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-700/60'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mandi Cards List */}
      <div className="max-w-2xl mx-auto w-full p-3.5 space-y-3">
        {filteredPrices.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-500 border border-slate-200">
            {t('noMandiResults')}
          </div>
        ) : (
          filteredPrices.map((item) => {
            const isUp = item.trend === 'up';
            const isDown = item.trend === 'down';
            const displayCommodity = cleanCommodityName(item.commodity);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 hover:border-emerald-300 transition-all text-left"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {displayCommodity}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.market}, {item.state}</span>
                    </div>
                  </div>

                  {/* Trend Indicator */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isUp
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isDown
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isUp && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                    {isDown && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                    {!isUp && !isDown && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{item.trendPercent}</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">{t('minPrice')}</span>
                    <span className="font-bold text-xs text-slate-700">₹{item.minPrice}</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] text-emerald-800 block font-bold">{t('modalPrice')}</span>
                    <span className="font-black text-sm text-emerald-800">₹{item.modalPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">{t('maxPrice')}</span>
                    <span className="font-bold text-xs text-slate-700">₹{item.maxPrice}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  type="button"
                  onClick={() =>
                    onAskMandiAdvice(
                      isEnglish
                        ? `Is it a good time to sell ${displayCommodity} at current Mandi rate ₹${item.modalPrice}/Qtl or should I hold for better prices?`
                        : `क्या अभी ${displayCommodity} बेचना सही रहेगा या भाव बढ़ने का इंतजार करें?`
                    )
                  }
                  className="w-full min-h-[44px] rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('askMandiStrategyBtn')}</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
