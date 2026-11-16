import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { SpaceButton } from '../../components/ui/SpaceButton';
import { FastForward, Zap, Shield, Radio, Compass, Crosshair } from 'lucide-react';
import { QuizCategoryMeta } from './quizData';

interface CinematicAircraftLaunchProps {
  categoryMeta: QuizCategoryMeta;
  difficulty: string;
  questionCount: number;
  isTimedBlitz: boolean;
  onLaunchComplete: () => void;
}

export const CinematicAircraftLaunch: React.FC<CinematicAircraftLaunchProps> = ({
  categoryMeta,
  difficulty,
  questionCount,
  isTimedBlitz,
  onLaunchComplete,
}) => {
  // Cinematic Scenes:
  // 1: Scene A - Mission Activation (0 - 1.3s)
  // 2: Scene B - 3D Aircraft Appears in Rear 3/4 View (1.3 - 2.6s)
  // 3: Scene C - Forward Flight into Screen Depth toward Vanishing Point (2.6 - 4.6s)
  // 4: Scene D - Inside Cockpit Reveal & 3-2-1 Countdown (4.6 - 6.2s)
  // 5: Scene E - Enter Quiz HUD Transition (6.2s+)
  const [scene, setScene] = useState<number>(1);
  const [countdown, setCountdown] = useState<number>(3);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Skip handler
  const handleSkip = useCallback(() => {
    onLaunchComplete();
  }, [onLaunchComplete]);

  // Keyboard shortcut: Escape or Space to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Timeline progression
  useEffect(() => {
    const t1 = setTimeout(() => setScene(2), 1300);
    const t2 = setTimeout(() => setScene(3), 2600);
    const t3 = setTimeout(() => setScene(4), 4600);
    const tCountdown2 = setTimeout(() => setCountdown(2), 5100);
    const tCountdown1 = setTimeout(() => setCountdown(1), 5600);
    const t4 = setTimeout(() => setScene(5), 6100);
    const t5 = setTimeout(() => onLaunchComplete(), 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tCountdown2);
      clearTimeout(tCountdown1);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onLaunchComplete]);

  // ---------------------------------------------------------------------------
  // Three.js 3D Perspective Flight Engine
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera & WebGL Renderer
    const threeScene = new THREE.Scene();
    threeScene.fog = new THREE.FogExp2(0x030611, 0.012);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x38ddf8, 0.7);
    threeScene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(5, 10, 7);
    threeScene.add(sunLight);

    const engineLight = new THREE.PointLight(0x38ddf8, 5, 20);
    threeScene.add(engineLight);

    // 3. Vanishing Point Destination Planet in the Deep Background
    const planetGroup = new THREE.Group();
    planetGroup.position.set(0, 0.5, -110);

    const planetGeo = new THREE.SphereGeometry(14, 32, 32);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.8,
    });
    const destinationPlanet = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(destinationPlanet);

    // Planetary Atmosphere Glow Ring
    const atmosphereGeo = new THREE.RingGeometry(15, 22, 48);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38ddf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const atmosphereRing = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphereRing.rotation.x = Math.PI / 2.5;
    planetGroup.add(atmosphereRing);

    threeScene.add(planetGroup);

    // 4. Starfield Depth Tunnel
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starBaseZ = new Float32Array(starCount);

    const colorPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x38ddf8),
      new THREE.Color(0xa78bfa),
      new THREE.Color(0xe879f9),
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 80;
      starPositions[idx + 1] = (Math.random() - 0.5) * 50;
      const z = -Math.random() * 140;
      starPositions[idx + 2] = z;
      starBaseZ[i] = z;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[idx] = c.r;
      starColors[idx + 1] = c.g;
      starColors[idx + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMat);
    threeScene.add(starField);

    // 5. Procedural 3D Spacecraft (True 3D Model with Real Depth)
    const ship = new THREE.Group();

    // Hull Materials
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8,
    });
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.7,
    });
    const canopyMat = new THREE.MeshPhysicalMaterial({
      color: 0x38ddf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const engineNozzleMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.2,
    });
    const plasmaMat = new THREE.MeshBasicMaterial({
      color: 0x38ddf8,
      transparent: true,
      opacity: 0.85,
    });

    // Central Fuselage
    const fuselageGeo = new THREE.ConeGeometry(0.7, 4.2, 8);
    const fuselage = new THREE.Mesh(fuselageGeo, hullMat);
    fuselage.rotation.x = -Math.PI / 2;
    ship.add(fuselage);

    // Cockpit Canopy (Top Front)
    const canopyGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.scale.set(0.75, 0.6, 2.0);
    canopy.position.set(0, 0.35, -0.6);
    ship.add(canopy);

    // Left Swept Delta Wing
    const leftWingGeo = new THREE.BufferGeometry();
    const leftWingVerts = new Float32Array([
      0, 0, 0.8,   // Root trailing
      -3.4, 0, 1.6, // Wing tip trailing
      0, 0, -1.8,  // Root leading
    ]);
    leftWingGeo.setAttribute('position', new THREE.BufferAttribute(leftWingVerts, 3));
    leftWingGeo.computeVertexNormals();
    const leftWing = new THREE.Mesh(leftWingGeo, wingMat);
    ship.add(leftWing);

    // Right Swept Delta Wing
    const rightWingGeo = new THREE.BufferGeometry();
    const rightWingVerts = new Float32Array([
      0, 0, 0.8,
      3.4, 0, 1.6,
      0, 0, -1.8,
    ]);
    rightWingGeo.setAttribute('position', new THREE.BufferAttribute(rightWingVerts, 3));
    rightWingGeo.computeVertexNormals();
    const rightWing = new THREE.Mesh(rightWingGeo, wingMat);
    ship.add(rightWing);

    // Twin Vertical Stabilizers
    const finGeo = new THREE.ConeGeometry(0.12, 1.4, 4);
    const leftFin = new THREE.Mesh(finGeo, wingMat);
    leftFin.position.set(-0.7, 0.6, 1.2);
    leftFin.rotation.z = -0.3;
    leftFin.rotation.x = -0.2;
    ship.add(leftFin);

    const rightFin = new THREE.Mesh(finGeo, wingMat);
    rightFin.position.set(0.7, 0.6, 1.2);
    rightFin.rotation.z = 0.3;
    rightFin.rotation.x = -0.2;
    ship.add(rightFin);

    // Twin Ion Engine Nozzles (Rear)
    const nozzleGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.6, 16);
    const leftNozzle = new THREE.Mesh(nozzleGeo, engineNozzleMat);
    leftNozzle.position.set(-0.45, 0, 1.9);
    leftNozzle.rotation.x = Math.PI / 2;
    ship.add(leftNozzle);

    const rightNozzle = new THREE.Mesh(nozzleGeo, engineNozzleMat);
    rightNozzle.position.set(0.45, 0, 1.9);
    rightNozzle.rotation.x = Math.PI / 2;
    ship.add(rightNozzle);

    // Glowing Ion Exhaust Cones (Plasma Plumes)
    const plumeGeo = new THREE.ConeGeometry(0.25, 2.5, 16);
    const leftPlume = new THREE.Mesh(plumeGeo, plasmaMat);
    leftPlume.position.set(-0.45, 0, 3.2);
    leftPlume.rotation.x = Math.PI / 2;
    ship.add(leftPlume);

    const rightPlume = new THREE.Mesh(plumeGeo, plasmaMat);
    rightPlume.position.set(0.45, 0, 3.2);
    rightPlume.rotation.x = Math.PI / 2;
    ship.add(rightPlume);

    // Orientation: Three-Quarter Rear Perspective View
    // Looking slightly from behind, angled toward the front
    ship.position.set(0, -0.4, 0);
    ship.rotation.set(0.12, 0.22, -0.06);
    threeScene.add(ship);

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop Variables
    let startTime = performance.now();
    let currentZ = 0;
    let flightVelocity = 0;

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / 1000; // in seconds

      // SCENE A & B: Idle hover vibration (0s - 2.6s)
      if (elapsed < 2.6) {
        ship.position.y = -0.4 + Math.sin(elapsed * 6) * 0.04;
        ship.rotation.z = -0.06 + Math.cos(elapsed * 4) * 0.02;
        leftPlume.scale.set(1, 0.8 + Math.sin(elapsed * 20) * 0.2, 1);
        rightPlume.scale.set(1, 0.8 + Math.sin(elapsed * 20) * 0.2, 1);
        engineLight.position.set(ship.position.x, ship.position.y, ship.position.z + 2);
      }
      // SCENE C: Dramatic Forward Flight into Screen Depth toward Vanishing Point (2.6s - 4.6s)
      else if (elapsed >= 2.6 && elapsed < 4.6) {
        const flightTime = elapsed - 2.6; // 0 to 2.0s
        // Exponential acceleration forward along -Z
        flightVelocity = Math.pow(flightTime * 1.5, 2.5) * 8;
        currentZ -= flightVelocity * 0.016;

        ship.position.z = currentZ;
        // Move toward vanishing point destination
        ship.position.x = Math.sin(flightTime * 2) * 0.5;
        ship.position.y = -0.4 + (flightTime * 0.45);
        // Bank into flight vector
        ship.rotation.z = -0.06 + Math.sin(flightTime * 3) * 0.15;
        ship.rotation.y = 0.22 * Math.max(0, 1 - flightTime * 0.8);

        // Huge ion plume expansion
        const plumeScale = Math.min(3.5, 1 + flightTime * 1.8);
        leftPlume.scale.set(plumeScale * 0.6, plumeScale, plumeScale * 0.6);
        rightPlume.scale.set(plumeScale * 0.6, plumeScale, plumeScale * 0.6);

        // Starfield streaks rushing past camera
        const posAttr = starGeo.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;
        for (let i = 0; i < starCount; i++) {
          const zIdx = i * 3 + 2;
          array[zIdx] += flightVelocity * 0.035;
          if (array[zIdx] > 10) {
            array[zIdx] = -140;
          }
        }
        posAttr.needsUpdate = true;

        // Camera smoothly follows behind
        camera.position.z = Math.max(1.5, 5.5 - flightTime * 1.8);
        camera.lookAt(ship.position.x, ship.position.y, ship.position.z - 10);
      }
      // SCENE D: Camera enters spacecraft cockpit canopy
      else if (elapsed >= 4.6) {
        // Deep in space
        ship.position.z = -80;
      }

      // Rotate destination planet
      destinationPlanet.rotation.y += 0.003;

      renderer.render(threeScene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030611] select-none font-sans">
      {/* 1. Fullscreen Three.js WebGL 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* 2. Ambient Cosmic Glow Gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${scene >= 3 ? 'opacity-80' : 'opacity-40'
          }`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${categoryMeta.glowColor} 0%, rgba(56, 221, 248, 0.12) 40%, transparent 80%)`,
        }}
      />

      {/* 3. Top HUD Navigation / Telemetry Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#38DDF8] animate-ping" />
          <div className="flex flex-col">
            <span className="font-mono text-xs text-[#38DDF8] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5" />
              <span>ORBIT ACADEMY FLIGHT PROTOCOL // ACTIVE</span>
            </span>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              TARGET ARENA: {categoryMeta.label.toUpperCase()} • TIER: {difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Skip Animation Button */}
        <SpaceButton
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          icon={FastForward}
          iconPosition="right"
          className="border border-white/20 bg-black/50 backdrop-blur-md text-white hover:bg-white/10 text-xs font-mono shadow-[0_0_20px_rgba(0,0,0,0.8)] cursor-pointer"
        >
          Skip Launch [ESC]
        </SpaceButton>
      </div>

      {/* 4. Bottom HUD Systems Diagnostic Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs z-30 pointer-events-none">
        <div className="flex items-center gap-4 text-[#94A3B8]">
          <span className="flex items-center gap-1.5 text-[#34D399] font-bold">
            <Shield className="h-3.5 w-3.5" />
            <span>HULL INTEGRITY: 100%</span>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-[#38DDF8] font-bold">
            <Compass className="h-3.5 w-3.5" />
            <span>VECTOR: ORBITAL TRAJECTORY</span>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-[#FBBF24] font-bold">
            <Zap className="h-3.5 w-3.5" />
            <span>CHALLENGES: {questionCount} ARMED</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/70">
          <span>MODE:</span>
          <span className="font-bold text-[#38DDF8]">
            {isTimedBlitz ? '60s BLITZ COUNTDOWN' : 'STANDARD MISSION'}
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. CINEMATIC OVERLAYS BY SCENE                                      */}
      {/* =================================================================== */}

      {/* SCENE A: Mission Activation Overlay (0 - 1.3s) */}
      {scene === 1 && (
        <div className="relative z-20 text-center space-y-3 animate-fade-in pointer-events-none max-w-lg px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#38DDF8]/40 bg-[#38DDF8]/10 backdrop-blur-xl text-[#38DDF8] font-mono text-xs font-bold tracking-wider">
            <Zap className="h-3.5 w-3.5 animate-spin" />
            <span>MISSION ACTIVATION INITIATED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Preparing Orbital Insertion
          </h1>

          <p className="font-mono text-sm text-[#A78BFA] tracking-wide">
            {categoryMeta.label} Arena • {difficulty} Tier
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2 font-mono text-xs text-[#34D399]">
            <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/10">
              ✓ 3D FLIGHT PATH COMPUTED
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/10">
              ✓ SENSORS SYNCHRONIZED
            </span>
          </div>
        </div>
      )}

      {/* SCENE B: 3D Aircraft Appears with Engine Ignition (1.3 - 2.6s) */}
      {scene === 2 && (
        <div className="absolute top-28 z-20 text-center animate-fade-in pointer-events-none">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#38DDF8] bg-black/60 backdrop-blur-xl text-[#38DDF8] font-mono text-xs font-black tracking-widest shadow-[0_0_25px_rgba(56,221,248,0.5)]">
            <Crosshair className="h-4 w-4 animate-spin text-[#38DDF8]" />
            <span>MAIN THRUSTERS IGNITION // MAXIMUM POWER</span>
          </div>
        </div>
      )}

      {/* SCENE C: Forward Flight Into Depth Telemetry (2.6 - 4.6s) */}
      {scene === 3 && (
        <div className="absolute top-28 z-20 text-center animate-fade-in pointer-events-none">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#FBBF24] bg-black/70 backdrop-blur-xl text-[#FBBF24] font-mono text-xs font-black tracking-widest shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse">
            <Zap className="h-4 w-4 text-[#FBBF24]" />
            <span>WARP VELOCITY ENGAGED // TRAVERSING INTO SCREEN DEPTH</span>
          </div>
        </div>
      )}

      {/* SCENE D: Inside Cockpit Reveal & 3-2-1 Launch Countdown (4.6 - 6.2s) */}
      {scene === 4 && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#030611]/90 backdrop-blur-xl animate-fade-in pointer-events-none">

          {/* Cockpit Canopy Struts Overlay (Framing the inside of the aircraft) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Canopy Arch */}
            <div className="absolute top-0 left-0 right-0 h-16 border-b-2 border-[#38DDF8]/40 bg-gradient-to-b from-black via-black/80 to-transparent shadow-[0_10px_30px_rgba(0,0,0,0.9)]" />
            {/* Left Cockpit Pillar */}
            <div className="absolute top-0 bottom-0 left-0 w-20 border-r-2 border-[#38DDF8]/40 bg-gradient-to-r from-black via-black/80 to-transparent transform -skew-x-6" />
            {/* Right Cockpit Pillar */}
            <div className="absolute top-0 bottom-0 right-0 w-20 border-l-2 border-[#38DDF8]/40 bg-gradient-to-l from-black via-black/80 to-transparent transform skew-x-6" />
            {/* Bottom Dashboard Console */}
            <div className="absolute bottom-0 left-0 right-0 h-28 border-t-2 border-[#38DDF8]/40 bg-gradient-to-t from-black via-[#0B1024] to-transparent p-4 flex items-end justify-between font-mono text-[10px] text-[#38DDF8]">
              <div className="space-y-1">
                <span className="block text-[#34D399] font-bold">● FLIGHT COMPUTER: ONLINE</span>
                <span className="block text-[#94A3B8]">HEADING: 184° • PITCH: +02° • MACH: 25.4</span>
              </div>
              <div className="text-right space-y-1">
                <span className="block text-[#FBBF24] font-bold">● HUD TELEMETRY: LINKED</span>
                <span className="block text-[#94A3B8]">ATMOSPHERIC PRESSURE: 0.00 kPa</span>
              </div>
            </div>
          </div>

          {/* Center Holographic Reticle & 3-2-1 Launch Countdown */}
          <div className="relative z-50 flex flex-col items-center justify-center space-y-4">

            {/* Holographic Reticle */}
            <div className="relative flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#38DDF8] animate-spin" />
              <div className="absolute w-36 h-36 rounded-full border border-[#A78BFA] animate-ping opacity-60" />

              {/* Massive Countdown Number */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#38DDF8] to-[#0284C7] filter drop-shadow-[0_0_35px_#38DDF8]">
                  {countdown}
                </span>
              </div>
            </div>

            <span className="font-mono text-sm uppercase tracking-widest text-[#38DDF8] font-bold bg-black/60 px-5 py-1.5 rounded-full border border-[#38DDF8]/50 shadow-[0_0_20px_rgba(56,221,248,0.5)]">
              ENTERING PILOT COCKPIT HUD
            </span>
          </div>

        </div>
      )}

      {/* SCENE E: Seamless Flash Fade into Quiz (6.2s+) */}
      {scene === 5 && (
        <div className="absolute inset-0 z-50 bg-[#030611] transition-opacity duration-300 pointer-events-none" />
      )}

    </div>
  );
};
