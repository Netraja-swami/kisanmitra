export const SEASONS = [
  {
    id: 'kharif',
    name: 'Kharif Season',
    hindi: 'खरीफ (मानसून)',
    period: 'June – October',
    hindiPeriod: 'जून से अक्टूबर (मानसून)',
    icon: '🌧️',
    description: 'Monsoon crops sown with the onset of rains.',
    hindiDesc: 'मानसून की बारिश के साथ बोई जाने वाली फसलें (धान, मक्का, कपास, ज्वार, बाजरा, सोयाबीन)।',
    months: [6, 7, 8, 9, 10]
  },
  {
    id: 'rabi',
    name: 'Rabi Season',
    hindi: 'रबी (सर्दी)',
    period: 'November – March',
    hindiPeriod: 'नवंबर से मार्च (सर्दियां)',
    icon: '❄️',
    description: 'Winter crops sown after monsoon and harvested in spring.',
    hindiDesc: 'सर्दियों में बोई जाने वाली फसलें (गेहूं, सरसों, चना, जौ, मटर, आलू)।',
    months: [11, 12, 1, 2, 3]
  },
  {
    id: 'zaid',
    name: 'Zaid Season',
    hindi: 'जायद (गर्मी)',
    period: 'April – June',
    hindiPeriod: 'अप्रैल से जून (गर्मियां)',
    icon: '☀️',
    description: 'Summer crops grown between Rabi and Kharif.',
    hindiDesc: 'रबी और खरीफ के बीच गर्मियों की फसलें (तरबूज, खीरा, ककड़ी, उड़द, मूंग)।',
    months: [4, 5]
  }
];

export function getAutoDetectedSeason() {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  if (currentMonth >= 6 && currentMonth <= 10) {
    return 'kharif';
  } else if (currentMonth >= 4 && currentMonth <= 5) {
    return 'zaid';
  } else {
    // 11, 12, 1, 2, 3
    return 'rabi';
  }
}
