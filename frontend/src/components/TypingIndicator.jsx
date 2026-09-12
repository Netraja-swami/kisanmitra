import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 my-2 justify-start">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-sm font-bold shadow-xs shrink-0 mb-1">
        🌱
      </div>

      {/* Bubble with bouncing dots */}
      <div className="bg-white border border-emerald-200 text-slate-700 px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
        <span className="text-xs font-semibold text-emerald-800 mr-1">KisanMitra सोच रहा है</span>
        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
