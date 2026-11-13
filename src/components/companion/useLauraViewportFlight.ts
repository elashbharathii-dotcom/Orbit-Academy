import { useState, useEffect, useRef, useCallback } from 'react';
import { CelestialId } from '../../types';

export interface ViewportPoint {
  x: number;
  y: number;
}

export interface UseLauraViewportFlightOptions {
  selectedPlanetId: CelestialId | null;
  isChatOpen: boolean;
}

/**
 * Autonomous Living Celestial Flight Controller for LAURA (Milestone 2)
 * 
 * Capabilities:
 * - Independent, organic floating movement across available screen space
 * - Natural sinusoidal bobbing (breathing animation) and dynamic banking rotation
 * - UI obstacle avoidance: avoids top header, bottom dock, and active planet dossier
 * - Contextual reactions: accompanies user when selecting planets
 * - Stable conversational anchor when chat is open
 * - Hardware-accelerated GPU transitions with cubic-bezier easing
 */
export function useLauraViewportFlight({
  selectedPlanetId,
  isChatOpen,
}: UseLauraViewportFlightOptions) {
  const prefersReducedMotion = useRef<boolean>(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Compute safe scenic observation points across available screen space
  const getSafeWaypoint = useCallback((zone: 'overview-left' | 'overview-right' | 'dossier-companion' | 'chat-dock'): ViewportPoint => {
    if (typeof window === 'undefined') return { x: 100, y: 160 };
    const w = window.innerWidth;
    const h = window.innerHeight;

    switch (zone) {
      case 'dossier-companion':
        // Accompany student to upper-left of Planet Dossier
        return {
          x: w >= 1024 ? Math.max(120, w - 390) : Math.max(60, w - 80),
          y: Math.max(90, Math.min(140, h * 0.18)),
        };
      case 'chat-dock':
        // Anchored comfortably above or beside dialogue panel
        return {
          x: w >= 768 ? Math.max(80, w - 240) : Math.max(60, w * 0.5),
          y: Math.max(80, h - 450),
        };
      case 'overview-right':
        // Open celestial viewing space right
        return {
          x: Math.max(100, Math.min(w - 120, w * 0.82)),
          y: Math.max(100, Math.min(h - 140, h * 0.32)),
        };
      case 'overview-left':
      default:
        // Open celestial viewing space left
        return {
          x: Math.max(90, Math.min(w - 100, w * 0.15)),
          y: Math.max(95, Math.min(h - 140, h * 0.28)),
        };
    }
  }, []);

  const [position, setPosition] = useState<ViewportPoint>(() =>
    getSafeWaypoint(selectedPlanetId ? 'dossier-companion' : 'overview-left')
  );
  const [rotation, setRotation] = useState<number>(0);
  const [isGliding, setIsGliding] = useState<boolean>(false);

  const currentPosRef = useRef<ViewportPoint>(position);
  const glideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wanderCycleIndex = useRef<number>(0);

  // Smooth transit to target coordinate
  const flyToTarget = useCallback(
    (target: ViewportPoint) => {
      if (prefersReducedMotion.current) {
        setPosition(target);
        currentPosRef.current = target;
        return;
      }

      const dx = target.x - currentPosRef.current.x;
      const dy = target.y - currentPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 15) return;

      // Natural banking tilt into flight trajectory (-14 to +14 deg)
      const tilt = Math.max(-14, Math.min(14, (dx / (dist || 1)) * 14));
      setRotation(tilt);
      setIsGliding(true);
      setPosition(target);
      currentPosRef.current = target;

      if (glideTimeoutRef.current) clearTimeout(glideTimeoutRef.current);
      glideTimeoutRef.current = setTimeout(() => {
        setIsGliding(false);
        setRotation(0);
      }, 1500);
    },
    []
  );

  // 1. Contextual flight reaction when student selects/deselects a planet
  useEffect(() => {
    if (isChatOpen) return;

    if (selectedPlanetId && selectedPlanetId !== 'sun') {
      const pt = getSafeWaypoint('dossier-companion');
      flyToTarget(pt);
    } else {
      const pt = getSafeWaypoint('overview-left');
      flyToTarget(pt);
    }
  }, [selectedPlanetId, isChatOpen, getSafeWaypoint, flyToTarget]);

  // 2. Chat open stabilization
  useEffect(() => {
    if (isChatOpen) {
      const pt = getSafeWaypoint('chat-dock');
      flyToTarget(pt);
    }
  }, [isChatOpen, getSafeWaypoint, flyToTarget]);

  // 3. Autonomous gentle wander when student is passively observing the Solar System
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    if (isChatOpen || selectedPlanetId) return;

    const wanderTimer = setInterval(() => {
      // Cycle through open viewing spaces
      const zones: Array<'overview-left' | 'overview-right'> = [
        'overview-left',
        'overview-right',
      ];
      wanderCycleIndex.current = (wanderCycleIndex.current + 1) % zones.length;
      const targetZone = zones[wanderCycleIndex.current];

      // Add gentle random variance so it feels organic rather than robotic
      const basePt = getSafeWaypoint(targetZone);
      const randomOffset: ViewportPoint = {
        x: Math.max(80, Math.min(window.innerWidth - 100, basePt.x + (Math.random() - 0.5) * 80)),
        y: Math.max(90, Math.min(window.innerHeight - 130, basePt.y + (Math.random() - 0.5) * 60)),
      };

      flyToTarget(randomOffset);
    }, 14000); // Gentle wander every 14 seconds

    return () => clearInterval(wanderTimer);
  }, [isChatOpen, selectedPlanetId, getSafeWaypoint, flyToTarget]);

  // 4. Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const targetZone = isChatOpen
        ? 'chat-dock'
        : selectedPlanetId
        ? 'dossier-companion'
        : 'overview-left';
      const pt = getSafeWaypoint(targetZone);
      setPosition(pt);
      currentPosRef.current = pt;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isChatOpen, selectedPlanetId, getSafeWaypoint]);

  return {
    position,
    rotation,
    isGliding,
    flyToTarget,
  };
}
