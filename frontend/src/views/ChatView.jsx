import React, { useState, useRef, useEffect } from 'react';
import { Mic, Camera, Send, X, Volume2, VolumeX } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import { sendAdvisoryMessage, DEFAULT_RESPONSE, DISEASE_RESPONSE } from '../services/claudeService';
import { classifyPlantDisease } from '../services/huggingFaceService';
import {
  speakText,
  stopSpeaking
} from '../services/voiceService';
import { useTranslation } from '../i18n/useTranslation';
import { INDIAN_STATES } from '../data/states';
import { SOIL_TYPES } from '../data/soils';

// Client-side image compression for mobile camera uploads
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve({
              blob: blob || file,
              dataUrl: canvas.toDataURL('image/jpeg', 0.85)
            });
          },
          'image/jpeg',
          0.85
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function ChatView({ farmerContext, initialQuery = '', onClearPrefilledQuery = null }) {
  const language = farmerContext?.language || 'hinglish';
  const { t, isEnglish, isHindi } = useTranslation(language);

  const stateObj = INDIAN_STATES.find((s) => s.id === farmerContext?.state || (s.id === 'uttar_pradesh' && (farmerContext?.state === 'up' || farmerContext?.state === 'UP')));
  const soilObj = SOIL_TYPES.find((s) => s.id === farmerContext?.soilType);

  const stateName = isEnglish ? stateObj?.name : stateObj?.hindi || stateObj?.name;
  const soilName = isEnglish ? soilObj?.name : soilObj?.hindi || soilObj?.name;

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: t('welcomeGreeting')(farmerContext?.farmerName || '', stateName || 'Uttar Pradesh', soilName || 'Loamy Soil'),
      time: t('justNow')
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isListening]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
      if (onClearPrefilledQuery) {
        onClearPrefilledQuery();
      }
    }
  }, [initialQuery]);
  useEffect(() => {

  const loadChatHistory = async () => {

    const token = localStorage.getItem('kisanmitra_jwt');
    const userId = localStorage.getItem('kisanmitra_user_id');

    if (!token || !userId) {
      return;
    }

    try {

      const response = await fetch(
        `https://kisanmitra-07c4.onrender.com/api/chat/history/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        console.error(
          'Failed to load chat history:',
          response.status
        );
        return;
      }

      const history = await response.json();

      const historyMessages = [];

      history.forEach((chat) => {

        historyMessages.push({
          id: `user-${chat.id}`,
          role: 'user',
          content: chat.userMessage,
          time: new Date(chat.timestamp)
            .toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
        });

        historyMessages.push({
          id: `ai-${chat.id}`,
          role: 'assistant',
          content: chat.aiResponse,
          time: new Date(chat.timestamp)
            .toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
        });

      });

      if (historyMessages.length > 0) {
        setMessages(historyMessages);
      }

    } catch (error) {

      console.error(
        'Chat history connection error:',
        error
      );

    }

  };

  loadChatHistory();

  }, []);
  

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Text-to-Speech toggle handler for KisanMitra responses
  const handleToggleSpeak = (messageId, text) => {
    if (speakingMessageId === messageId) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      stopSpeaking();
      setSpeakingMessageId(messageId);
      speakText({
        text,
        language,
        onStart: () => setSpeakingMessageId(messageId),
        onEnd: () => setSpeakingMessageId(null),
        onError: () => setSpeakingMessageId(null)
      });
    }
  };

  // Web Speech API Implementation (lang: hi-IN)
  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setVoiceError('');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceError(isEnglish ? 'Voice input is not supported in this browser.' : 'आपके ब्राउज़र में बोलकर इनपुट की सुविधा उपलब्ध नहीं है।');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      const rec = new SR();
      rec.lang = isEnglish ? 'en-IN' : 'hi-IN';
      rec.interimResults = true;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((r) => r[0].transcript)
          .join('');
        setInputText(transcript);
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Error starting speech:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Handle File Input from Camera Button
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { blob, dataUrl } = await compressImage(file);
      await handleImageSelected(blob, dataUrl);
    } catch (err) {
      console.error('Error reading image', err);
      await handleImageSelected(file, URL.createObjectURL(file));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick Chips Configuration
  const QUICK_CHIPS = [
    {
      id: 'fasal',
      label: '🌱 Fasal Chune',
      query: '🌱 Fasal Chune'
    },
    {
      id: 'bimari',
      label: '🐛 Bimari',
      query: '🐛 Bimari'
    },
    {
      id: 'paani',
      label: '💧 Paani',
      query: '💧 Paani'
    },
    {
      id: 'mausam',
      label: '🌤️ Mausam',
      query: '🌤️ Mausam'
    },
    {
      id: 'mandi',
      label: '💰 Mandi',
      query: '💰 Mandi'
    }
  ];

  // Send query to Claude
  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    stopListening();
    stopSpeaking();
    setSpeakingMessageId(null);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) {
      setInputText('');
    }
    setIsTyping(true);

    // Track questions asked in localStorage
    try {
      const currentCount = parseInt(localStorage.getItem('kisanmitra_questions_count') || '0', 10);
      localStorage.setItem('kisanmitra_questions_count', String(currentCount + 1));
    } catch (e) {}

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content || 'Photo query'
      }));

      const lastMessage = history[history.length - 1];

      const backendResponse = await fetch(
        'https://kisanmitra-07c4.onrender.com/api/chat/message',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('kisanmitra_jwt')}`
          },
          body: JSON.stringify({
            message: lastMessage.content,
            userId: localStorage.getItem('kisanmitra_user_id'),
            state: farmerContext?.state || 'Uttar Pradesh',
            soil: farmerContext?.soilType || 'Black Soil',
            season: farmerContext?.season || 'Kharif'
          })
        }
      );

      if (!backendResponse.ok) {
        throw new Error(`Backend error: ${backendResponse.status}`);
      }

      const backendData = await backendResponse.json();

      const response = {
        text: backendData.response
      };

      const botMessageId = `bot-${Date.now()}`;
      const botMessage = {
        id: botMessageId,
        role: 'assistant',
        content: response.text || DEFAULT_RESPONSE,
        crops: response.crops,
        time: getCurrentTime()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Chat handler fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          role: 'assistant',
          content: DEFAULT_RESPONSE,
          time: getCurrentTime()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Leaf Photo Upload & Hugging Face + Claude pipeline
  const handleImageSelected = async (imageBlob, previewUrl) => {
    if (isTyping) return;

    stopListening();
    stopSpeaking();

    const photoQueryText = isEnglish
      ? 'Please inspect this crop leaf photo and recommend disease treatment.'
      : 'कृपया मेरी फसल के पत्ते की जांच करें और बीमारी का इलाज बताएं।';

    const userMessage = {
      id: `user-img-${Date.now()}`,
      role: 'user',
      content: photoQueryText,
      image: previewUrl,
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Track questions asked count in localStorage
    try {
      const currentCount = parseInt(localStorage.getItem('kisanmitra_questions_count') || '0', 10);
      localStorage.setItem('kisanmitra_questions_count', String(currentCount + 1));
    } catch (e) {}

    try {
      const formData = new FormData();

      formData.append('image', imageBlob, 'plant.jpg');
      formData.append(
        'state',
        farmerContext?.state || 'Uttar Pradesh'
      );
      formData.append(
        'soil',
        farmerContext?.soilType || 'Black Soil'
      );
      formData.append(
        'season',
        farmerContext?.season || 'Kharif'
      );

      const imageResponse = await fetch(
        'https://kisanmitra-07c4.onrender.com/api/chat/image',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('kisanmitra_jwt')}`
          },
          body: formData
        }
      );

      if (!imageResponse.ok) {
        throw new Error(`Image analysis error: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();

      const diagnosisResult = imageData.response;

      const response = {
        text: diagnosisResult
      };

      const botMessageId = `bot-diag-${Date.now()}`;
      const botMessage = {
        id: botMessageId,
        role: 'assistant',
        content: response.text || DISEASE_RESPONSE,
        diagnosis: diagnosisResult,
        diagnosisImage: previewUrl,
        time: getCurrentTime()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Leaf diagnosis fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-diag-fallback-${Date.now()}`,
          role: 'assistant',
          content: DISEASE_RESPONSE,
          time: getCurrentTime()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-pattern relative pb-[56px]">
      {/* Date Separator */}
      <div className="sticky top-0 z-10 py-2 flex justify-center pointer-events-none">
        <span className="bg-white/85 backdrop-blur-xs text-slate-600 text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs border border-emerald-100 uppercase tracking-wide">
          {t('today')}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-2">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            language={language}
            isSpeaking={speakingMessageId === msg.id}
            onToggleSpeak={handleToggleSpeak}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Hidden File Input for Camera / Leaf Photo Trigger */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* OVERALL INPUT AREA STYLE:
          Background: #ffffff (white, NOT dark)
          Top border: 1px solid #bbf7d0
          Padding: 10px 12px
          No heavy shadows, no gradients
          Positioned directly above the 56px bottom nav bar
      */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #bbf7d0',
          padding: '10px 12px'
        }}
        className="z-30 select-none shrink-0"
      >
        {/* Voice Error Notice if speech is unsupported */}
        {voiceError && (
          <div className="mb-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg flex items-center justify-between">
            <span>{voiceError}</span>
            <button
              type="button"
              onClick={() => setVoiceError('')}
              className="text-amber-700 hover:text-amber-900 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. QUICK CHIPS ROW (above input) */}
        <div className="w-full overflow-x-auto pb-2.5 flex items-center gap-2 no-scrollbar">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              disabled={isTyping}
              onClick={() => handleSendMessage(chip.query)}
              style={{
                borderWidth: '0.5px',
                borderColor: '#bbf7d0'
              }}
              className="bg-[#ffffff] text-[#166534] rounded-full text-xs px-3 py-1.5 font-medium whitespace-nowrap active:scale-95 transition-all hover:bg-[#f0fdf4] cursor-pointer shrink-0 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 2. VOICE RECORDING INDICATOR (hidden by default, shows when mic active) */}
        {isListening && (
          <div
            style={{ borderWidth: '0.5px', borderColor: '#fecaca' }}
            className="mb-2.5 px-3 py-2 bg-[#fef2f2] text-[#dc2626] rounded-xl flex items-center justify-between text-xs font-medium"
          >
            <div className="flex items-center gap-2.5">
              {/* Animated sound wave bars (5 bars, bounce animation) */}
              <div className="flex items-center gap-[3px] h-4">
                <span className="w-[3px] h-2 bg-[#dc2626] rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-[3px] h-3.5 bg-[#dc2626] rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-[3px] h-4 bg-[#dc2626] rounded-full animate-bounce [animation-delay:300ms]"></span>
                <span className="w-[3px] h-3 bg-[#dc2626] rounded-full animate-bounce [animation-delay:450ms]"></span>
                <span className="w-[3px] h-2 bg-[#dc2626] rounded-full animate-bounce [animation-delay:600ms]"></span>
              </div>
              <span>
                {isEnglish
                  ? 'Listening... tap mic again to stop'
                  : 'Bol rahe hain... mic dobara dabayein band karne ke liye'}
              </span>
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="text-[11px] font-bold text-[#dc2626] bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              {isEnglish ? 'Stop' : 'रोकें'}
            </button>
          </div>
        )}

        {/* 3. MAIN INPUT ROW: [MIC BTN] [TEXT INPUT] [CAMERA BTN] [SEND BTN] */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%'
          }}
        >
          {/* 1. MIC BUTTON (left): 40x40 circle, green bg (#dcfce7), microphone icon */}
          <button
            type="button"
            onClick={toggleRecording}
            aria-label="Toggle voice input"
            title={isListening ? "Stop listening" : "Voice input"}
            style={{ width: '40px', height: '40px' }}
            className={`min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all ${
              isListening
                ? 'bg-[#fef2f2] text-[#dc2626] animate-pulse'
                : 'bg-[#dcfce7] text-[#166534]'
            }`}
          >
            <Mic className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* 2. TEXT INPUT FIELD (center, flex-1): pill shaped (border-radius: 20px) */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isTyping}
            placeholder={
              isListening
                ? (isEnglish ? 'Listening... speak now' : 'सुन रहे हैं... बोलिए')
                : (isEnglish ? 'Type or speak your crop problem...' : 'Apni samasya likhein ya bolein...')
            }
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #d1fae5',
              borderRadius: '20px',
              fontSize: '13px',
              padding: '9px 14px'
            }}
            className="flex-1 min-w-0 text-[#166534] placeholder:text-[#86efac] outline-none font-medium focus:border-[#166534] transition-all"
          />

          {/* 3. CAMERA BUTTON (right of input): 40x40 circle, yellow bg (#fef9c3) */}
          <button
            type="button"
            disabled={isTyping}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload leaf photo"
            title="पत्ती की फोटो खींचें / अपलोड करें"
            style={{ width: '40px', height: '40px', backgroundColor: '#fef9c3' }}
            className="min-w-[40px] min-h-[40px] rounded-full text-[#854d0e] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
          >
            <Camera className="w-5 h-5 stroke-[2]" />
          </button>

          {/* 4. SEND BUTTON (rightmost): 40x40 circle, dark green bg (#166534), white icon */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            aria-label="Send message"
            title="मैसेज भेजें"
            style={{ width: '40px', height: '40px', backgroundColor: '#166534' }}
            className="min-w-[40px] min-h-[40px] rounded-full text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
