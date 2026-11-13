import { useState, useEffect, useRef, useCallback } from 'react';
import { CelestialId } from '../../types';
import { StardustParticle } from './LauraFlightTrail';

interface UseLauraFlightOptions {
  selectedPlanetId: CelestialId | null;
  isChatOpen: boolean;
  isThinking: boolean;
}

export interface FlightState {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  particles: StardustParticle[];
  speechAnchor: {
    left: number;
    top: number;
    pointerDirection: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  };
}

const GLYPHS = ['✦', '✧', '★', '⋆'];

/**
 * Autonomous Celestial Flight Controller (Phase 6D)
 * 
 * Capabilities:
 * - Fluid physics interpolation (damped pursuit with natural acceleration/deceleration)
 * - Autonomous context-aware waypoints (home, planet observation post, idle drift)
 * - Flight banking and organic hovering sine wave
 * - Dynamic speech balloon anchoring that never overflows the viewport
 * - Sparkling stardust trail emission during flight
 * - Full respect for prefers-reduced-motion
 */
export function useLauraFlight({
  selectedPlanetId,
  isChatOpen,
}: UseLauraFlightOptions) {
  // Check reduced motion preference
  const prefersReducedMotion = useRef<boolean>(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Position & Velocity Refs (for 60fps RAF loop without React re-render overhead)
  const currentPos = useRef<{ x: number; y: number }>({
    x: 52,
    y: typeof window !== 'undefined' ? window.innerHeight - 110 : 600,
  });
  const targetPos = useRef<{ x: number; y: number }>({
    x: 52,
    y: typeof window !== 'undefined' ? window.innerHeight - 110 : 600,
  });
  const currentRotation = useRef<number>(0);
  const currentScale = useRef<{ x: number; y: number }>({ x: 1, y: 1 });
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMoving = useRef<boolean>(false);
  const particlesRef = useRef<StardustParticle[]>([]);
  const particleIdCounter = useRef<number>(0);
  const lastTrailTime = useRef<number>(0);
  const idleTimer = useRef<number>(0);
  const lastInteractionTime = useRef<number>(Date.now());

  // React State for DOM rendering
  const [flightState, setFlightState] = useState<FlightState>({
    x: currentPos.current.x,
    y: currentPos.current.y,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    particles: [],
    speechAnchor: {
      left: 24,
      top: 200,
      pointerDirection: 'bottom-left',
    },
  });

  // Calculate safe waypoint based on context
  const getContextWaypoint = useCallback((): { x: number; y: number } => {
    if (typeof window === 'undefined') return { x: 52, y: 600 };
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 1. Planet Selected Mode
    if (selectedPlanetId) {
      if (w >= 1024) {
        // Desktop: Float comfortably near the top-left of the Dossier panel
        return {
          x: Math.max(64, w - 460),
          y: Math.min(h - 140, Math.max(120, 130)),
        };
      } else {
        // Mobile/Tablet: Float at upper left beneath header
        return {
          x: 42,
          y: 90,
        };
      }
    }

    // 2. Chat Open Mode (ensure LAURA stays in comfortable reading space)
    if (isChatOpen) {
      return {
        x: Math.min(w - 100, Math.max(48, 56)),
        y: Math.min(h - 120, Math.max(160, h - 130)),
      };
    }

    // 3. Overview Home Position
    return {
      x: 48,
      y: h - 110,
    };
  }, [selectedPlanetId, isChatOpen]);

  // Command LAURA to fly to custom coordinates
  const flyTo = useCallback((x: number, y: number) => {
    if (prefersReducedMotion.current) return;
    const padding = 36;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    targetPos.current = {
      x: Math.max(padding, Math.min(maxX, x)),
      y: Math.max(padding, Math.min(maxY, y)),
    };
    lastInteractionTime.current = Date.now();
  }, []);

  // Update target position whenever context changes
  useEffect(() => {
    const nextWaypoint = getContextWaypoint();
    targetPos.current = nextWaypoint;
    lastInteractionTime.current = Date.now();
  }, [getContextWaypoint]);

  // Track cursor movement on desktop for subtle glance awareness
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Main 60FPS Animation Loop
  useEffect(() => {
    if (prefersReducedMotion.current) {
      const h = window.innerHeight;
      setFlightState((prev) => ({
        ...prev,
        x: 48,
        y: h - 110,
        speechAnchor: {
          left: 24,
          top: h - 520,
          pointerDirection: 'bottom-left',
        },
      }));
      return;
    }

    let rafId: number;
    let clockTime = 0;

    const animate = () => {
      clockTime += 0.016;

      // 1. Position Damping (Pursuit physics)
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      const distance = Math.hypot(dx, dy);

      const isFastFlight = distance > 1.5;
      isMoving.current = isFastFlight;

      // Smooth pursuit interpolation factor
      const pursuitFactor = isFastFlight ? 0.058 : 0.12;
      currentPos.current.x += dx * pursuitFactor;
      currentPos.current.y += dy * pursuitFactor;

      const vx = dx * pursuitFactor;
      const vy = dy * pursuitFactor;
      const speed = Math.hypot(vx, vy);

      // 2. Flight Banking Rotation
      let targetRot = 0;
      if (speed > 0.4) {
        // Tilt along flight direction (max ±16 degrees)
        targetRot = Math.max(-16, Math.min(16, vx * 2.2));
      } else {
        // Subtle glance toward mouse if nearby (within 240px)
        const mx = mousePos.current.x - currentPos.current.x;
        const my = mousePos.current.y - currentPos.current.y;
        const mouseDist = Math.hypot(mx, my);
        if (mouseDist < 260 && mouseDist > 20) {
          targetRot = Math.max(-8, Math.min(8, (mx / mouseDist) * 7));
        }
      }
      currentRotation.current += (targetRot - currentRotation.current) * 0.1;

      // 3. Squash and Stretch during flight
      if (speed > 1.2) {
        const stretch = Math.min(1.15, 1.0 + speed * 0.015);
        const squash = Math.max(0.88, 1.0 - speed * 0.012);
        currentScale.current.x = squash;
        currentScale.current.y = stretch;
      } else {
        currentScale.current.x += (1.0 - currentScale.current.x) * 0.15;
        currentScale.current.y += (1.0 - currentScale.current.y) * 0.15;
      }

      // 4. Organic Hovering Sine/Cosine Wave (when settled)
      const hoverOffsetY = isFastFlight ? 0 : Math.sin(clockTime * 2.2) * 5.0;
      const hoverOffsetX = isFastFlight ? 0 : Math.cos(clockTime * 1.5) * 2.5;

      const displayX = currentPos.current.x + hoverOffsetX;
      const displayY = currentPos.current.y + hoverOffsetY;

      // 5. Stardust Trail Emission (spawn glittering particles during fast flight)
      const now = performance.now();
      if (speed > 0.9 && now - lastTrailTime.current > 75) {
        lastTrailTime.current = now;
        particleIdCounter.current += 1;
        const newParticle: StardustParticle = {
          id: particleIdCounter.current,
          x: displayX + (Math.random() - 0.5) * 16,
          y: displayY + (Math.random() - 0.5) * 16,
          opacity: 0.85,
          scale: 0.9 + Math.random() * 0.4,
          char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        };
        particlesRef.current.push(newParticle);
        if (particlesRef.current.length > 10) {
          particlesRef.current.shift();
        }
      }

      // Age and fade existing particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.opacity -= 0.035;
        p.scale *= 0.97;
        if (p.opacity <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 6. Autonomous Idle Drift (gently drifts to an observatory vantage every 16–24 seconds)
      if (
        !selectedPlanetId &&
        !isChatOpen &&
        Date.now() - lastInteractionTime.current > 18000
      ) {
        lastInteractionTime.current = Date.now();
        const w = window.innerWidth;
        const h = window.innerHeight;
        const idleWaypoints = [
          { x: 52, y: h - 110 }, // Home
          { x: 64, y: Math.max(140, h * 0.45) }, // Mid-left observatory
          { x: Math.max(60, w - 110), y: h - 110 }, // Bottom-right outpost
          { x: 72, y: 120 }, // Top-left flight deck
        ];
        const nextWp = idleWaypoints[idleTimer.current % idleWaypoints.length];
        idleTimer.current += 1;
        targetPos.current = nextWp;
      }

      // 7. Dynamic Speech Balloon Anchoring Calculation
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const dialogueWidth = Math.min(420, winW - 32);
      const dialogueHeight = 380;

      let anchorLeft: number;
      let anchorTop: number;
      let pointerDir: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

      // Horizontal orientation
      if (displayX < winW / 2) {
        // LAURA is on left: balloon extends to the right
        anchorLeft = Math.max(16, displayX - 16);
        pointerDir = 'bottom-left';
      } else {
        // LAURA is on right: balloon extends to the left
        anchorLeft = Math.max(16, displayX - dialogueWidth + 48);
        pointerDir = 'bottom-right';
      }

      // Vertical orientation
      if (displayY > winH * 0.55) {
        // LAURA is in lower half: balloon appears above her
        anchorTop = Math.max(70, displayY - dialogueHeight - 20);
      } else {
        // LAURA is in upper half: balloon appears below her
        anchorTop = Math.min(winH - dialogueHeight - 70, displayY + 70);
        pointerDir = displayX < winW / 2 ? 'top-left' : 'top-right';
      }

      // Clamping within safe viewport
      anchorLeft = Math.max(16, Math.min(winW - dialogueWidth - 16, anchorLeft));
      anchorTop = Math.max(64, Math.min(winH - dialogueHeight - 24, anchorTop));

      setFlightState({
        x: displayX,
        y: displayY,
        rotation: currentRotation.current,
        scaleX: currentScale.current.x,
        scaleY: currentScale.current.y,
        particles: [...particlesRef.current],
        speechAnchor: {
          left: anchorLeft,
          top: anchorTop,
          pointerDirection: pointerDir,
        },
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [selectedPlanetId, isChatOpen]);

  return {
    flightState,
    flyTo,
  };
}
