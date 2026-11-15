import * as THREE from 'three';

/**
 * Global spatial registry holding real-time world positions of all celestial bodies.
 * Allows camera controller, targeting reticles, and HUD overlays to track
 * orbiting planets without causing React component re-renders.
 */
export const celestialPositions = new Map<string, THREE.Vector3>();

// Initialize default positions
celestialPositions.set('sun', new THREE.Vector3(0, 0, 0));

export function setCelestialPosition(id: string, position: THREE.Vector3): void {
  const current = celestialPositions.get(id);
  if (current) {
    current.copy(position);
  } else {
    celestialPositions.set(id, position.clone());
  }
}

export function getCelestialPosition(id: string): THREE.Vector3 {
  return celestialPositions.get(id) || new THREE.Vector3(0, 0, 0);
}

