import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck, Bug, Sparkles, FlaskConical, Leaf } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function DiagnosisCard({ diagnosis, imageUrl, language = 'hinglish' }) {
  const { t, isEnglish, isHindi } = useTranslation(language);
  if (!diagnosis) return null;

  const { details, score, isFallback } = diagnosis;
  const isHealthy = details?.isHealthy;
  const confidencePercent = Math.round((score || 0.9) * 100);

  const displayDiseaseName = isEnglish
    ? isHealthy ? `${details?.crop} (Healthy)` : `${details?.crop} - ${details?.disease}`
    : isHindi
    ? isHealthy ? `${details?.crop} (स्वस्थ पौधा)` : `${details?.crop} - ${details?.disease}`
    : details?.displayName || details?.disease || 'Plant Disease';

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-md overflow-hidden my-2.5 text-left max-w-sm sm:max-w-md">
      {/* Top Banner with Image Preview */}
      <div className="relative bg-slate-900 h-44 w-full overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Leaf sample"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 text-sm flex flex-col items-center">
            <Leaf className="w-10 h-10 text-emerald-500 mb-1" />
            <span>{t('leafPhoto')}</span>
          </div>
        )}

        {/* Confidence Badge */}
        <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{confidencePercent}% AI Match</span>
        </div>

        {/* Status Chip */}
        <div className="absolute bottom-2.5 left-2.5">
          {isHealthy ? (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t('healthyPlant')}</span>
            </span>
          ) : (
            <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t('diseaseDetected')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-3.5 space-y-3">
        {/* Crop & Disease Name */}
        <div className="border-b border-slate-100 pb-2">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
            {t('cropLabel')} {details?.crop || 'Plant'}
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-1.5 mt-0.5">
            <Bug className="w-5 h-5 text-amber-700 shrink-0" />
            {displayDiseaseName}
          </h3>
        </div>

        {/* Cause */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700">
          <div className="font-bold text-slate-900 flex items-center gap-1 mb-1">
            <span className="text-base">📌</span>
            <span>{t('causeLabel')}</span>
          </div>
          <p className="leading-relaxed">
            {isHealthy
              ? isEnglish
                ? 'Plant is healthy and receiving balanced nutrition.'
                : 'पौधा पूरी तरह स्वस्थ है और उचित पोषक तत्व प्राप्त कर रहा है।'
              : isEnglish
              ? 'High humidity, fungal spores, or abrupt weather changes causing lesions on the leaf surface.'
              : 'अधिक नमी, फफूंद (Fungal Spores) या मौसम में अचानक बदलाव के कारण पत्तियों पर काले-भूरे धब्बे बनते हैं।'}
          </p>
        </div>

        {/* Treatment (Organic + Chemical) */}
        {!isHealthy && (
          <div className="space-y-2">
            {/* Organic Treatment */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span>{t('organicTreatment')}</span>
              </div>
              <p className="leading-relaxed">
                {isEnglish
                  ? 'Spray 5ml Neem Oil (10,000 PPM) + 2g detergent powder per liter of water at 7-day intervals.'
                  : '5ml नीम का तेल (Neem Oil 10000 PPM) + 2g कपड़े धोने का डिटर्जेंट पाउडर प्रति लीटर पानी में मिलाकर 7 दिन के अंतराल पर छिड़काव करें।'}
              </p>
            </div>

            {/* Chemical Treatment */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <FlaskConical className="w-4 h-4 text-amber-700" />
                <span>{t('chemicalTreatment')}</span>
              </div>
              <p className="leading-relaxed">
                {isEnglish
                  ? 'For severe infestation, spray Mancozeb 75% WP (Indofil M-45) @ 2g/L or Azoxystrobin + Difenoconazole @ 1ml/L.'
                  : 'प्रकोप ज्यादा होने पर Mancozeb 75% WP (Indofil M-45) 2 ग्राम/लीटर या Azoxystrobin + Difenoconazole 1ml/लीटर का छिड़काव करें।'}
              </p>
            </div>
          </div>
        )}

        {/* Prevention */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-950">
          <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>{t('prevention')}</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-blue-900 leading-relaxed">
            {isEnglish ? (
              <>
                <li>Remove and destroy severely affected leaves away from the field.</li>
                <li>Avoid overhead watering on leaves during evening hours.</li>
                <li>Practice crop rotation to minimize fungal spore persistence.</li>
              </>
            ) : (
              <>
                <li>रोगी पत्तियों को तोड़कर खेत से दूर नष्ट कर दें।</li>
                <li>शाम के समय पत्तियों के ऊपर सीधा पानी छिड़कने से बचें।</li>
                <li>फसल चक्र (Crop Rotation) अपनाएं।</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
