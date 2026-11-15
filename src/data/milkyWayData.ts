/**
 * ORBIT ACADEMY — MILKY WAY GALAXY ASTROMETRIC DATA
 * 
 * Sources: European Space Agency Gaia Data Release 3 (Gaia DR3),
 * NASA Chandra X-ray Observatory, and Event Horizon Telescope.
 */

export interface GalacticSpiralArm {
  name: string;
  color: string;
  startRadius: number;
  endRadius: number;
  armAngleOffset: number; // in radians
  growthFactor: number;   // b in r(theta) = a * exp(b * theta)
  starCount: number;
  description: string;
}

export interface MilkyWayDefinition {
  name: string;
  classification: string;
  diameterLightYears: number;
  thicknessLightYears: number;
  estimatedStars: string;
  centralBlackHole: {
    name: string;
    massSolarMasses: number;
    distanceLightYears: number;
    description: string;
  };
  solarSystemLocation: {
    armName: string;
    distanceFromCoreLightYears: number;
    orbitalPeriodMillionYears: number;
    orbitalVelocityKms: number;
  };
  spiralArms: GalacticSpiralArm[];
}

export const MILKY_WAY_DATA: MilkyWayDefinition = {
  name: 'Milky Way Galaxy',
  classification: 'Barred Spiral Galaxy (Hubble Class SBbc)',
  diameterLightYears: 100000,
  thicknessLightYears: 2000,
  estimatedStars: '100 - 400 Billion Stars',
  centralBlackHole: {
    name: 'Sagittarius A* (Sgr A*)',
    massSolarMasses: 4297000, // 4.3 Million Solar Masses
    distanceLightYears: 26673,
    description: 'Supermassive black hole situated at the dynamical center of the Milky Way, imaged by the Event Horizon Telescope.',
  },
  solarSystemLocation: {
    armName: 'Orion-Cygnus Spur',
    distanceFromCoreLightYears: 26000,
    orbitalPeriodMillionYears: 230,
    orbitalVelocityKms: 220,
  },
  spiralArms: [
    {
      name: 'Perseus Arm',
      color: '#60A5FA',
      startRadius: 40,
      endRadius: 260,
      armAngleOffset: 0,
      growthFactor: 0.22,
      starCount: 6500,
      description: 'One of the two major spiral arms originating from the ends of the central galactic bar, rich in massive OB star associations.',
    },
    {
      name: 'Scutum-Centaurus Arm',
      color: '#A78BFA',
      startRadius: 40,
      endRadius: 260,
      armAngleOffset: Math.PI,
      growthFactor: 0.22,
      starCount: 6500,
      description: 'The other primary major spiral arm containing high concentrations of molecular clouds, giant H II star-forming regions, and red supergiants.',
    },
    {
      name: 'Sagittarius-Carina Arm',
      color: '#F472B6',
      startRadius: 35,
      endRadius: 220,
      armAngleOffset: Math.PI * 0.5,
      growthFactor: 0.24,
      starCount: 4500,
      description: 'Prominent minor arm interior to our Sun’s orbit, containing the Carina Nebula, Lagoon Nebula, and intense stellar nurseries.',
    },
    {
      name: 'Outer / Norma Arm',
      color: '#34D399',
      startRadius: 30,
      endRadius: 240,
      armAngleOffset: Math.PI * 1.5,
      growthFactor: 0.23,
      starCount: 4000,
      description: 'Farthest major spiral structure tracing the outer boundary of the galactic disk into deep intergalactic space.',
    },
    {
      name: 'Orion-Cygnus Arm (Local Spur)',
      color: '#FBBF24',
      startRadius: 85,
      endRadius: 140,
      armAngleOffset: 0.85,
      growthFactor: 0.20,
      starCount: 2500,
      description: 'The galactic bridge structure where our Solar System resides, home to the Orion Nebula and our local cosmic neighborhood.',
    },
  ],
};
