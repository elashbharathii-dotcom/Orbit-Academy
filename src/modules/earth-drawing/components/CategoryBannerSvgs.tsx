import React from 'react';
import { ColoringCategoryId } from '../types';

interface CategoryBannerSvgProps {
  categoryId: ColoringCategoryId;
  className?: string;
}

export const CategoryBannerSvg: React.FC<CategoryBannerSvgProps> = ({
  categoryId,
  className = 'w-full h-full object-contain',
}) => {
  switch (categoryId) {
    // ------------------------------------------------------------------------
    // 1. SOLAR SYSTEM
    // ------------------------------------------------------------------------
    case 'solar-system':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbital Ellipses */}
          <path
            d="M 60,190 C 80,100 240,40 400,60 C 470,70 510,120 490,170 C 470,220 350,260 210,250 C 130,245 80,220 60,190"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 90,190 C 120,120 250,75 380,95 C 440,105 470,145 450,185 C 430,225 320,245 220,235 C 150,230 105,210 90,190"
            stroke="#0F172A"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <path
            d="M 120,190 C 140,140 230,105 320,120 C 370,130 395,160 380,190 C 365,220 280,235 210,225"
            stroke="#0F172A"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* Smiling Giant Sun (Lower-Left) */}
          {/* Sun Rays */}
          <path
            d="M 65,130 L 72,110 L 80,130 L 98,118 L 100,138 L 120,132 L 115,152 L 135,155 L 125,172 L 142,182 L 128,195 L 140,212 L 122,218 L 130,238 L 110,238 L 112,258 L 95,250 L 90,268 L 78,252 L 68,268 L 62,248 L 45,258 L 48,238 L 30,240 L 38,222 L 20,215 L 32,200 L 18,185 L 32,175 L 22,158 L 40,155 L 35,135 L 55,140 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Sun Body */}
          <circle cx="78" cy="195" r="42" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          {/* Sun Eyes */}
          <circle cx="68" cy="188" r="4.5" fill="#0F172A" />
          <circle cx="88" cy="188" r="4.5" fill="#0F172A" />
          {/* Sun Smile */}
          <path
            d="M 68,202 Q 78,214 88,202"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Sun Rosy Cheeks */}
          <ellipse cx="60" cy="198" rx="3.5" ry="2" fill="#CBD5E1" />
          <ellipse cx="96" cy="198" rx="3.5" ry="2" fill="#CBD5E1" />

          {/* Mercury (Tiny Smiling Planet) */}
          <circle cx="165" cy="155" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="162" cy="153" r="1.5" fill="#0F172A" />
          <circle cx="168" cy="153" r="1.5" fill="#0F172A" />
          <path d="M 163,158 Q 165,161 167,158" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Venus */}
          <circle cx="215" cy="125" r="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <path d="M 205,123 Q 215,120 225,126" stroke="#0F172A" strokeWidth="1.5" />

          {/* Earth with Cute Smile */}
          <circle cx="265" cy="105" r="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <path d="M 255,100 Q 262,94 270,98 Q 275,108 268,115 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="260" cy="103" r="2" fill="#0F172A" />
          <circle cx="270" cy="103" r="2" fill="#0F172A" />
          <path d="M 261,111 Q 265,115 269,111" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

          {/* Mars */}
          <circle cx="315" cy="95" r="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="312" cy="93" r="1.5" fill="#0F172A" />
          <circle cx="318" cy="93" r="1.5" fill="#0F172A" />
          <path d="M 313,99 Q 315,102 317,99" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Jupiter with atmospheric waves and smile */}
          <circle cx="375" cy="115" r="24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <path d="M 353,105 Q 375,110 397,105" stroke="#0F172A" strokeWidth="2" />
          <path d="M 352,125 Q 375,120 398,125" stroke="#0F172A" strokeWidth="2" />
          <circle cx="367" cy="113" r="3" fill="#0F172A" />
          <circle cx="383" cy="113" r="3" fill="#0F172A" />
          <path d="M 370,121 Q 375,126 380,121" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

          {/* Saturn with Big Rings and cute face */}
          <g transform="translate(425, 170)">
            {/* Back Ring Arc */}
            <path d="M -35,-8 C -35,-22 35,-22 35,-8" stroke="#0F172A" strokeWidth="3" fill="none" />
            {/* Saturn Body */}
            <circle cx="0" cy="0" r="20" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            {/* Front Ring Arc */}
            <path d="M -40,-2 C -40,18 40,18 40,-2 C 40,-8 -40,-8 -40,-2 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            {/* Eyes & Smile */}
            <circle cx="-6" cy="-4" r="2.5" fill="#0F172A" />
            <circle cx="6" cy="-4" r="2.5" fill="#0F172A" />
            <path d="M -5,4 Q 0,9 5,4" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Uranus & Neptune */}
          <circle cx="330" cy="225" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="326" cy="223" r="2" fill="#0F172A" />
          <circle cx="334" cy="223" r="2" fill="#0F172A" />
          <path d="M 327,229 Q 330,233 333,229" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

          <circle cx="230" cy="245" r="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="227" cy="243" r="1.5" fill="#0F172A" />
          <circle cx="233" cy="243" r="1.5" fill="#0F172A" />

          {/* Twinkling Stars & Dots */}
          <path d="M 175,65 L 178,55 L 181,65 L 191,68 L 181,71 L 178,81 L 175,71 L 165,68 Z" fill="#0F172A" />
          <path d="M 445,65 L 447,58 L 449,65 L 456,67 L 449,69 L 447,76 L 445,69 L 438,67 Z" fill="#0F172A" />
          <path d="M 285,175 L 287,170 L 289,175 L 294,177 L 289,179 L 287,184 L 285,179 L 280,177 Z" fill="#0F172A" />
          <circle cx="130" cy="100" r="2" fill="#0F172A" />
          <circle cx="480" cy="120" r="2.5" fill="#0F172A" />
          <circle cx="360" cy="70" r="2" fill="#0F172A" />
          <circle cx="160" cy="230" r="2" fill="#0F172A" />
        </svg>
      );

    // ------------------------------------------------------------------------
    // 2. EARTH AND ITS FEATURES
    // ------------------------------------------------------------------------
    case 'earth-features':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Large Globe with Continents and Cloud Swirls */}
          <g transform="translate(260, 140)">
            <circle cx="0" cy="0" r="95" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />

            {/* Continents */}
            <path
              d="M -65,-35 C -50,-55 -30,-65 0,-60 C 25,-55 45,-35 40,-10 C 35,15 15,25 -5,15 C -25,5 -30,25 -45,15 C -60,5 -75,-15 -65,-35 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            <path
              d="M -30,30 C -15,25 5,35 15,55 C 5,75 -20,80 -35,65 C -45,55 -40,35 -30,30 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            <path
              d="M 25,-40 C 45,-45 70,-30 75,-10 C 65,10 45,5 35,-15 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2"
            />

            {/* Swirling Clouds */}
            <path
              d="M -75,-10 C -50,-20 -20,-15 10,-25 C 35,-35 60,-20 80,-15"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M -50,45 C -20,35 20,45 60,30"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Atmosphere Halo Rim */}
            <circle cx="0" cy="0" r="102" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="5 4" />
          </g>

          {/* Tiny Orbiting Satellite */}
          <g transform="translate(420, 65) rotate(25)">
            <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            {/* Solar Wings */}
            <rect x="-28" y="-6" width="16" height="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <line x1="-20" y1="-6" x2="-20" y2="6" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="12" y="-6" width="16" height="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <line x1="20" y1="-6" x2="20" y2="6" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3" fill="#0F172A" />
          </g>

          {/* Cozy Crescent Moon */}
          <g transform="translate(435, 195)">
            <path
              d="M 12,-15 C 2,-15 -8,-5 -8,8 C -8,21 2,31 15,31 C 6,27 0,18 0,8 C 0,-2 5,-11 12,-15 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            {/* Moon Eye */}
            <circle cx="2" cy="6" r="1.5" fill="#0F172A" />
          </g>

          {/* Twinkling Stars & Orbit Dust */}
          <path d="M 140,55 L 143,47 L 146,55 L 154,58 L 146,61 L 143,69 L 140,61 L 132,58 Z" fill="#0F172A" />
          <path d="M 370,195 L 372,189 L 374,195 L 380,197 L 374,199 L 372,205 L 370,199 L 364,197 Z" fill="#0F172A" />
          <circle cx="160" cy="110" r="2.5" fill="#0F172A" />
          <circle cx="180" cy="170" r="2" fill="#0F172A" />
          <circle cx="410" cy="135" r="2" fill="#0F172A" />

          {/* Bold Label: Earth & Features */}
          <text
            x="38"
            y="175"
            fontFamily="'Exo', sans-serif"
            fontSize="26"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            Earth
          </text>
          <text
            x="38"
            y="205"
            fontFamily="'Exo', sans-serif"
            fontSize="24"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            & Features
          </text>
        </svg>
      );

    // ------------------------------------------------------------------------
    // 3. MOON AND EXPLORATION
    // ------------------------------------------------------------------------
    case 'moon-exploration':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Big Cratered Moon in Center */}
          <g transform="translate(265, 115)">
            <circle cx="0" cy="0" r="75" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
            {/* Prominent Craters */}
            <circle cx="-25" cy="-25" r="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="-25" cy="-25" r="10" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="2 2" />

            <circle cx="25" cy="-20" r="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="-35" cy="20" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="15" cy="30" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="15" cy="30" r="12" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="2 2" />

            <circle cx="45" cy="5" r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="-5" cy="-45" r="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="-5" cy="5" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          </g>

          {/* Lunar Ground Horizon */}
          <path
            d="M 0,230 Q 150,215 300,230 T 500,220 L 500,280 L 0,280 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="3"
          />

          {/* Smiling Lunar Rover (Bottom Right) */}
          <g transform="translate(370, 205)">
            {/* Chassis Body */}
            <rect x="-28" y="-18" width="56" height="20" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            {/* Antenna Dish */}
            <path d="M 12,-32 C 18,-38 28,-34 26,-22 C 22,-20 14,-22 12,-32 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <line x1="12" y1="-26" x2="6" y2="-18" stroke="#0F172A" strokeWidth="2" />

            {/* Rover Eyes & Smile */}
            <circle cx="-14" cy="-9" r="2.5" fill="#0F172A" />
            <circle cx="-2" cy="-9" r="2.5" fill="#0F172A" />
            <path d="M -12,-3 Q -8,1 -4,-3" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

            {/* 4 Chunky Wheels */}
            <circle cx="-22" cy="7" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="-22" cy="7" r="4" fill="#0F172A" />
            <circle cx="-6" cy="7" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="-6" cy="7" r="4" fill="#0F172A" />
            <circle cx="10" cy="7" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="10" cy="7" r="4" fill="#0F172A" />
            <circle cx="26" cy="7" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="26" cy="7" r="4" fill="#0F172A" />
          </g>

          {/* Planted Flag with Planet Emblem */}
          <g transform="translate(440, 180)">
            <line x1="0" y1="0" x2="0" y2="45" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 0,0 L 35,0 L 28,15 L 35,30 L 0,30 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            {/* Ringed Planet Emblem on Flag */}
            <circle cx="16" cy="15" r="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <ellipse cx="16" cy="15" rx="8" ry="2.5" stroke="#0F172A" strokeWidth="1.5" />
          </g>

          {/* Twinkling Stars */}
          <path d="M 380,60 L 382,53 L 384,60 L 391,62 L 384,64 L 382,71 L 380,64 L 373,62 Z" fill="#0F172A" />
          <path d="M 450,110 L 452,105 L 454,110 L 459,112 L 454,114 L 452,119 L 450,114 L 445,112 Z" fill="#0F172A" />
          <circle cx="140" cy="70" r="2" fill="#0F172A" />

          {/* Bold Label: Moon & Exploration */}
          <text
            x="38"
            y="175"
            fontFamily="'Exo', sans-serif"
            fontSize="26"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            Moon &
          </text>
          <text
            x="38"
            y="205"
            fontFamily="'Exo', sans-serif"
            fontSize="24"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            Exploration
          </text>
        </svg>
      );

    // ------------------------------------------------------------------------
    // 4. ASTRONAUTS AND SPACE TRAVEL
    // ------------------------------------------------------------------------
    case 'astronauts-space-travel':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Adorable Floating Astronaut (Center Right) */}
          <g transform="translate(370, 105)">
            {/* Spacesuit Helmet */}
            <circle cx="0" cy="0" r="32" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
            {/* Visor */}
            <rect x="-20" y="-14" width="40" height="28" rx="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            {/* Happy Face inside Helmet */}
            <circle cx="-7" cy="-2" r="3" fill="#0F172A" />
            <circle cx="7" cy="-2" r="3" fill="#0F172A" />
            <path d="M -5,6 Q 0,11 5,6" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="-13" cy="3" r="2" fill="#CBD5E1" />
            <circle cx="13" cy="3" r="2" fill="#CBD5E1" />

            {/* Astronaut Torso */}
            <path
              d="M -18,30 C -22,40 -20,65 -15,75 L 15,75 C 20,65 22,40 18,30 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="3"
            />
            {/* Chest Control Box */}
            <rect x="-10" y="40" width="20" height="15" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="-4" cy="47" r="2" fill="#0F172A" />
            <circle cx="4" cy="47" r="2" fill="#0F172A" />

            {/* Waving Arm Left */}
            <path
              d="M -18,38 C -35,32 -48,20 -45,5 C -42,-5 -30,-5 -24,8"
              stroke="#0F172A"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Waving Glove Left */}
            <circle cx="-45" cy="5" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

            {/* Arm Right */}
            <path
              d="M 18,38 C 32,45 42,55 45,68"
              stroke="#0F172A"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="45" cy="68" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

            {/* Legs & Boots */}
            <path
              d="M -12,75 L -18,105 L -26,108 C -32,108 -32,118 -22,118 L -6,118 L -4,75"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 12,75 L 18,105 L 26,108 C 32,108 32,118 22,118 L 6,118 L 4,75"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Drifting Retro Space Shuttle (Bottom Right) */}
          <g transform="translate(425, 205) rotate(-15)">
            {/* Fuselage */}
            <path
              d="M 35,0 C 25,-12 -15,-14 -35,-10 L -40,10 C -15,14 25,12 35,0 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            {/* Cockpit Window with Smile */}
            <path d="M 22,-5 L 12,-6 L 10,2 L 20,3 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="16" cy="-1" r="1.5" fill="#0F172A" />

            {/* Delta Wing */}
            <path d="M -5,8 L -30,22 L -35,10 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            {/* Vertical Tail Fin */}
            <path d="M -22,-8 L -32,-26 L -40,-12 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          </g>

          {/* Stars & Floating Sparkles */}
          <path d="M 285,45 L 288,38 L 291,45 L 298,47 L 291,49 L 288,56 L 285,49 L 278,47 Z" fill="#0F172A" />
          <path d="M 455,50 L 457,44 L 459,50 L 465,52 L 459,54 L 457,60 L 455,54 L 449,52 Z" fill="#0F172A" />
          <circle cx="300" cy="180" r="2" fill="#0F172A" />
          <circle cx="280" cy="120" r="2.5" fill="#0F172A" />

          {/* Bold Label: Astronauts & Travel */}
          <text
            x="38"
            y="175"
            fontFamily="'Exo', sans-serif"
            fontSize="26"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            Astronauts
          </text>
          <text
            x="38"
            y="205"
            fontFamily="'Exo', sans-serif"
            fontSize="24"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            & Travel
          </text>
        </svg>
      );

    // ------------------------------------------------------------------------
    // 5. GALAXIES AND NEBULAE
    // ------------------------------------------------------------------------
    case 'galaxies-nebulae':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Swirling Spiral Galaxy (Milky Way) Center */}
          <g transform="translate(250, 140)">
            {/* Multiple logarithmic spiral arcs */}
            <path
              d="M 0,0 C 20,5 30,-15 20,-30 C 5,-45 -35,-35 -50,-10 C -70,20 -50,65 -10,80 C 40,95 100,65 120,10 C 140,-50 90,-115 20,-130 C -60,-145 -140,-85 -160,-5"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 0,0 C -20,-5 -30,15 -20,30 C -5,45 35,35 50,10 C 70,-20 50,-65 10,-80 C -40,-95 -100,-65 -120,-10 C -140,50 -90,115 -20,130 C 60,145 140,85 160,5"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Inner Spiral Nucleus */}
            <ellipse cx="0" cy="0" rx="24" ry="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <circle cx="0" cy="0" r="8" fill="#0F172A" />

            {/* Fluffy Cosmic Gas Clouds */}
            <path
              d="M -180,-70 C -160,-95 -130,-90 -115,-75 C -100,-90 -70,-85 -60,-65"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 80,95 C 100,120 135,115 150,95 C 170,115 200,105 210,85"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Twinkling Star Clusters */}
          <path d="M 85,60 L 88,52 L 91,60 L 98,62 L 91,64 L 88,72 L 85,64 L 78,62 Z" fill="#0F172A" />
          <path d="M 425,50 L 427,43 L 429,50 L 436,52 L 429,54 L 427,61 L 425,54 L 418,52 Z" fill="#0F172A" />
          <path d="M 410,210 L 412,204 L 414,210 L 420,212 L 414,214 L 412,220 L 410,214 L 404,212 Z" fill="#0F172A" />
          <circle cx="70" cy="180" r="2.5" fill="#0F172A" />
          <circle cx="110" cy="220" r="2" fill="#0F172A" />
          <circle cx="440" cy="130" r="2.5" fill="#0F172A" />
          <circle cx="360" cy="40" r="2" fill="#0F172A" />
        </svg>
      );

    // ------------------------------------------------------------------------
    // 6. ROCKETS AND SATELLITES
    // ------------------------------------------------------------------------
    case 'rockets-satellites':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Giant Rocket Blasting Off (Center) */}
          <g transform="translate(295, 125) rotate(-35)">
            {/* Rocket Body */}
            <path
              d="M 0,-70 C 20,-45 22,20 18,50 L -18,50 C -22,20 -20,-45 0,-70 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="3.5"
            />
            {/* Nose Cone Tip */}
            <path d="M 0,-70 C 10,-55 -10,-55 0,-70 Z" fill="#0F172A" />
            <line x1="-12" y1="-45" x2="12" y2="-45" stroke="#0F172A" strokeWidth="2.5" />

            {/* Porthole Window with Smiling Astronaut */}
            <circle cx="0" cy="-15" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="0" cy="-15" r="10" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="-3" cy="-16" r="1.5" fill="#0F172A" />
            <circle cx="3" cy="-16" r="1.5" fill="#0F172A" />
            <path d="M -3,-12 Q 0,-9 3,-12" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

            {/* Left and Right Fins */}
            <path d="M -18,25 L -36,55 L -18,50 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 18,25 L 36,55 L 18,50 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

            {/* Roaring Rocket Flames */}
            <path
              d="M -12,50 L -18,75 L -6,65 L 0,85 L 6,65 L 18,75 L 12,50 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Billowy Exhaust Smoke Clouds Below Rocket */}
          <g transform="translate(365, 230)">
            <path
              d="M -50,-10 C -65,-30 -35,-50 -15,-35 C 0,-55 35,-45 40,-25 C 60,-35 85,-10 75,15 C 60,35 -20,35 -50,-10 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
          </g>

          {/* Orbiting Satellite with Solar Arrays (Bottom-Right) */}
          <g transform="translate(440, 185) rotate(20)">
            {/* Satellite Body */}
            <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#0F172A" />
            {/* Solar Arrays */}
            <rect x="-30" y="-8" width="18" height="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <line x1="-21" y1="-8" x2="-21" y2="8" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="-30" y1="0" x2="-12" y2="0" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="12" y="-8" width="18" height="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <line x1="21" y1="-8" x2="21" y2="8" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="12" y1="0" x2="30" y2="0" stroke="#0F172A" strokeWidth="1.5" />
          </g>

          {/* Twinkling Stars */}
          <path d="M 235,50 L 237,43 L 239,50 L 246,52 L 239,54 L 237,61 L 235,54 L 228,52 Z" fill="#0F172A" />
          <circle cx="390" cy="45" r="2" fill="#0F172A" />
          <circle cx="470" cy="90" r="2.5" fill="#0F172A" />

          {/* Bold Label: Rockets & Satellites */}
          <text
            x="38"
            y="175"
            fontFamily="'Exo', sans-serif"
            fontSize="26"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            Rockets &
          </text>
          <text
            x="38"
            y="205"
            fontFamily="'Exo', sans-serif"
            fontSize="24"
            fontWeight="900"
            fill="#0F172A"
            letterSpacing="-0.5"
          >
            Satellites
          </text>
        </svg>
      );

    // ------------------------------------------------------------------------
    // 7. MARS AND ALIEN WORLDS
    // ------------------------------------------------------------------------
    case 'mars-alien-worlds':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Martian Dune Horizon */}
          <path
            d="M 0,220 Q 150,195 300,225 T 500,210 L 500,280 L 0,280 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="3"
          />

          {/* Cute Robot Mars Rover (Center Left) */}
          <g transform="translate(260, 195)">
            {/* Rover Mast & Head */}
            <rect x="-16" y="-55" width="32" height="22" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            {/* Robot Eyes & Smile on Head Screen */}
            <circle cx="-6" cy="-45" r="3.5" fill="#0F172A" />
            <circle cx="6" cy="-45" r="3.5" fill="#0F172A" />
            <path d="M -4,-39 Q 0,-36 4,-39" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            {/* Antenna */}
            <line x1="0" y1="-55" x2="0" y2="-66" stroke="#0F172A" strokeWidth="2" />
            <circle cx="0" cy="-68" r="3" fill="#0F172A" />

            {/* Neck Mast */}
            <rect x="-4" y="-33" width="8" height="15" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

            {/* Chassis Body */}
            <rect x="-26" y="-18" width="52" height="20" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

            {/* Robotic Arm with Gripper */}
            <path d="M 22,-8 L 38,-18 L 44,-8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="45" cy="-8" r="3" fill="#0F172A" />

            {/* 4 Chunky Rocker Wheels */}
            <circle cx="-20" cy="8" r="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="-20" cy="8" r="4" fill="#0F172A" />
            <circle cx="-5" cy="8" r="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="-5" cy="8" r="4" fill="#0F172A" />
            <circle cx="12" cy="8" r="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="12" cy="8" r="4" fill="#0F172A" />
            <circle cx="27" cy="8" r="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="27" cy="8" r="4" fill="#0F172A" />
          </g>

          {/* Research Habitat Biodomes (Center Right) */}
          <g transform="translate(380, 205)">
            {/* Dome 1 */}
            <path d="M -30,0 C -30,-35 15,-35 15,0 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M -15,-28 L -5,0" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 0,-28 L -15,0" stroke="#0F172A" strokeWidth="1.5" />

            {/* Main Dome with Alien Terrarium */}
            <path d="M 10,0 C 10,-50 70,-50 70,0 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            {/* Cute alien plants inside dome */}
            <path d="M 30,-5 C 28,-22 34,-25 34,-15 C 34,-5 30,-5 30,-5 Z" stroke="#0F172A" strokeWidth="2" fill="none" />
            <circle cx="34" cy="-22" r="3" fill="#0F172A" />
            <path d="M 50,-5 C 48,-25 55,-28 55,-18 C 55,-8 50,-5 50,-5 Z" stroke="#0F172A" strokeWidth="2" fill="none" />
            <circle cx="55" cy="-25" r="3.5" fill="#0F172A" />
          </g>

          {/* Foreground Crater */}
          <ellipse cx="330" cy="245" rx="35" ry="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

          {/* Phobos Crescent Moon in Sky */}
          <path
            d="M 280,45 C 274,45 268,51 268,60 C 268,69 274,75 282,75 C 276,72 272,66 272,60 C 272,54 276,48 280,45 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="2"
          />

          {/* Twinkling Stars */}
          <path d="M 430,70 L 432,63 L 434,70 L 441,72 L 434,74 L 432,81 L 430,74 L 423,72 Z" fill="#0F172A" />
          <circle cx="350" cy="60" r="2" fill="#0F172A" />
          <circle cx="475" cy="115" r="2" fill="#0F172A" />
        </svg>
      );

    // ------------------------------------------------------------------------
    // 8. STARS AND SPACE MYSTERIES
    // ------------------------------------------------------------------------
    case 'stars-mysteries':
      return (
        <svg
          viewBox="0 0 500 280"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Swirling Black Hole with Accretion Funnel on Right */}
          <g transform="translate(370, 140)">
            {/* Multiple logarithmic gravitational whirlpool spiral arcs */}
            <path
              d="M 0,0 C 18,3 25,-12 15,-25 C 2,-38 -30,-30 -42,-8 C -58,18 -42,55 -8,68 C 34,80 85,55 102,8 C 118,-42 76,-98 17,-110 C -51,-122 -119,-72 -136,-4"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 0,0 C -18,-3 -25,12 -15,25 C -2,38 30,30 42,8 C 58,-18 42,-55 8,-68 C -34,-80 -85,-55 -102,-8 C -118,42 -76,98 -17,110 C 51,122 119,72 136,4"
              stroke="#0F172A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Inner Swirl Arcs */}
            <path d="M -25,15 C -35,-5 -20,-28 5,-25 C 25,-22 35,-5 25,18" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M -45,-30 C -15,-55 25,-45 45,-15" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

            {/* Black Hole Shadow Eye */}
            <circle cx="0" cy="0" r="22" fill="#0F172A" />
            <circle cx="0" cy="0" r="14" fill="#000000" />
          </g>

          {/* Streaking Meteor with Long Tail (Bottom Left) */}
          <g transform="translate(180, 205) rotate(35)">
            {/* Meteor Rock Core */}
            <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <circle cx="-3" cy="-3" r="3" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="4" cy="2" r="2.5" stroke="#0F172A" strokeWidth="1.5" />
            {/* Long Flame Speed Tail */}
            <path
              d="M -12,-8 L -65,-25 L -45,-5 L -95,-10 L -45,5 L -65,25 L -12,8"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Shooting Star Streak Upper-Left */}
          <g transform="translate(195, 75) rotate(-25)">
            <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="-8" y1="0" x2="-45" y2="0" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-6" y1="-4" x2="-35" y2="-4" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-6" y1="4" x2="-35" y2="4" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Star Cluster / Nursery (Upper Left) */}
          <path d="M 85,55 L 88,46 L 91,55 L 100,58 L 91,61 L 88,70 L 85,61 L 76,58 Z" fill="#0F172A" />
          <path d="M 125,95 L 127,89 L 129,95 L 135,97 L 129,99 L 127,105 L 125,99 L 119,97 Z" fill="#0F172A" />
          <path d="M 60,115 L 62,109 L 64,115 L 70,117 L 64,119 L 62,125 L 60,119 L 54,117 Z" fill="#0F172A" />

          {/* Cosmic Dots */}
          <circle cx="105" cy="140" r="2" fill="#0F172A" />
          <circle cx="150" cy="120" r="2.5" fill="#0F172A" />
          <circle cx="230" cy="155" r="2" fill="#0F172A" />
        </svg>
      );

    default:
      return null;
  }
};
