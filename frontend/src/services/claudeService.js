/**
 * KisanMitra Advisory Service
 * Connects frontend chat with Spring Boot + Gemini backend.
 *
 * The old response constants are kept because
 * other frontend files may still import them.
 */

import { INDIAN_STATES } from '../data/states';
import { SOIL_TYPES } from '../data/soils';
import { SEASONS } from '../data/seasons';


// --------------------------------------------------
// OLD RESPONSE CONSTANTS
// --------------------------------------------------

export const CROP_RESPONSE = `🌱 Aapki Black Soil aur Kharif season ke liye top 3 fasal:

1. 🌾 Dhaan (Rice) — UP ki black soil ke liye best.
   Paani zyada chahiye par yield achhi hoti hai.
   Expected: 45-55 quintal/hectare

2. 🫘 Soybean — Kam paani, zyada demand.
   Market price abhi strong hai UP mein.
   Expected: 20-25 quintal/hectare

3. 🌽 Makai (Corn) — Fast crop, 90 din mein ready.
   Mandi mein ₹1,800-2,100/quintal chal raha hai.
   Expected: 35-40 quintal/hectare

Koi ek fasal choose karein — uska poora schedule dunga! 🙏`;


export const DISEASE_RESPONSE = `🔍 Symptoms se lagta hai yeh **Early Blight** (Agati Jhulsa) hai.

🦠 Karan: Alternaria solani fungus
🌡️ Zyada hota hai: Geeli aur garmi wali mausam mein

💊 Ilaj:
- Mancozeb 75% WP — 2.5g/liter paani mein milakar spray karein
- 7-10 din mein dobara spray karein
- Infected patte tod ke door phenk dein

🛡️ Bachav:
- Crop rotation karein agli baar
- Zyada paani ek baar mat dein

Pakke diagnosis ke liye patte ki photo upload karein! 📸`;


export const IRRIGATION_RESPONSE = `💧 Black Soil ke liye Irrigation Schedule:

Kharif Season (July-October):
- Dhaan: Har 3-4 din, 5-7 cm paani
- Soybean: Har 7-10 din, drip better hai
- Makai: Har 5-7 din, furrow irrigation

⚠️ Black soil paani zyada rokti hai —
waterlogging se bachein!

🌤️ Barish ke baad 2-3 din irrigation band rakho.

Aapki kaun si fasal hai? Specific schedule dunga! 🙏`;


export const WEATHER_RESPONSE = `🌤️ UP Kharif Season Advisory (July-September):

☁️ Abhi ka mausam: Monsoon active
🌧️ Barish forecast: Agli 7 din acchi barish expected

✅ Kya karein abhi:
- Dhaan ki transplanting ke liye sahi time hai
- Khad (DAP) dalein transplanting ke baad
- Khet ki bunding check karein — waterlogging na ho

⚠️ Dhyan rakhen:
- Aandhi aayi toh chhoti fasal ko support dein
- Fungal bimari ka risk high hai barish mein
- Neem spray karein preventive ke taur pe

Koi specific crop ki weather advisory chahiye? 🙏`;


export const MANDI_RESPONSE = `💰 Aaj ke UP Mandi Bhav (Approximate):

🌾 Gehun (Wheat): ₹2,450 - ₹2,780/quintal ↗️
🫘 Sarson (Mustard): ₹5,200 - ₹5,600/quintal ➡️
🫘 Chana (Chickpea): ₹5,700 - ₹6,100/quintal ↗️
🌽 Makai (Corn): ₹1,800 - ₹2,100/quintal ➡️
🍅 Tamatar: ₹800 - ₹1,200/quintal ↘️
🧅 Pyaaz: ₹1,500 - ₹2,000/quintal ↗️

📍 Lucknow APMC | Agra Mandi | Kanpur Mandi

💡 Tip: Gehun aur Chana ki demand strong hai —
abhi bechna profitable rahega!

Live rates ke liye Mandi Rates tab dekhein 👇`;


export const DEFAULT_RESPONSE = `Namaste! 🙏 Main KisanMitra hoon — aapka AI fasal sahayak.

Aap mujhse pooch sakte hain:
🌱 Kaun si fasal ugaun?
🐛 Patte pe bimari ka ilaj?
💧 Kitna paani dein?
🌤️ Mausam advisory?
💰 Mandi ke bhav?

Neeche chips tap karein ya seedha likhein! 😊`;


// --------------------------------------------------
// SEND MESSAGE TO BACKEND
// --------------------------------------------------

export async function sendAdvisoryMessage(
  messageHistory,
  farmerContext = {},
  apiKey = '',
  diagnosisContext = null
) {

  // Get latest user message
  const lastUserMsg =
    messageHistory && messageHistory.length > 0
      ? messageHistory[messageHistory.length - 1]?.content || ''
      : '';


  // Get JWT token
  const token = localStorage.getItem('kisanmitra_jwt');

  if (!token) {
    return {
      text: 'Please login again to continue chatting. 🔐',
      crops: null
    };
  }


  // --------------------------------------------------
  // CONVERT FRONTEND IDs TO READABLE FARMER CONTEXT
  // --------------------------------------------------

  const stateData = INDIAN_STATES.find(
    (item) => item.id === farmerContext?.state
  );

  const soilData = SOIL_TYPES.find(
    (item) => item.id === farmerContext?.soilType
  );

  const seasonData = SEASONS.find(
    (item) => item.id === farmerContext?.season
  );


  const stateName =
    stateData?.name ||
    farmerContext?.state ||
    'Uttar Pradesh';


  const soilName =
    soilData?.name ||
    farmerContext?.soilType ||
    'Black Soil';


  const seasonName =
    seasonData?.name ||
    farmerContext?.season ||
    'Kharif';


  // Debug information
  console.log('🌾 KisanMitra Farmer Context:', {
    state: stateName,
    soil: soilName,
    season: seasonName
  });


  // --------------------------------------------------
  // SEND REQUEST TO SPRING BOOT
  // --------------------------------------------------

  try {

    const response = await fetch(
      'https://kisanmitra-07c4.onrender.com/api/chat/message',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({

          message: lastUserMsg,

          userId: String(
            farmerContext?.userId ||
            farmerContext?.id ||
            localStorage.getItem('kisanmitra_user_id') ||
            ''
          ),

          // IMPORTANT:
          // Send readable names instead of IDs
          state: stateName,

          soil: soilName,

          season: seasonName
        })
      }
    );


    // --------------------------------------------------
    // HANDLE BACKEND ERROR
    // --------------------------------------------------

    if (!response.ok) {

      const errorText = await response.text();

      console.error(
        'Chat API error:',
        response.status,
        errorText
      );

      return {
        text:
          'Sorry, KisanMitra se response nahi aa raha. Thodi der baad try karein. 🙏',
        crops: null
      };
    }


    // --------------------------------------------------
    // READ RESPONSE
    // --------------------------------------------------

    const data = await response.json();


    return {
      text: data.response || data.message || '',
      crops: null
    };


  } catch (error) {

    console.error(
      'Chat connection error:',
      error
    );

    return {
      text:
        'Backend se connection nahi ho pa raha. Please check karein ki Spring Boot server running hai. 🔌',
      crops: null
    };
  }
}