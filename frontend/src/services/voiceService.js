/**
 * Voice & Speech Service for KisanMitra
 * Provides Speech-to-Text (Voice Recognition) and Text-to-Speech (Voice Readout)
 */

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

/**
 * Start speech recognition to capture farmer voice query
 */
export function startSpeechRecognition({
  language = 'hinglish',
  onResult,
  onError,
  onEnd
}) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  // Language mapping
  if (language === 'en') {
    recognition.lang = 'en-IN';
  } else if (language === 'hi') {
    recognition.lang = 'hi-IN';
  } else {
    // Hinglish / fallback: Indian Hindi or Indian English
    recognition.lang = 'hi-IN';
  }

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (onResult) {
      onResult({
        finalText: finalTranscript.trim(),
        interimText: interimTranscript.trim()
      });
    }
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    if (onError) onError(err.message);
    return null;
  }
}

/**
 * Clean markdown symbols for natural speech synthesis
 */
function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/\[.*?\]\(.*?\)/g, '') // remove markdown links
    .replace(/[*#_`~>•]/g, ' ') // remove markdown symbols
    .replace(/[👇👉🙏🌱🌾🐛💧🌤️💰✅⚠️🔎📊📌🧪👍⭐👨‍🌾]/gu, ' ') // remove emojis
    .replace(/\s+/g, ' ')
    .trim();
}

let activeUtterance = null;

/**
 * Speak text aloud using SpeechSynthesis
 */
export function speakText({
  text,
  language = 'hinglish',
  onStart,
  onEnd,
  onError
}) {
  if (!isSpeechSynthesisSupported()) {
    if (onError) onError('Speech synthesis is not supported.');
    return;
  }

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return;

  const utterance = new SpeechSynthesisUtterance(cleaned);
  activeUtterance = utterance;

  // Language mapping
  if (language === 'en') {
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
  } else {
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
  }

  // Try to pick an Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const matchingVoice = voices.find(
      (v) =>
        v.lang.startsWith(utterance.lang.slice(0, 2)) ||
        v.lang.includes('IN') ||
        v.name.toLowerCase().includes('india')
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    if (onError) onError(e);
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}
