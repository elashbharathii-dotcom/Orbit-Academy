import React, { useMemo } from 'react';
import * as THREE from 'three';

interface AtmosphereRimProps {
  radius: number;
  color: string;
  intensity?: number;
  falloff?: number;
}

/**
 * Atmospheric Fresnel Rim Shader
 * Simulates Rayleigh scattering (blue atmospheric haze) around celestial bodies
 * when viewed against the deep-space void.
 */
export const AtmosphereRim: React.FC<AtmosphereRimProps> = ({
  radius,
  color,
  intensity = 1.1,
  falloff = 2.8,
}) => {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-worldPos.xyz);
          gl_Position = projectionMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uFalloff;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          float fresnel = 1.0 - max(0.0, dot(vNormal, vViewDir));
          fresnel = pow(fresnel, uFalloff) * uIntensity;
          gl_FragColor = vec4(uColor, fresnel);
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
    <mesh scale={[1.14, 1.14, 1.14]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};

