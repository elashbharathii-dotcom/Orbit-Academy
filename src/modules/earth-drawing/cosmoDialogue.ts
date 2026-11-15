import { CosmoQuote, StudioTool } from './types';

// ============================================================================
// COSMO DIALOGUE DATABASE — CREATIVE TIPS, SPACE FACTS & ENCOURAGEMENTS
// ============================================================================

export const COSMO_QUOTES: CosmoQuote[] = [
  // Creative Tips
  {
    id: 'tip-pencil',
    category: 'tip',
    relatedTool: 'pencil',
    text: 'Pencil mode active! Perfect for tracing orbit paths and fine lunar crater ridges.',
  },
  {
    id: 'tip-brush',
    category: 'tip',
    relatedTool: 'brush',
    text: 'Use the Brush tool with 40% opacity to blend cosmic gas clouds and stellar nebulae!',
  },
  {
    id: 'tip-eraser',
    category: 'tip',
    relatedTool: 'eraser',
    text: 'Erasing star dust? Zoom in to 200% for surgical precision around rocket engines.',
  },
  {
    id: 'tip-circle',
    category: 'tip',
    relatedTool: 'circle',
    text: 'Hold shift while drawing circles to generate perfect planetary spheres and solar disks!',
  },
  {
    id: 'tip-line',
    category: 'tip',
    relatedTool: 'line',
    text: 'Draw straight lines between stars to map out constellations like Orion and Cassiopeia.',
  },
  {
    id: 'tip-rect',
    category: 'tip',
    relatedTool: 'rect',
    text: 'Rectangles are great for solar panels, spacecraft trusses, and modular space habitats!',
  },
  {
    id: 'tip-polygon',
    category: 'tip',
    relatedTool: 'polygon',
    text: 'Stamp stars and asteroid polygons! Try different vertex counts for cosmic crystals.',
  },
  {
    id: 'tip-fill',
    category: 'tip',
    relatedTool: 'fill',
    text: 'Fill Bucket flood-fills enclosed spaces. Make sure all line gaps are closed first!',
  },
  {
    id: 'tip-text',
    category: 'tip',
    relatedTool: 'text',
    text: 'Label your spacecraft components! Click anywhere on canvas to stamp cosmic labels.',
  },
  {
    id: 'tip-layers',
    category: 'tip',
    text: 'Pro Tip: Sketch your rocket outline on Layer 1, and paint colors on Layer 2 below it!',
  },
  {
    id: 'tip-grid',
    category: 'tip',
    text: 'Toggle the Space Coordinate Grid in the top bar to align solar panels and thrusters.',
  },

  // Astronomical Facts
  {
    id: 'fact-saturn',
    category: 'fact',
    text: 'Did you know? Saturn’s majestic rings are 282,000 km across, but only about 10 meters thick!',
  },
  {
    id: 'fact-mars',
    category: 'fact',
    text: 'Olympus Mons on Mars is the largest volcano in the Solar System — three times taller than Mt. Everest!',
  },
  {
    id: 'fact-sun',
    category: 'fact',
    text: 'The Sun accounts for 99.86% of all mass in our entire Solar System!',
  },
  {
    id: 'fact-moon',
    category: 'fact',
    text: 'Footprints left by Apollo astronauts on the Moon will remain for millions of years because there is no wind.',
  },
  {
    id: 'fact-jupiter',
    category: 'fact',
    text: 'Jupiter’s Great Red Spot is a colossal storm larger than Earth that has been raging for over 350 years.',
  },
  {
    id: 'fact-venus',
    category: 'fact',
    text: 'A day on Venus (one full rotation) is actually longer than its entire year (orbit around the Sun)!',
  },
  {
    id: 'fact-voyager',
    category: 'fact',
    text: 'Voyager 1 is the farthest human-made object from Earth, traveling over 24 billion kilometers away in interstellar space.',
  },
  {
    id: 'fact-stars',
    category: 'fact',
    text: 'There are more stars in the observable universe than grains of sand on all of Earth’s beaches combined!',
  },

  // Motivational Encouragements
  {
    id: 'enc-1',
    category: 'encouragement',
    text: 'Stellar brushwork! That spacecraft looks ready for an interstellar voyage.',
  },
  {
    id: 'enc-2',
    category: 'encouragement',
    text: 'Cosmic masterpiece in progress! Your color harmony is truly out of this world.',
  },
  {
    id: 'enc-3',
    category: 'encouragement',
    text: 'Astronomical creativity detected! Don’t forget to save your project in the top bar.',
  },
  {
    id: 'enc-4',
    category: 'encouragement',
    text: 'You’re designing like a NASA mission architect! Keep exploring new ideas.',
  },
];

export function getCosmoQuoteForTool(tool: StudioTool): string {
  const quote = COSMO_QUOTES.find((q) => q.relatedTool === tool);
  if (quote) return quote.text;
  return 'Cosmic Creative Studio ready. Select any tool or template to begin your mission!';
}

export function getRandomCosmoQuote(): CosmoQuote {
  const idx = Math.floor(Math.random() * COSMO_QUOTES.length);
  return COSMO_QUOTES[idx];
}

// ============================================================================
// COSMO PIXEL ART FACES (ASCII MATRIX CONVERTED TO SVG PATHS)
// Inspired by NUDGE's character generator
// ============================================================================

export type CosmoFaceMood = 'idle' | 'happy' | 'thinking' | 'wink' | 'surprised';

export const COSMO_FACES: Record<CosmoFaceMood, string[]> = {
  idle: [
    '..########..',
    '.#........#.',
    '#..##..##..#',
    '#..##..##..#',
    '#..........#',
    '#...####...#',
    '.#........#.',
    '..########..',
  ],
  happy: [
    '..########..',
    '.#........#.',
    '#..#....#..#',
    '#..##..##..#',
    '#..........#',
    '#..#....#..#',
    '.#..####..#.',
    '..########..',
  ],
  thinking: [
    '..########..',
    '.#........#.',
    '#..##..##..#',
    '#...#...#..#',
    '#..........#',
    '#....##....#',
    '.#........#.',
    '..########..',
  ],
  wink: [
    '..########..',
    '.#........#.',
    '#..##..##..#',
    '#..##...#..#',
    '#..........#',
    '#...####...#',
    '.#........#.',
    '..########..',
  ],
  surprised: [
    '..########..',
    '.#........#.',
    '#..##..##..#',
    '#..##..##..#',
    '#..........#',
    '#...####...#',
    '.#..#..#..#.',
    '..########..',
  ],
};
