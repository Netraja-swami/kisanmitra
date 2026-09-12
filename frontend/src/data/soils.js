export const SOIL_TYPES = [
  {
    id: 'black',
    name: 'Black Soil',
    hindi: 'काली मिट्टी (रेगुर)',
    icon: '🟤',
    color: '#3d2817',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Rich in clay, retains high moisture. Best for Cotton, Wheat, Sugarcane.',
    hindiDesc: 'नमी सोखने की उच्च क्षमता। कपास, गेहूं, सोयाबीन और गन्ने के लिए सबसे उपयुक्त।',
    suitableCrops: ['Cotton (कपास)', 'Wheat (गेहूं)', 'Soybean (सोयाबीन)', 'Sugarcane (गन्ना)', 'Gram (चना)']
  },
  {
    id: 'loamy',
    name: 'Loamy Soil',
    hindi: 'दोमट मिट्टी',
    icon: '🌾',
    color: '#854d0e',
    tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Perfect balance of sand and clay. Highly fertile for almost all crops.',
    hindiDesc: 'रेत और चिकनी मिट्टी का संतुलन। सभी फसलों, सब्जियों और दालों के लिए उत्तम।',
    suitableCrops: ['Wheat (गेहूं)', 'Paddy/Rice (धान)', 'Mustard (सरसों)', 'Vegetables (सब्जियां)', 'Maize (मक्का)']
  },
  {
    id: 'sandy',
    name: 'Sandy Soil',
    hindi: 'बलुई / रेतीली मिट्टी',
    icon: '🏖️',
    color: '#d97706',
    tagColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    description: 'Quick drainage, low water retention. Needs frequent light watering.',
    hindiDesc: 'पानी जल्दी बहता है, कम नमी टिकती है। बाजरा, मूंगफली और तरबूज के लिए अनुकूल।',
    suitableCrops: ['Bajra/Pearl Millet (बाजरा)', 'Groundnut (मूंगफली)', 'Watermelon (तरबूज)', 'Gram (चना)', 'Guar (ग्वार)']
  },
  {
    id: 'clay',
    name: 'Clay Soil',
    hindi: 'चिकनी / मटियारी मिट्टी',
    icon: '🧱',
    color: '#78350f',
    tagColor: 'bg-stone-200 text-stone-900 border-stone-400',
    description: 'Dense, holds immense water. Ideal for water-intensive paddy & pulses.',
    hindiDesc: 'भारी मिट्टी, पानी बहुत देर तक रुकता है। धान, दलहन और अलसी के लिए आदर्श।',
    suitableCrops: ['Paddy/Rice (धान)', 'Lentil/Masoor (मसूर)', 'Linseed (अलसी)', 'Wheat (गेहूं)', 'Mustard (सरसों)']
  }
];

export const DEFAULT_SOIL = 'loamy';
