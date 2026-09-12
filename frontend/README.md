# KisanMitra (किसान मित्र) - AI Crop Advisory Web App

**KisanMitra** is a mobile-first, high-performance crop advisory chatbot and plant disease diagnosis application designed specifically for Indian farmers.

Built with **React**, **Tailwind CSS**, and **Vite**, it runs 100% client-side without requiring a backend server.

---

## 🌟 Key Features

1. **🔐 Secure Sign In & Sign Up (लॉग इन व पंजीकरण)**:
   - **Indian Mobile Number Validation**: 10-digit format (`^[6-9]\d{9}$`).
   - **Web Crypto SHA-256 Hashing**: Passwords salted and hashed client-side with cryptographic entropy. Zero plaintext credentials.
   - **Brute-Force Rate Limiting**: 5 failed login attempt limit with 60-second cooldown lockout.
   - **XSS Sanitization**: Proactive stripping of malicious script tags and event handlers.
   - **Session Token Management**: Secure random session tokens with 7-day validity.
   - **⚡ 1-Click Demo Login**: Instant test login for evaluation.

2. **🌐 Dedicated Language Selection (भाषा चयन)**:
   - Asks farmer for language immediately after authentication.
   - Supported languages:
     - 🇮🇳 **हिंग्लिश (Hinglish)** - Most popular Hindi-English mix
     - 🌾 **हिंदी (Hindi)** - सरल व शुद्ध हिंदी
     - 🇬🇧 **English** - Simple Indian English
     - 🚜 **ਪੰਜਾਬੀ (Punjabi)** - ਪੰਜਾਬੀ ਕਿਸਾਨ
     - 🌱 **मराठी (Marathi)** - शेतकरी मित्र
     - 🌾 **ગુજરાતી (Gujarati)** - ખેડૂત મિત્ર
   - Adapts Claude AI advisory system prompt to converse in the selected language.

3. **🌾 3-Step Farmer Onboarding**:
   - **State / Region**: Major Indian agricultural states with Hindi & English search.
   - **Soil Type**: Visual cards with icons for **Black Soil (काली मिट्टी)**, **Loamy Soil (दोमट मिट्टी)**, **Sandy Soil (बलुई मिट्टी)**, and **Clay Soil (चिकनी मिट्टी)**.
   - **Current Season**: Auto-detected from the current calendar month (**Kharif**, **Rabi**, **Zaid**) with one-tap override.
   - Persisted directly in browser `localStorage`.

2. **💬 WhatsApp-Style Chat Interface**:
   - Familiar, intuitive messaging UI for Indian farmers.
   - User messages in deep green (`#166534`) on the right; KisanMitra in crisp white with emerald border on the left.
   - Realistic timestamps, read receipts (✓✓), and animated typing indicators.
   - 48px minimum touch targets optimized for one-hand phone operation.

3. **⚡ Quick Action Chips**:
   - 🌱 **Crop Recommend (फसल सुझाव)**
   - 🐛 **Pest / Bimari (कीट व रोग)**
   - 💧 **Paani Schedule (सिंचाई समय)**
   - 🌤️ **Mausam Advisory (मौसम सलाह)**
   - 💰 **Mandi Bhav (मंडी भाव)**

4. **🌿 Top-3 Crop Recommendation Cards**:
   - Structured `CropCard` components displaying:
     - Crop Name in Hindi & English
     - Suitability reason tailored to the farmer's soil and season
     - Expected yield (पैदावार)
     - Water requirement (सिंचाई)

5. **📸 Leaf Disease Diagnosis via Hugging Face + Claude AI**:
   - Take a live leaf photo or upload from gallery.
   - Client-side image compression for rapid upload over 2G/3G networks.
   - **Hugging Face Model**: `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification`.
   - Classification output & confidence passed directly into **Claude** with structured agricultural advisory prompt.
   - **DiagnosisCard** displaying photo preview, AI match %, causes, organic treatment (*देसी नुस्खा*), chemical fungicides, and preventive care.

6. **📊 Mandi Bhav & Crops Catalog**:
   - **Mandi Tab**: Daily indicative APMC wholesale prices for major crops with trend markers (📈 Up, 📉 Down, ⚖️ Stable).
   - **Crops Tab**: Seasonal crop catalog customized to the farmer's specific soil type.
   - **Profile Tab**: Edit farm context, toggle language, or enter custom Claude and Hugging Face API keys.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys (Optional)
You can configure your API keys in `.env` or directly inside the app under the **Profile** tab:

```env
VITE_CLAUDE_API_KEY=your_anthropic_api_key_here
VITE_HF_API_KEY=your_huggingface_access_token_here
```

> **Note:** If no API keys are provided, KisanMitra automatically runs in **Smart Offline Demo Mode** with realistic agricultural recommendations and verified leaf disease treatments so you can test all UI flows instantly.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🎨 UI & Design Principles
- **Color Palette**: Nature-inspired deep green (`#166534`) primary, amber (`#D97706`) accent, and clean slate/emerald background.
- **Typography**: System font stack for 0ms font blocking over slow 2G/3G mobile networks.
- **Accessibility**: 48px minimum touch targets across buttons, input bars, cards, and bottom navigation.
