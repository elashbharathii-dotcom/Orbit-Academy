import { CelestialId } from '../types';

export type LauraEmotion = 'idle' | 'happy' | 'thinking' | 'laughing' | 'celebrating';

export interface LauraMessage {
  text: string;
  emotion: LauraEmotion;
  tag: string;
}

/**
 * Curated, scientifically grounded educational dialogues for LAURA
 * Inspired by genuine astrophysical wonders, tailored for students and young explorers.
 */
export const LAURA_DIALOGUES: Record<CelestialId | 'overview', LauraMessage[]> = {
  overview: [
    {
      text: "Greetings, Flight Director! I'm LAURA, your stellar co-pilot. Select any planet or use keys 1–8 to begin our journey across the solar system!",
      emotion: 'happy',
      tag: 'MISSION BRIEFING',
    },
    {
      text: "Did you know our Solar System is traveling at roughly 828,000 km/h around the center of the Milky Way galaxy?",
      emotion: 'thinking',
      tag: 'GALACTIC MOTION',
    },
    {
      text: "Every planet here revolves in the same counter-clockwise direction around Sol, following the ancient disk of dust that formed them 4.6 billion years ago!",
      emotion: 'celebrating',
      tag: 'SOLAR DISK',
    },
  ],
  sun: [
    {
      text: "Sol's gravitational pull holds our entire solar system together! In its core, it fuses 600 million tons of hydrogen into helium every single second!",
      emotion: 'celebrating',
      tag: 'FUSION ENGINE',
    },
    {
      text: "Light from the Sun takes about 8 minutes and 20 seconds to travel 150 million kilometers to reach Earth!",
      emotion: 'thinking',
      tag: 'SPEED OF LIGHT',
    },
  ],
  mercury: [
    {
      text: "Extreme world alert! Mercury has virtually no atmosphere to hold heat, so it swings from 430°C in daylight to -180°C in the dark!",
      emotion: 'thinking',
      tag: 'TEMPERATURE EXTREMES',
    },
    {
      text: "Mercury zips around the Sun in just 88 days, making it the fastest sprinter in our solar family!",
      emotion: 'happy',
      tag: 'ORBITAL VELOCITY',
    },
  ],
  venus: [
    {
      text: "Look at that golden glow! Venus is blanketed in dense carbon dioxide clouds that trap heat, making it the hottest planet in the solar system at 464°C!",
      emotion: 'thinking',
      tag: 'SUPER GREENHOUSE',
    },
    {
      text: "Venus rotates backwards compared to most planets, and its day is longer than its year! A single Venusian day lasts 243 Earth days!",
      emotion: 'laughing',
      tag: 'RETROGRADE SPIN',
    },
  ],
  earth: [
    {
      text: "Welcome home to Terra! Our blue oasis has liquid water oceans, a protective magnetic field, and the perfect conditions for millions of living species!",
      emotion: 'happy',
      tag: 'THE OASIS OF LIFE',
    },
    {
      text: "Earth's atmosphere is 78% nitrogen and 21% oxygen. The blue sky we see is caused by sunlight scattering through nitrogen molecules!",
      emotion: 'celebrating',
      tag: 'RAYLEIGH SCATTERING',
    },
  ],
  mars: [
    {
      text: "Welcome to the Red Frontier! Mars owes its rusty hue to oxidized iron in its dust. Olympus Mons here is the tallest volcano in the solar system—three times higher than Mount Everest!",
      emotion: 'celebrating',
      tag: 'MARTIAN GEOLOGY',
    },
    {
      text: "Rovers on Mars have found mineral evidence proving ancient rivers and lakes once carved through Jezero Crater billions of years ago!",
      emotion: 'thinking',
      tag: 'ANCIENT HYDROLOGY',
    },
  ],
  jupiter: [
    {
      text: "Whoa, look at the King of Giants! Over 1,300 Earths could fit inside Jupiter, and its massive magnetic field is the strongest of any planet!",
      emotion: 'celebrating',
      tag: 'GAS GIANT SUPREMACY',
    },
    {
      text: "The Great Red Spot is an anticyclonic storm larger than Earth that has been raging for at least 350 years!",
      emotion: 'thinking',
      tag: 'GREAT RED SPOT',
    },
  ],
  saturn: [
    {
      text: "The Jewel of the Solar System! Saturn's majestic rings span 282,000 km across, yet they are remarkably thin—only about 10 to 30 meters thick!",
      emotion: 'happy',
      tag: 'RING DYNAMICS',
    },
    {
      text: "Saturn is made mostly of hydrogen and helium and has the lowest density of any planet—it would literally float if you had a bathtub big enough!",
      emotion: 'laughing',
      tag: 'BUOYANT DENSITY',
    },
  ],
  uranus: [
    {
      text: "Uranus rolls on its side like a bowling ball! An ancient protoplanet collision tilted it by 98 degrees, giving it 21-year-long polar seasons!",
      emotion: 'laughing',
      tag: 'EXTREME AXIAL TILT',
    },
    {
      text: "Its pale aquamarine color comes from methane in its upper atmosphere, which absorbs red light and reflects cool cyan and blue!",
      emotion: 'thinking',
      tag: 'METHANE SPECTRUM',
    },
  ],
  neptune: [
    {
      text: "Fasten your harness! Neptune has the fiercest winds in the solar system, whipping through its deep methane atmosphere at over 2,000 km/h!",
      emotion: 'celebrating',
      tag: 'SUPERSONIC JETSTREAMS',
    },
    {
      text: "Neptune takes nearly 165 Earth years to complete just one single orbit around Sol! It only completed its first full orbit since discovery in 2011!",
      emotion: 'thinking',
      tag: 'KUIPER GATEWAY',
    },
  ],
};
