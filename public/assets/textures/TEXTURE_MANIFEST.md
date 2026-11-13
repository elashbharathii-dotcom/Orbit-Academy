# ORBIT ACADEMY — Planetary Texture Manifest (Phase 6C)

This manifest documents the provenance, licensing, resolution, and astronomical data sources for all photographic and equirectangular planetary texture maps utilized within ORBIT ACADEMY.

## Licensing & Attribution Standard

All photographic texture assets in this directory are sourced from **Solar System Scope** ([solarsystemscope.com/textures](https://www.solarsystemscope.com/textures/)), synthesized from authentic NASA, USGS, ESA, and JPL spacecraft missions, and distributed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

> **Official Attribution**:
> *"Planetary textures courtesy of Solar System Scope (https://www.solarsystemscope.com), derived from NASA, JPL, and USGS elevation and imagery data."*

---

## Texture Inventory

| Celestial Body | Asset Filename | Resolution | Source URL | Scientific Basis / Spacecraft Data | License | Attribution |
|---|---|---|---|---|---|---|
| **Sun (Sol)** | `sun.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_sun.jpg` | NASA SOHO / SDO (Solar Dynamics Observatory) photosphere imagery; granulation and sunspot mosaic | CC BY 4.0 | Solar System Scope / NASA SDO |
| **Mercury** | `mercury.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_mercury.jpg` | NASA MESSENGER spacecraft orbital MDIS global monochrome/albedo mosaic | CC BY 4.0 | Solar System Scope / NASA / JHUAPL / CIW |
| **Venus (Atmosphere)** | `venus_atmosphere.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg` | NASA Pioneer Venus Orbiter & Mariner 10 ultraviolet/visible cloud deck imagery | CC BY 4.0 | Solar System Scope / NASA |
| **Venus (Surface)** | `venus_surface.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg` | NASA Magellan spacecraft synthetic aperture radar (SAR) altimetry mosaic | CC BY 4.0 | Solar System Scope / NASA / JPL |
| **Earth (Day)** | `earth_daymap.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg` | NASA Visible Earth / Blue Marble (Terra MODIS) true-color composite land & bathymetry | CC BY 4.0 | Solar System Scope / NASA GSFC |
| **Earth (Night Lights)** | `earth_nightmap.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg` | NASA Suomi NPP VIIRS (Day-Night Band) Earth at Night composite | CC BY 4.0 | Solar System Scope / NASA Earth Observatory |
| **Earth (Clouds)** | `earth_clouds.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg` | NASA Terra & Aqua MODIS synchronized global cloud cover composite | CC BY 4.0 | Solar System Scope / NASA |
| **Mars** | `mars.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_mars.jpg` | USGS Astrogeology / NASA Viking Orbiter Mars Digital Image Model (MDIM 2.1) + MGS MOLA | CC BY 4.0 | Solar System Scope / USGS / NASA JPL |
| **Jupiter** | `jupiter.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg` | NASA Cassini-Huygens ISS flyby cylindrical projection + JunoCam belt features | CC BY 4.0 | Solar System Scope / NASA / JPL / SSI |
| **Saturn (Globe)** | `saturn.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_saturn.jpg` | NASA Cassini Imaging Science Subsystem (ISS) multi-spectral equatorial mosaic | CC BY 4.0 | Solar System Scope / NASA / JPL / SSI |
| **Saturn (Rings)** | `saturn_ring.png` | 2048 × 128 (Radial RGBA) | `https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png` | NASA Cassini ISS radio/optical occultation measurements of ring density, Cassini Division, and ice-dust coloration | CC BY 4.0 | Solar System Scope / NASA |
| **Uranus** | `uranus.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_uranus.jpg` | NASA Voyager 2 Narrow-Angle Camera true-color composite with subtle methane absorption | CC BY 4.0 | Solar System Scope / NASA / JPL |
| **Neptune** | `neptune.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_neptune.jpg` | NASA Voyager 2 flyby imagery adjusted for natural deep azure Rayleigh/methane tones | CC BY 4.0 | Solar System Scope / NASA / JPL |
| **Milky Way & Stars** | `milky_way.jpg` | 2048 × 1024 | `https://www.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg` | ESA Gaia DR2 & NASA Tycho-2 astronomical all-sky star & dust survey projection | CC BY 4.0 | Solar System Scope / ESA / NASA |

---

## Architectural Notes
1. **Resolution Selection**: 2048 × 1024 (2K) represents the optimal balance for interactive WebGL 60 FPS performance on laptops and mobile devices, avoiding the 40+ MB memory footprint of 4K/8K uncompressed textures.
2. **Procedural Fallback**: All Three.js loaders are backed by the procedural canvas generator in `src/utils/textureGenerator.ts`. If an image fails to load or during offline unit testing, the procedural shader texture displays instantaneously without breaking the WebGL pipeline.
3. **Color Space**: Textures are loaded into Three.js with `colorSpace = THREE.SRGBColorSpace` for authentic photometric gamma rendering under physically correct lighting.

