import React, { useMemo } from 'react';
import * as THREE from 'three';

interface AtmosphereRimProps {
  radius: number;
  color: string;
  intensity?: number;
  falloff?: number;
  scale?: number;
}

/**
 * Cinematic Atmospheric Rayleigh Scattering Rim (Phase 7 Elite Redesign)
 * 
 * Physics Improvements:
 * - Hugs the planetary limb tightly (scale 1.025 instead of bloated 1.14 halo)
 * - Directionally attenuated by the Sun's vector (Sol at origin [0,0,0])
 * - Atmospheric Rayleigh scattering naturally illuminates the day limb and terminator,
 *   while fading smoothly into darkness on the deep-space night hemisphere.
 */
export const AtmosphereRim: React.FC<AtmosphereRimProps> = ({
  radius,
  color,
  intensity = 1.0,
  falloff = 4.2,
  scale = 1.025,
}) => {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewDir;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uFalloff;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewDir;

        void main() {
          // Sol is at origin [0, 0, 0]
          vec3 dirToSun = normalize(-vWorldPosition);
          float sunDot = dot(vWorldNormal, dirToSun);
          
          // Atmosphere only scatters light on the sunlit limb and softly diffuses into twilight
          float sunFactor = smoothstep(-0.25, 0.35, sunDot);

          // Fresnel limb grazing angle
          float fresnel = 1.0 - max(0.0, dot(vNormal, vViewDir));
          float alpha = pow(fresnel, uFalloff) * uIntensity * sunFactor;

          if (alpha < 0.005) discard;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity },
        uFalloff: { value: falloff },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, [color, intensity, falloff]);

  return (
    <mesh scale={[scale, scale, scale]}>
      <sphereGeometry args={[radius, 48, 48]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};
