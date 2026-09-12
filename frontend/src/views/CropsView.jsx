import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Bug,
  BadgeIndianRupee,
  Clock,
  RotateCcw
} from 'lucide-react';
import { INDIAN_STATES } from '../data/states';

export const CROPS_DATA = [
  {
    id: 'rice',
    nameHi: 'धान',
    nameEn: 'Rice',
    emoji: '🌾',
    season: 'Kharif',
    seasonKey: 'kharif',
    soils: ['clay', 'loamy', 'black'],
    water: 'High',
    waterHi: 'High water (अधिक पानी)',
    yield: '45-55 q/ha',
    npk: 'N: 100-120 kg, P: 50-60 kg, K: 40-50 kg per hectare. Apply 50% N + full P & K at transplanting, rest N in 2 split doses.',
    irrigation: 'Har 3-4 din mein 5-7 cm paani. Maintain standing water during tillering and panicle initiation stages.',
    diseases: 'Blast (झुलसा), Bacterial Leaf Blight (BLB), Khaira (Zinc deficiency)',
    mandiPrice: '₹2,183 - ₹2,350 / क्विंटल (MSP / APMC Mandi)',
    chatQuery: 'Mujhe Dhaan (Rice) ki kheti, NPK khad schedule aur bimari bachav ke baare mein poori salah chahiye.'
  },
  {
    id: 'wheat',
    nameHi: 'गेहूं',
    nameEn: 'Wheat',
    emoji: '🌾',
    season: 'Rabi',
    seasonKey: 'rabi',
    soils: ['loamy', 'black', 'clay'],
    water: 'Medium',
    waterHi: 'Medium water (मध्यम पानी)',
    yield: '40-50 q/ha',
    npk: 'N: 120 kg, P: 60 kg, K: 40 kg per hectare. 1/3 N at sowing with full P&K, remaining N at 1st & 2nd irrigation.',
    irrigation: '4-5 irrigations: CRI stage (21 days after sowing), Tillering (40-45 days), Late Jointing, Flowering, and Milking stages.',
    diseases: 'Yellow Rust (पीला रतुआ), Karnal Bunt, Loose Smut (कंडुआ)',
    mandiPrice: '₹2,275 - ₹2,600 / क्विंटल (UP Mandi Rate)',
    chatQuery: 'Mujhe Gehun (Wheat) ki buaai, sinchai schedule aur NPK khad ke baare mein jaankari chahiye.'
  },
  {
    id: 'soybean',
    nameHi: 'सोयाबीन',
    nameEn: 'Soybean',
    emoji: '🫘',
    season: 'Kharif',
    seasonKey: 'kharif',
    soils: ['black', 'loamy'],
    water: 'Low',
    waterHi: 'Low water (कम पानी)',
    yield: '20-25 q/ha',
    npk: 'N: 25-30 kg, P: 60-80 kg, K: 40 kg + 20 kg Sulfur per hectare. Seed treatment with Rhizobium culture essential.',
    irrigation: '1-2 light irrigations only if dry spell occurs at flowering and pod development. Prevent waterlogging!',
    diseases: 'Yellow Mosaic Virus (YMV), Rust, Stem Fly, Pod Blight',
    mandiPrice: '₹4,300 - ₹4,892 / क्विंटल (Strong Market Demand)',
    chatQuery: 'Mujhe Soybean ki unnat kheti, peeli mozeyik bimari aur NPK khad ke baare mein batao.'
  },
  {
    id: 'corn',
    nameHi: 'मक्का',
    nameEn: 'Corn',
    emoji: '🌽',
    season: 'Kharif / Rabi',
    seasonKey: 'kharif_rabi',
    soils: ['loamy', 'sandy', 'black'],
    water: 'Medium',
    waterHi: 'Medium water (मध्यम पानी)',
    yield: '35-40 q/ha',
    npk: 'N: 120-150 kg, P: 60-70 kg, K: 40-50 kg per hectare. Apply nitrogen in 3 split doses (basal, knee-high, tasseling).',
    irrigation: 'Critical watering stages: Knee-high stage, Tasseling (मूंछ निकलना), and Silking / grain development.',
    diseases: 'Fall Armyworm (सैनिक सुंडी कीट), Maydis Leaf Blight, Downy Mildew',
    mandiPrice: '₹1,850 - ₹2,200 / क्विंटल (Local APMC Mandi)',
    chatQuery: 'Mujhe Makai (Corn) ki fasal mein Fall Armyworm se bachav aur khad schedule batao.'
  },
  {
    id: 'mustard',
    nameHi: 'सरसों',
    nameEn: 'Mustard',
    emoji: '🌼',
    season: 'Rabi',
    seasonKey: 'rabi',
    soils: ['loamy', 'sandy', 'black'],
    water: 'Low',
    waterHi: 'Low water (कम पानी)',
    yield: '15-20 q/ha',
    npk: 'N: 80 kg, P: 40 kg, K: 40 kg + 25-30 kg Sulfur per hectare. Sulfur enhances oil content and grain shine.',
    irrigation: '2 irrigations: First at pre-flowering (30-35 days) and second at pod formation (60-65 days).',
    diseases: 'White Rust (सफेद रतुआ), Alternaria Blight, Aphids / Mahu (माहू कीट)',
    mandiPrice: '₹5,350 - ₹5,850 / क्विंटल (High MSP / Cash Crop)',
    chatQuery: 'Mujhe Sarson (Mustard) ki fasal mein Mahu kit control aur tel badhane ke tips chahiye.'
  },
  {
    id: 'chickpea',
    nameHi: 'चना',
    nameEn: 'Chickpea',
    emoji: '🌱',
    season: 'Rabi',
    seasonKey: 'rabi',
    soils: ['black', 'loamy', 'sandy'],
    water: 'Low',
    waterHi: 'Low water (कम पानी)',
    yield: '15-20 q/ha',
    npk: 'N: 20 kg, P: 50 kg, K: 20 kg per hectare with PSB & Rhizobium biofertilizer.',
    irrigation: '1-2 light irrigations at pre-flowering and pod filling. Do NOT irrigate during flowering stage!',
    diseases: 'Wilt (उकठा रोग), Pod Borer (हेलीकोवर्पा इल्ली), Ascochyta Blight',
    mandiPrice: '₹5,440 - ₹6,100 / क्विंटल (High Profit Pulse)',
    chatQuery: 'Mujhe Chana (Chickpea) ki fasal mein uktha rog bachav aur fali chedakk kit niyantran batao.'
  },
  {
    id: 'sugarcane',
    nameHi: 'गन्ना',
    nameEn: 'Sugarcane',
    emoji: '🎋',
    season: 'Zaid',
    seasonKey: 'zaid',
    soils: ['loamy', 'clay', 'black'],
    water: 'High',
    waterHi: 'High water (अधिक पानी)',
    yield: '600-700 q/ha',
    npk: 'N: 150-180 kg, P: 60-80 kg, K: 60 kg per hectare. Top dress nitrogen before onset of monsoon.',
    irrigation: 'Frequent summer irrigations every 10-12 days; drip irrigation saves up to 40% water.',
    diseases: 'Red Rot (लाल सड़न), Smut (कंडुआ), Early Shoot Borer, White Grub',
    mandiPrice: '₹360 - ₹390 / क्विंटल (UP State SAP Price)',
    chatQuery: 'Mujhe Ganna (Sugarcane) ki fasal mein red rot bimari aur khad schedule ke baare mein jaankari do.'
  },
  {
    id: 'potato',
    nameHi: 'आलू',
    nameEn: 'Potato',
    emoji: '🥔',
    season: 'Rabi',
    seasonKey: 'rabi',
    soils: ['loamy', 'sandy'],
    water: 'Medium',
    waterHi: 'Medium water (मध्यम पानी)',
    yield: '200-250 q/ha',
    npk: 'N: 150-180 kg, P: 80-100 kg, K: 100-120 kg per hectare. High potash requirement for tuber size.',
    irrigation: 'Frequent light furrow irrigations every 7-10 days. Avoid water submerging the tuber ridges.',
    diseases: 'Late Blight (पिछेती झुलसा), Early Blight, Black Scurf, Aphids',
    mandiPrice: '₹1,100 - ₹1,650 / क्विंटल (Cold Storage / Mandi)',
    chatQuery: 'Mujhe Aloo (Potato) ki fasal mein picheti jhulsa (Late Blight) bachav aur spray schedule batao.'
  }
];

export default function CropsView({ farmerContext, onAskCropAdvice }) {
  // Filters State
  const [selectedSoil, setSelectedSoil] = useState('all'); // 'all' | 'black' | 'sandy' | 'clay' | 'loamy'
  const [selectedSeason, setSelectedSeason] = useState('all'); // 'all' | 'kharif' | 'rabi' | 'zaid'
  const [expandedCropId, setExpandedCropId] = useState(null);

  // Auto-filled State from Farm Profile
  const stateId = farmerContext?.state || 'uttar_pradesh';
  const stateObj = INDIAN_STATES.find(
    (s) => s.id === stateId || (s.id === 'uttar_pradesh' && (stateId === 'up' || stateId === 'UP'))
  );
  const stateDisplay = stateObj ? `${stateObj.name} (${stateObj.hindi})` : 'Uttar Pradesh (UP)';

  // Filter Logic
  const filteredCrops = CROPS_DATA.filter((crop) => {
    // Soil Filter
    const matchesSoil =
      selectedSoil === 'all' || crop.soils.includes(selectedSoil.toLowerCase());

    // Season Filter
    const matchesSeason =
      selectedSeason === 'all' ||
      crop.seasonKey === selectedSeason ||
      crop.seasonKey === 'kharif_rabi';

    return matchesSoil && matchesSeason;
  });

  const toggleExpand = (id) => {
    setExpandedCropId((prev) => (prev === id ? null : id));
  };

  const handleResetFilters = () => {
    setSelectedSoil('all');
    setSelectedSeason('all');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24 text-left select-none">
      {/* Top Banner */}
      <div className="bg-[#166534] text-white p-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 leading-tight">
              <Sprout className="w-5 h-5 text-amber-300" />
              <span>Fasal Salah (Crops Advisory)</span>
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Apni mitti aur mausam ke anusaar sahi fasal chunein
            </p>
          </div>
          <span className="text-[11px] bg-emerald-900/80 text-emerald-200 border border-emerald-700 px-2.5 py-1 rounded-full font-semibold shrink-0">
            8 Top Crops
          </span>
        </div>
      </div>

      {/* TOP SECTION — CROP FILTER BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-2xl mx-auto p-3 space-y-2.5">
          {/* 1. State Auto-filled row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="text-emerald-700 font-bold">📍 State:</span>
              <span className="bg-emerald-50 text-[#166534] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full font-bold">
                {stateDisplay}
              </span>
              <span className="text-[10px] text-slate-400 italic hidden sm:inline">
                (Auto-filled from farm profile)
              </span>
            </div>

            {(selectedSoil !== 'all' || selectedSeason !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#166534] hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* 2. Soil Filter Row (Black | Sandy | Clay | Loamy) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold text-slate-600 shrink-0 mr-1">
              Soil Type:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSoil('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSoil === 'all'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              All
            </button>
            {['Black', 'Sandy', 'Clay', 'Loamy'].map((soil) => {
              const soilKey = soil.toLowerCase();
              const isSelected = selectedSoil === soilKey;
              return (
                <button
                  key={soil}
                  type="button"
                  onClick={() => setSelectedSoil(soilKey)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#166534] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {soil}
                </button>
              );
            })}
          </div>

          {/* 3. Season Filter Row (Kharif | Rabi | Zaid) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold text-slate-600 shrink-0 mr-1">
              Season:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSeason('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSeason === 'all'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              All
            </button>
            {['Kharif', 'Rabi', 'Zaid'].map((season) => {
              const seasonKey = season.toLowerCase();
              const isSelected = selectedSeason === seasonKey;
              return (
                <button
                  key={season}
                  type="button"
                  onClick={() => setSelectedSeason(seasonKey)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#166534] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {season}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION — CROP CARDS GRID */}
      <div className="max-w-2xl mx-auto w-full p-3.5">
        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6 space-y-3">
            <span className="text-4xl">🌾</span>
            <h3 className="text-sm font-bold text-slate-800">
              Is filter ke anusaar koi fasal nahi mili
            </h3>
            <p className="text-xs text-slate-500">
              Kripya Soil Type ya Season filter badal kar dekhein.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCrops.map((crop) => {
              const isExpanded = expandedCropId === crop.id;

              return (
                <div
                  key={crop.id}
                  className={`bg-white rounded-2xl border border-[#bbf7d0] shadow-xs p-3.5 flex flex-col justify-between transition-all hover:border-[#166534] ${
                    isExpanded ? 'col-span-2 ring-2 ring-[#166534]/15' : 'col-span-1'
                  }`}
                >
                  {/* Top Card Row */}
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <span className="text-3xl shrink-0 p-1.5 rounded-xl bg-[#f0fdf4] border border-[#d1fae5]">
                        {crop.emoji}
                      </span>
                      {/* Best Season Badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] whitespace-nowrap">
                        {crop.season}
                      </span>
                    </div>

                    {/* Crop Name (Hindi + English) */}
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {crop.nameHi} <span className="text-xs text-slate-500 font-medium">({crop.nameEn})</span>
                    </h3>

                    {/* Attributes: Water & Yield */}
                    <div className="mt-2.5 space-y-1.5 text-xs">
                      {/* Water Requirement */}
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="text-[11px] font-medium">
                          Water: <strong className="text-slate-800 font-bold">{crop.water}</strong>
                        </span>
                      </div>

                      {/* Expected Yield */}
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-[11px] font-medium">
                          Yield: <strong className="text-slate-800 font-bold">{crop.yield}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* EXPANDED SECTION */}
                  {isExpanded && (
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2.5 text-xs text-slate-700 animate-fade-in">
                      {/* 1. Fertilizer schedule (NPK values) */}
                      <div className="bg-[#f0fdf4] border border-[#d1fae5] rounded-xl p-2.5">
                        <div className="font-bold text-[#166534] flex items-center gap-1 mb-1">
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>Fertilizer Schedule (NPK):</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                          {crop.npk}
                        </p>
                      </div>

                      {/* 2. Irrigation timing */}
                      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5">
                        <div className="font-bold text-sky-900 flex items-center gap-1 mb-1">
                          <Clock className="w-3.5 h-3.5 text-sky-700" />
                          <span>Irrigation Timing (सिंचाई):</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                          {crop.irrigation}
                        </p>
                      </div>

                      {/* 3. Common diseases to watch */}
                      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-2.5">
                        <div className="font-bold text-rose-900 flex items-center gap-1 mb-1">
                          <Bug className="w-3.5 h-3.5 text-rose-600" />
                          <span>Common Diseases to Watch (प्रमुख बीमारियां):</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                          {crop.diseases}
                        </p>
                      </div>

                      {/* 4. Current mandi price range */}
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5">
                        <div className="font-bold text-amber-950 flex items-center gap-1 mb-1">
                          <BadgeIndianRupee className="w-3.5 h-3.5 text-amber-700" />
                          <span>Current Mandi Price Range (मंडी भाव):</span>
                        </div>
                        <p className="text-[11px] text-slate-800 font-bold">
                          {crop.mandiPrice}
                        </p>
                      </div>

                      {/* 5. "Chat mein poochho" button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onAskCropAdvice) {
                            onAskCropAdvice(crop.chatQuery);
                          }
                        }}
                        className="w-full min-h-[44px] rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat mein poochho</span>
                      </button>
                    </div>
                  )}

                  {/* "Aur Jaankari" Button */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleExpand(crop.id)}
                      className="w-full py-1.5 px-2 rounded-xl bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-98"
                    >
                      <span>{isExpanded ? 'Kam Jaankari' : 'Aur Jaankari'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
