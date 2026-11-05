import * as THREE from 'three';

/**
 * Custom GLSL Shaders for Theatrical Volumetric Lighting, Atmospheric Scattering,
 * Lens Corona Flares, and Floor Illumination.
 */

// =========================================================================
// 1. VOLUMETRIC BEAM SHADER
// =========================================================================
export const VolumetricBeamShader = {
  uniforms: {
    uColor: { value: new THREE.Color(0xfcf8f2) }, // Calibrated ~5200K theatrical arc lamp white
    uIntensity: { value: 0.0 },
    uTime: { value: 0.0 },
    uLength: { value: 16.0 },
  },
  vertexShader: `
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 viewPos = viewMatrix * worldPos;
      vViewPosition = viewPos.xyz;
      gl_Position = projectionMatrix * viewPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uTime;
    uniform float uLength;

    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    void main() {
      if (uIntensity <= 0.0001) {
        discard;
      }

      // Physically clip beam at stage floor and backdrop surface
      if (vWorldPosition.y < 0.65 || vWorldPosition.z < -3.38) {
        discard;
      }

      // Distance along beam: 0.0 at apex (fixture), 1.0 at floor/target
      float t = clamp(1.0 - vUv.y, 0.0, 1.0);

      // Core density calculated in view space:
      vec3 viewDir = normalize(-vViewPosition);
      float viewDot = abs(dot(viewDir, normalize(vNormal)));
      float coreDensity = pow(viewDot, 1.25);

      // Natural physical attenuation along beam path
      float distFade = 1.0 / (1.0 + 0.65 * t * t);
      // Soft start right at the lens aperture
      float apexSoft = smoothstep(0.0, 0.035, t);
      // Smooth feathering approaching the stage floor
      float floorSoft = smoothstep(0.65, 0.82, vWorldPosition.y);
      // Smooth feathering approaching the backdrop surface
      float wallSoft = smoothstep(-3.38, -3.15, vWorldPosition.z);

      // Atmospheric theatrical haze drift (2-frequency animated smoke)
      vec2 smokeUv = vec2(vUv.x * 6.0 + sin(uTime * 0.2) * 0.15, t * 7.0 - uTime * 0.35);
      float smoke = 0.86 + 0.14 * noise(smokeUv);

      // Calculate final alpha
      float alpha = coreDensity * distFade * apexSoft * floorSoft * wallSoft * smoke * uIntensity * 0.74;
      vec3 coreColor = mix(uColor, vec3(1.0, 1.0, 1.0), coreDensity * 0.42);

      gl_FragColor = vec4(coreColor, alpha);
    }
  `,
};

// =========================================================================
// 2. LENS FLARE CORONA SHADER
// =========================================================================
export const LensFlareShader = {
  uniforms: {
    uColor: { value: new THREE.Color(0xffffff) },
    uIntensity: { value: 0.0 },
    uTime: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      if (uIntensity <= 0.001) {
        discard;
      }

      vec2 uv = vUv * 2.0 - 1.0;
      float dist = length(uv);

      // Intense optical center
      float core = 0.09 / (dist + 0.09);
      // Soft outer bloom halo
      float halo = exp(-dist * 3.4);

      // Subtle 4-blade starburst glare
      float angle = atan(uv.y, uv.x);
      float spikes = pow(abs(cos(angle * 2.0 + 0.3)), 16.0) * exp(-dist * 2.2);

      float brightness = (core * 0.82 + halo * 0.42 + spikes * 0.32) * uIntensity;
      brightness = clamp(brightness, 0.0, 1.8);

      vec3 col = mix(uColor, vec3(1.0), 0.75) * brightness;
      gl_FragColor = vec4(col, clamp(brightness, 0.0, 1.0));
    }
  `,
};

// =========================================================================
// 3. STAGE FLOOR ILLUMINATION POOL SHADER
// =========================================================================
export const FloorSpotlightShader = {
  uniforms: {
    uColor: { value: new THREE.Color(0xfcf8f2) },
    uIntensity: { value: 0.0 },
    uCenter: { value: new THREE.Vector2(0.0, 0.0) },
    uRadius: { value: new THREE.Vector2(2.4, 1.4) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform vec2 uCenter;
    uniform vec2 uRadius;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      if (uIntensity <= 0.001) {
        discard;
      }

      vec2 diff = (vWorldPosition.xz - uCenter) / uRadius;
      float distSq = dot(diff, diff);

      if (distSq > 1.0) {
        discard;
      }

      // Smooth Gaussian falloff with sharp central specular hot-spot
      float falloff = exp(-distSq * 2.8);
      float hotSpot = exp(-distSq * 8.5) * 0.65;

      float alpha = (falloff + hotSpot) * uIntensity * 0.85;
      vec3 col = mix(uColor, vec3(1.0, 1.0, 1.0), hotSpot * 0.6);

      gl_FragColor = vec4(col, alpha);
    }
  `,
};

// =========================================================================
// 4. ATMOSPHERIC HAZE PARTICLE SHADER
// =========================================================================
export const HazeParticleShader = {
  uniforms: {
    uTime: { value: 0.0 },
    uColor: { value: new THREE.Color(0xffffff) },
    uLeftOrigin: { value: new THREE.Vector3(-5.8, 4.6, 1.2) },
    uLeftTarget: { value: new THREE.Vector3(-0.9, 0.6, -0.4) },
    uLeftIntensity: { value: 0.0 },
    uRightOrigin: { value: new THREE.Vector3(5.8, 4.6, 1.2) },
    uRightTarget: { value: new THREE.Vector3(0.9, 0.6, -0.4) },
    uRightIntensity: { value: 0.0 },
    uBeamRadius: { value: 2.0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform vec3 uLeftOrigin;
    uniform vec3 uLeftTarget;
    uniform float uLeftIntensity;
    uniform vec3 uRightOrigin;
    uniform vec3 uRightTarget;
    uniform float uRightIntensity;
    uniform float uBeamRadius;

    attribute float aSize;
    attribute float aPhase;
    attribute vec3 aVelocity;

    varying float vAlpha;

    float distToSegment(vec3 p, vec3 a, vec3 b) {
      vec3 pa = p - a;
      vec3 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }

    void main() {
      vec3 pos = position;
      pos.x += sin(uTime * 0.35 + aPhase) * 0.25 + aVelocity.x * uTime * 0.05;
      pos.y += cos(uTime * 0.25 + aPhase * 1.5) * 0.2 + aVelocity.y * uTime * 0.03;
      pos.z += sin(uTime * 0.3 + aPhase * 2.0) * 0.25 + aVelocity.z * uTime * 0.04;

      pos.x = mod(pos.x + 12.0, 24.0) - 12.0;
      pos.y = mod(pos.y, 8.0);
      pos.z = mod(pos.z + 5.0, 16.0) - 5.0;

      float dLeft = distToSegment(pos, uLeftOrigin, uLeftTarget);
      float dRight = distToSegment(pos, uRightOrigin, uRightTarget);

      float leftIllum = uLeftIntensity * smoothstep(uBeamRadius * 1.15, 0.1, dLeft);
      float rightIllum = uRightIntensity * smoothstep(uBeamRadius * 1.15, 0.1, dRight);

      float totalIllum = max(leftIllum, rightIllum);

      vAlpha = 0.02 + totalIllum * 0.95;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (aSize * (1.0 + totalIllum * 1.9)) * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vAlpha;

    void main() {
      if (vAlpha <= 0.02) {
        discard;
      }
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) {
        discard;
      }
      float shape = smoothstep(0.5, 0.08, dist);
      gl_FragColor = vec4(uColor, shape * vAlpha * 0.75);
    }
  `,
};
