"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type DistortionPreviewProps = {
  sources: string[];
  sizes: [number, number][];
  canvas: { width: number; height: number };
  active: number;
  visible: boolean;
  velocityX: MotionValue<number>;
  velocityY: MotionValue<number>;
};

const vertexShader = /* glsl */ `
  uniform vec2 uVelocity;
  uniform vec2 uScale;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    p.x -= uVelocity.x * sin(uv.y * 3.14159) * 0.3;
    p.y += uVelocity.y * sin(uv.x * 3.14159) * 0.3;
    gl_Position = vec4(p.xy * uScale, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uFromAspect;
  uniform float uToAspect;
  uniform float uPlaneAspect;
  uniform float uProgress;
  uniform float uOpacity;
  uniform vec2 uVelocity;
  varying vec2 vUv;

  vec2 cover(vec2 uv, float imageAspect) {
    vec2 s = vec2(1.0);
    if (imageAspect > uPlaneAspect) s.x = uPlaneAspect / imageAspect;
    else s.y = imageAspect / uPlaneAspect;
    return (uv - 0.5) * s + 0.5;
  }

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

  vec3 rgbShift(sampler2D tex, vec2 uv, vec2 shift) {
    return vec3(
      texture2D(tex, uv + shift).r,
      texture2D(tex, uv).g,
      texture2D(tex, uv - shift).b
    );
  }

  void main() {
    float n = noise(vUv * 4.0);
    float edge = mix(-0.2, 1.2, uProgress);
    float mask = 1.0 - smoothstep(edge - 0.12, edge + 0.12, vUv.y * 0.75 + n * 0.25);

    vec2 uvFrom = cover(vUv, uFromAspect);
    vec2 uvTo = cover(vUv, uToAspect);
    uvFrom.y -= mask * n * 0.2;
    uvTo.y += (1.0 - mask) * n * 0.2;
    uvTo = (uvTo - 0.5) * (1.0 - (1.0 - uProgress) * 0.15) + 0.5;

    vec2 shift = uVelocity * 0.015;
    vec3 color = mix(rgbShift(uFrom, uvFrom, shift), rgbShift(uTo, uvTo, shift), mask);

    vec2 q = abs(vUv - 0.5) * vec2(uPlaneAspect, 1.0) - (vec2(0.5 * uPlaneAspect, 0.5) - 0.025);
    float corner = 1.0 - smoothstep(0.0, 0.004, length(max(q, 0.0)) - 0.025);

    gl_FragColor = vec4(color, uOpacity * corner);
    #include <colorspace_fragment>
  }
`;

export function DistortionPreview(props: DistortionPreviewProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <DistortionPlane {...props} />
    </Canvas>
  );
}

const aspectOf = (texture?: THREE.Texture) => {
  const image = texture?.image as HTMLImageElement | undefined;
  return image?.width ? image.width / image.height : 16 / 9;
};

const damp = (current: number, target: number, rate: number, delta: number) =>
  current + (target - current) * Math.min(1, delta * rate);

function DistortionPlane({
  sources,
  sizes,
  canvas,
  active,
  visible,
  velocityX,
  velocityY,
}: DistortionPreviewProps) {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);
  const textures = useRef<THREE.Texture[]>([]);
  const transition = useRef({ from: active, to: active, progress: 1 });
  const motionState = useRef({
    opacity: 0,
    bendX: 0,
    bendY: 0,
    width: sizes[active][0],
    height: sizes[active][1],
  });

  const uniforms = useMemo(
    () => ({
      uFrom: { value: null as THREE.Texture | null },
      uTo: { value: null as THREE.Texture | null },
      uFromAspect: { value: 16 / 9 },
      uToAspect: { value: 16 / 9 },
      uPlaneAspect: { value: 16 / 9 },
      uProgress: { value: 1 },
      uOpacity: { value: 0 },
      uVelocity: { value: new THREE.Vector2() },
      uScale: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loaded = sources.map((src) => {
      const texture = loader.load(src);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      return texture;
    });
    textures.current = loaded;
    return () => loaded.forEach((texture) => texture.dispose());
  }, [sources]);

  useEffect(() => {
    const t = transition.current;
    if (t.to === active) return;
    t.from = t.progress < 0.5 ? t.from : t.to;
    t.to = active;
    t.progress = 0;
  }, [active]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const u = mesh.material.uniforms;
    const t = transition.current;
    const m = motionState.current;

    t.progress = Math.min(1, t.progress + delta / 0.8);
    m.opacity = damp(m.opacity, visible ? 1 : 0, 9, delta);
    m.bendX = damp(m.bendX, THREE.MathUtils.clamp(velocityX.get() / 2500, -1, 1), 10, delta);
    m.bendY = damp(m.bendY, THREE.MathUtils.clamp(velocityY.get() / 2500, -1, 1), 10, delta);
    m.width = damp(m.width, sizes[t.to][0], 7, delta);
    m.height = damp(m.height, sizes[t.to][1], 7, delta);

    const from = textures.current[t.from];
    const to = textures.current[t.to];
    const eased =
      t.progress < 0.5 ? 4 * t.progress ** 3 : 1 - (-2 * t.progress + 2) ** 3 / 2;

    u.uFrom.value = from ?? null;
    u.uTo.value = to ?? null;
    u.uFromAspect.value = aspectOf(from);
    u.uToAspect.value = aspectOf(to);
    u.uPlaneAspect.value = m.width / m.height;
    u.uScale.value.set(m.width / canvas.width, m.height / canvas.height);
    u.uProgress.value = eased;
    u.uOpacity.value = m.opacity;
    u.uVelocity.value.set(m.bendX, m.bendY);
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[2, 2, 48, 48]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
