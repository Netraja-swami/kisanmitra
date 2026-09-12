import React from 'react';
import { CheckCheck, Volume2, VolumeX } from 'lucide-react';
import CropCard from './CropCard';
import DiagnosisCard from './DiagnosisCard';
import { useTranslation } from '../i18n/useTranslation';

export default function ChatBubble({
  message,
  language = 'hinglish',
  isSpeaking = false,
  onToggleSpeak = null
}) {
  const isUser = message.role === 'user';
  const { t } = useTranslation(language);

  // Format simple markdown (bold, bullet points, line breaks)
  const formatContent = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold replacer: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={idx}>
          {renderedParts}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`flex w-full my-2.5 ${isUser ? 'justify-end' : 'justify-start items-end gap-2'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center text-sm font-bold shrink-0 mb-1">
          🌱
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end max-w-[70%]' : 'items-start max-w-[75%]'}`}>
        {/* Main Message Bubble */}
        <div
          style={{
            borderWidth: isUser ? '0px' : '0.5px',
            borderColor: '#bbf7d0'
          }}
          className={`p-[10px_14px] text-sm leading-relaxed break-words ${
            isUser
              ? 'bg-[#166534] text-white rounded-[16px_16px_4px_16px]'
              : 'bg-[#ffffff] text-slate-800 rounded-[16px_16px_16px_4px]'
          }`}
        >
          {/* Attached Image (User photo upload) */}
          {message.image && (
            <div className="mb-2 rounded-xl overflow-hidden border border-emerald-700/30 max-w-[260px]">
              <img
                src={message.image}
                alt="Uploaded leaf"
                className="w-full h-auto max-h-56 object-cover"
              />
            </div>
          )}

          {/* Text Message */}
          {message.content && (
            <div className={`text-sm ${isUser ? 'text-emerald-50' : 'text-slate-800'}`}>
              {formatContent(message.content)}
            </div>
          )}

          {/* Message Footer: Talking/Listen Button & Timestamp */}
          <div
            className={`flex items-center justify-between gap-3 text-[10px] mt-2 pt-1 border-t ${
              isUser ? 'border-emerald-700/50 text-emerald-200' : 'border-slate-100 text-slate-400'
            } select-none`}
          >
            {/* Listen / Talking Button for Bot Messages */}
            {!isUser && message.content && (
              <button
                type="button"
                onClick={() => onToggleSpeak && onToggleSpeak(message.id, message.content)}
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-95 ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-300/50 animate-pulse'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
                title={isSpeaking ? t('stopSpeaking') : t('speakAloud')}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t('stopSpeaking')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('speakAloud')}</span>
                  </>
                )}
              </button>
            )}

            {isUser && <div />}

            <div className="flex items-center gap-1 shrink-0 ml-auto">
              <span>{message.time || 'Just now'}</span>
              {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />}
            </div>
          </div>
        </div>

        {/* Structured Crop Recommendations */}
        {message.crops && Array.isArray(message.crops) && message.crops.length > 0 && (
          <div className="w-full mt-1.5 space-y-1.5">
            {message.crops.map((crop, idx) => (
              <CropCard key={idx} crop={crop} index={idx} language={language} />
            ))}
          </div>
        )}

        {/* Structured Leaf Disease Diagnosis */}
        {message.diagnosis && (
          <div className="w-full mt-1.5">
            <DiagnosisCard
              diagnosis={message.diagnosis}
              imageUrl={message.diagnosisImage || message.image}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}
