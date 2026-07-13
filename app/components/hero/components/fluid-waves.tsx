"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Single ribbon/line component
function WaveRibbon({
  index,
  totalLines,
  mousePos,
}: {
  index: number;
  totalLines: number;
  mousePos: THREE.Vector2;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate unique properties for this ribbon
  const ribbonProps = useMemo(() => {
    const normalizedIndex = index / totalLines;

    // Depth fade: ribbons further back fade completely to zero
    const depthFade = 1.0 - normalizedIndex; // Fade from 1.0 to 0.0

    return {
      yOffset: (index - totalLines / 2) * 0.05, // Tighter spacing for more coverage
      zOffset: index * 0.012, // Subtle depth layering
      phaseOffset: index * 0.25, // Animation phase difference
      opacity: (0.15 + normalizedIndex * 0.35) * depthFade, // Opacity fades to 0
      colorShift: normalizedIndex, // Color gradient shift
    };
  }, [index, totalLines]);

  // Vertex shader - creates flowing wave motion with mouse interaction
  const vertexShader = `
    uniform float uTime;
    uniform float uPhaseOffset;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Multiple sine/cosine waves with different frequencies
      float wave1 = sin(pos.x * 0.4 + uTime * 0.5 + uPhaseOffset) * 0.4;
      float wave2 = sin(pos.x * 0.7 - uTime * 0.3 + uPhaseOffset * 1.5) * 0.25;
      float wave3 = cos(pos.x * 1.1 + uTime * 0.4 + uPhaseOffset * 0.7) * 0.2;
      
      // Combine for organic flow
      float elevation = wave1 + wave2 + wave3;
      
      // Mouse interaction - creates a "squashing" effect on the waves
      vec2 worldPos = vec2(pos.x * 0.5, pos.y * 0.5); // Scale to world space
      float distToMouse = distance(worldPos, uMouse);
      
      // Ripple effect - pushes waves down near cursor (very subtle)
      float mouseRadius = 3.0; // Radius of influence
      float mouseStrength = 0.05; // Ultra subtle strength
      float ripple = smoothstep(mouseRadius, 0.0, distToMouse) * mouseStrength;
      
      // Apply ripple to elevation (negative = push down)
      elevation -= ripple;
      
      pos.z += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Fragment shader - gradient colors with glow
  const fragmentShader = `
    uniform float uTime;
    uniform float uColorShift;
    uniform float uOpacity;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Color palette - purple, blue, pink, white
      vec3 color1 = vec3(0.5, 0.2, 0.9);  // Purple
      vec3 color2 = vec3(0.2, 0.5, 1.0);  // Blue
      vec3 color3 = vec3(0.9, 0.3, 0.7);  // Pink
      vec3 color4 = vec3(1.0, 1.0, 1.0);  // White
      
      // Mix colors based on position and ribbon index
      float mixFactor = vUv.x * 0.7 + uColorShift * 0.3;
      vec3 color = mix(color1, color2, mixFactor);
      color = mix(color, color3, vUv.x * 0.4);
      color = mix(color, color4, (vElevation + 0.5) * 0.2);
      
      // Sharper edge fade for crisp ribbon effect
      float edgeFade = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
      
      // Final opacity - glow from layering, not blur
      float alpha = uOpacity * edgeFade * (1.0 + vElevation * 0.2);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhaseOffset: { value: ribbonProps.phaseOffset },
      uColorShift: { value: ribbonProps.colorShift },
      uOpacity: { value: ribbonProps.opacity },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [ribbonProps]
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uMouse.value = mousePos;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, ribbonProps.yOffset, ribbonProps.zOffset]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {/* Thin ribbons for delicate wave lines */}
      <planeGeometry args={[20, 0.03, 256, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Main wave component - renders multiple ribbons
function WaveField({ totalLines }: { totalLines: number }) {
  const [mousePos] = useState(() => new THREE.Vector2(0, 0));
  const [scrollY, setScrollY] = useState(0);
  const { viewport, camera } = useThree();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mouse movement and apply parallax
  useFrame((state) => {
    // Smooth mouse position interpolation with better scaling
    const targetX = state.pointer.x * viewport.width * 0.25;
    const targetY = state.pointer.y * viewport.height * 0.25;

    mousePos.x += (targetX - mousePos.x) * 0.1;
    mousePos.y += (targetY - mousePos.y) * 0.1;

    // Scroll parallax effect - subtle camera movement
    const scrollProgress = scrollY / 1000; // Normalize scroll (adjust divisor for sensitivity)

    // Subtle camera rotation and position based on scroll
    const targetRotationX = scrollProgress * 0.1; // Very subtle tilt
    const targetPositionY = -1 + scrollProgress * 0.3; // Start from lower position (0.5)

    // Smooth interpolation for camera movement
    if (camera) {
      camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;
      camera.position.y += (targetPositionY - camera.position.y) * 0.05;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {" "}
      {/* Positioned at bottom */}
      {Array.from({ length: totalLines }, (_, i) => (
        <WaveRibbon
          key={i}
          index={i}
          totalLines={totalLines}
          mousePos={mousePos}
        />
      ))}
    </group>
  );
}

export default function FluidWaves() {
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Telas pequenas: menos ribbons e DPR menor para poupar a thread principal
  const [isMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches
  );

  // Only enable global mouse tracking after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pausa o render loop quando o hero sai da tela
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    >
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{
          position: [0, 2.2, 5.5], // Lower initial position to show waves higher
          rotation: [0, 0, 0], // No rotation at start
          fov: 55, // Slightly wider FOV to show more of the wave
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Limit DPR for sharpness without performance hit
        {...(mounted &&
          typeof document !== "undefined" && {
            eventSource: document.body,
            eventPrefix: "client" as const,
          })}
      >
        <WaveField totalLines={isMobile ? 48 : 120} />
      </Canvas>
    </div>
  );
}
