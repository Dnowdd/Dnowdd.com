"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TRAIL = 16;
const SHOCKS = 6;
const SPARKS = 420;
const NEAR = 11;
const FAR = -25;
const CAMERA_Z = 9;
const CAMERA_Y = 4;
const CAMERA_TILT = -0.15;
const CAMERA_ROLL = 0.05;
const SLOPE = 0.55;
const SLOPE_NORMAL = new THREE.Vector3(0, 1, SLOPE).normalize();
const groundHeight = (z: number) => SLOPE * (CAMERA_Z - z);

const ribbonVertexShader = /* glsl */ `
  #define TRAIL ${TRAIL}
  #define SHOCKS ${SHOCKS}

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform vec3 uTrail[TRAIL];
  uniform vec4 uShocks[SHOCKS];

  attribute float aLine;
  attribute float aSide;

  varying float vLine;
  varying float vSide;
  varying float vX;
  varying float vElevation;
  varying float vEnergy;
  varying float vFog;

  float push(float d, float softness) {
    return d / (abs(d) + softness);
  }

  void main() {
    vec3 p = position;
    float phase = aLine * 30.0;
    float elevation =
      (sin(p.x * 0.4 + uTime * 0.5 + phase) * 0.4 +
      sin(p.x * 0.7 - uTime * 0.3 + phase * 1.5) * 0.25 +
      cos(p.x * 1.1 + uTime * 0.4 + phase * 0.7) * 0.2) * 0.55 +
      sin(p.z * 0.35 - uTime * 0.6 + p.x * 0.08) * 0.22;
    p.y += elevation;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec2 ground = world.xz;
    float dy = 0.0;
    float dz = 0.0;
    float energy = 0.0;

    vec2 toMouse = ground - uMouse;
    float field = exp(-dot(toMouse, toMouse) / 0.7) * uMouseStrength;
    dy -= field * 0.22;
    dz += push(toMouse.y, 0.15) * field * 0.3;
    energy += field * 0.8;

    for (int i = 0; i < TRAIL; i++) {
      vec3 t = uTrail[i];
      if (t.z <= 0.0) continue;
      vec2 d = ground - t.xy;
      float radius = 0.35 + (1.0 - t.z) * 0.7;
      float wake = exp(-dot(d, d) / (radius * radius)) * t.z * t.z;
      dy -= wake * 0.1;
      dz += push(d.y, 0.2) * wake * 0.15;
      energy += wake * 0.45;
    }

    for (int i = 0; i < SHOCKS; i++) {
      vec4 s = uShocks[i];
      if (s.w <= 0.0) continue;
      vec2 d = ground - s.xy;
      float dist = length(d);
      float ring = dist - s.z * 4.0;
      float wave = exp(-ring * ring / 0.15) * exp(-s.z * 1.3) * s.w;
      dy += wave * 0.32;
      dz += (d.y / (dist + 0.001)) * wave * 0.15;
      energy += wave * 0.9;
    }

    world.y += dy;
    world.z += dz;
    float distanceToCamera = distance(world.xyz, cameraPosition);
    world.y += aSide * 0.012 * (1.0 + distanceToCamera * 0.06) * (1.0 + min(energy, 1.0) * 0.6);

    vLine = aLine;
    vSide = aSide;
    vX = uv.x;
    vElevation = elevation;
    vEnergy = energy;
    vFog = 1.0 - smoothstep(0.9, 1.0, aLine);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const ribbonFragmentShader = /* glsl */ `
  varying float vLine;
  varying float vSide;
  varying float vX;
  varying float vElevation;
  varying float vEnergy;
  varying float vFog;

  void main() {
    vec3 purple = vec3(0.5, 0.2, 0.9);
    vec3 blue = vec3(0.2, 0.5, 1.0);
    vec3 pink = vec3(0.95, 0.3, 0.7);
    vec3 hot = vec3(0.86, 0.8, 1.0);

    vec3 color = mix(purple, blue, vX * 0.7);
    color = mix(color, pink, vX * 0.3 + vLine * 0.55);
    color = mix(color, vec3(1.0), (vElevation + 0.5) * 0.15);
    float heat = clamp(vEnergy, 0.0, 1.0);
    color = mix(color, hot, heat * 0.85);

    float edge = smoothstep(0.0, 0.35, 0.5 - abs(vSide));
    float opacity = (0.28 + vLine * 0.35) * (1.0 - vLine * 0.6) * vFog;
    float alpha = opacity * edge * (1.0 + vElevation * 0.2) * (1.0 + heat * 2.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

const sparkVertexShader = /* glsl */ `
  attribute float aLife;
  attribute float aSize;
  varying float vLife;

  void main() {
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (0.4 + aLife * 0.6) * (420.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const sparkFragmentShader = /* glsl */ `
  varying float vLife;

  void main() {
    if (vLife <= 0.0) discard;
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    vec3 color = mix(vec3(0.55, 0.3, 1.0), vec3(0.85, 0.95, 1.0), vLife);
    gl_FragColor = vec4(color, glow * vLife);
  }
`;

function buildRibbons(lines: number, segments: number) {
  const vertexCount = lines * (segments + 1) * 2;
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const line = new Float32Array(vertexCount);
  const side = new Float32Array(vertexCount);
  const indices = new Uint32Array(lines * segments * 6);

  let v = 0;
  let i = 0;
  for (let l = 0; l < lines; l++) {
    const normalized = l / (lines - 1);
    const z = NEAR + (FAR - NEAR) * normalized ** 1.6;
    const halfWidth = 8 + Math.max(0, CAMERA_Z - z) * 1.3;
    const first = v;
    for (let s = 0; s <= segments; s++) {
      const u = s / segments;
      const x = -halfWidth + halfWidth * 2 * u;
      for (const half of [-0.5, 0.5]) {
        positions.set([x, groundHeight(z), z], v * 3);
        uvs.set([u, half + 0.5], v * 2);
        line[v] = normalized;
        side[v] = half;
        v++;
      }
    }
    for (let s = 0; s < segments; s++) {
      const a = first + s * 2;
      indices.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], i);
      i += 6;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setAttribute("aLine", new THREE.BufferAttribute(line, 1));
  geometry.setAttribute("aSide", new THREE.BufferAttribute(side, 1));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  return geometry;
}

function buildSparks() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(SPARKS * 3), 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );
  geometry.setAttribute(
    "aLife",
    new THREE.BufferAttribute(new Float32Array(SPARKS), 1).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );
  geometry.setAttribute(
    "aSize",
    new THREE.BufferAttribute(new Float32Array(SPARKS), 1),
  );
  return geometry;
}

type PointerState = {
  clientX: number;
  clientY: number;
  active: boolean;
  clicks: { clientX: number; clientY: number }[];
};

function WaveField({ totalLines }: { totalLines: number }) {
  const ribbonRef =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const sparksRef =
    useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const pointer = useRef<PointerState>({
    clientX: 0,
    clientY: 0,
    active: false,
    clicks: [],
  });
  const sim = useRef({
    mouse: new THREE.Vector2(),
    smoothMouse: new THREE.Vector2(),
    lastSample: new THREE.Vector2(9999, 9999),
    strength: 0,
    trail: Array.from({ length: TRAIL }, () => new THREE.Vector3(0, 0, 0)),
    trailHead: 0,
    shocks: Array.from({ length: SHOCKS }, () => new THREE.Vector4(0, 0, 0, 0)),
    shockHead: 0,
    velocity: new Float32Array(SPARKS * 3),
    decay: new Float32Array(SPARKS),
    sparkHead: 0,
    shake: 0,
    cameraY: CAMERA_Y,
    pitch: CAMERA_TILT,
    yaw: 0,
    rollKick: 0,
    swayX: 0,
    lastClientX: 0,
    raycaster: new THREE.Raycaster(),
    plane: new THREE.Plane(SLOPE_NORMAL, -SLOPE * CAMERA_Z * SLOPE_NORMAL.y),
    ndc: new THREE.Vector2(),
    hit: new THREE.Vector3(),
  });

  const ribbonGeometry = useMemo(
    () => buildRibbons(totalLines, 256),
    [totalLines],
  );
  const sparkGeometry = useMemo(() => buildSparks(), []);
  const ribbonUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uMouseStrength: { value: 0 },
      uTrail: {
        value: Array.from({ length: TRAIL }, () => new THREE.Vector3()),
      },
      uShocks: {
        value: Array.from({ length: SHOCKS }, () => new THREE.Vector4()),
      },
    }),
    [],
  );

  useEffect(() => {
    const state = pointer.current;
    const onMove = (event: PointerEvent) => {
      state.clientX = event.clientX;
      state.clientY = event.clientY;
      state.active = true;
    };
    const onDown = (event: PointerEvent) => {
      state.clientX = event.clientX;
      state.clientY = event.clientY;
      state.active = true;
      state.clicks.push({ clientX: event.clientX, clientY: event.clientY });
    };
    const onLeave = () => {
      state.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(
    () => () => {
      ribbonGeometry.dispose();
      sparkGeometry.dispose();
    },
    [ribbonGeometry, sparkGeometry],
  );

  useFrame((state, rawDelta) => {
    const ribbon = ribbonRef.current;
    const sparks = sparksRef.current;
    if (!ribbon || !sparks) return;
    const delta = Math.min(rawDelta, 1 / 30);
    const s = sim.current;
    const input = pointer.current;
    const rect = state.gl.domElement.getBoundingClientRect();

    const toWorld = (clientX: number, clientY: number) => {
      s.ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      const inside = Math.abs(s.ndc.x) <= 1 && Math.abs(s.ndc.y) <= 1;
      s.raycaster.setFromCamera(s.ndc, state.camera);
      const hit = s.raycaster.ray.intersectPlane(s.plane, s.hit);
      return inside && hit ? hit : null;
    };

    const hit = input.active ? toWorld(input.clientX, input.clientY) : null;
    const previous = s.mouse.clone();
    if (hit) s.mouse.set(hit.x, hit.z);
    s.strength += ((hit ? 1 : 0) - s.strength) * Math.min(1, delta * 6);
    s.smoothMouse.lerp(s.mouse, Math.min(1, delta * 10));
    const speed = hit
      ? previous.distanceTo(s.mouse) / Math.max(delta, 1e-4)
      : 0;

    if (hit && s.lastSample.distanceTo(s.mouse) > 0.12) {
      s.trail[s.trailHead].set(s.mouse.x, s.mouse.y, 1);
      s.trailHead = (s.trailHead + 1) % TRAIL;
      s.lastSample.copy(s.mouse);
    }
    for (const t of s.trail) t.z = Math.max(0, t.z - delta * 1.4);

    const positions = sparks.geometry.attributes
      .position as THREE.BufferAttribute;
    const life = sparks.geometry.attributes.aLife as THREE.BufferAttribute;
    const size = sparks.geometry.attributes.aSize as THREE.BufferAttribute;

    const emit = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      lifetime: number,
      scale: number,
    ) => {
      const k = s.sparkHead;
      s.sparkHead = (s.sparkHead + 1) % SPARKS;
      positions.setXYZ(k, x, groundHeight(y) + 0.05, y);
      s.velocity.set([vx, 1 + Math.random() * 2.2, vy], k * 3);
      life.setX(k, 1);
      size.setX(k, scale);
      s.decay[k] = 1 / lifetime;
    };

    for (const click of input.clicks.splice(0)) {
      const point = toWorld(click.clientX, click.clientY);
      if (!point) continue;
      s.shocks[s.shockHead].set(point.x, point.z, 0, 1);
      s.shockHead = (s.shockHead + 1) % SHOCKS;
      s.shake = 1;
      for (let n = 0; n < 50; n++) {
        const angle = Math.random() * Math.PI * 2;
        const force = 0.6 + Math.random() * 2.2;
        emit(
          point.x,
          point.z,
          Math.cos(angle) * force,
          Math.sin(angle) * force,
          0.6 + Math.random() * 0.8,
          0.05 + Math.random() * 0.08,
        );
      }
    }

    if (hit && speed > 2) {
      const count = Math.min(2, Math.floor(speed / 8) + 1);
      for (let n = 0; n < count; n++) {
        emit(
          s.mouse.x + (Math.random() - 0.5) * 0.1,
          s.mouse.y + (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          0.4 + Math.random() * 0.5,
          0.04 + Math.random() * 0.06,
        );
      }
    }

    const drag = Math.exp(-delta * 1.8);
    for (let k = 0; k < SPARKS; k++) {
      const remaining = life.getX(k);
      if (remaining <= 0) continue;
      const vx = s.velocity[k * 3] * drag;
      const vy = s.velocity[k * 3 + 1] * drag - 6 * delta;
      const vz = s.velocity[k * 3 + 2] * drag;
      s.velocity.set([vx, vy, vz], k * 3);
      positions.setXYZ(
        k,
        positions.getX(k) + vx * delta,
        positions.getY(k) + vy * delta,
        positions.getZ(k) + vz * delta,
      );
      life.setX(k, Math.max(0, remaining - delta * s.decay[k]));
    }
    positions.needsUpdate = true;
    life.needsUpdate = true;
    size.needsUpdate = true;

    for (const shock of s.shocks) {
      if (shock.w <= 0) continue;
      shock.z += delta;
      if (shock.z > 2.5) shock.w = 0;
    }

    const u = ribbon.material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.copy(s.smoothMouse);
    u.uMouseStrength.value = s.strength;
    s.trail.forEach((t, k) => u.uTrail.value[k].copy(t));
    s.shocks.forEach((shock, k) => u.uShocks.value[k].copy(shock));

    const scroll = window.scrollY / 1000;
    const ease = Math.min(1, delta * 2.5);
    const lookX = input.active
      ? (input.clientX / window.innerWidth) * 2 - 1
      : 0;
    const lookY = input.active
      ? -((input.clientY / window.innerHeight) * 2 - 1)
      : 0;
    const pointerSpeed =
      (input.clientX - s.lastClientX) / Math.max(delta, 1e-4);
    s.lastClientX = input.clientX;
    const kick = THREE.MathUtils.clamp(pointerSpeed / 3000, -1, 1) * 0.025;
    s.rollKick += (kick - s.rollKick) * Math.min(1, delta * 3);
    s.yaw += (-lookX * 0.035 - s.yaw) * ease;
    s.pitch += (CAMERA_TILT + lookY * 0.02 - scroll * 0.06 - s.pitch) * ease;
    s.swayX += (lookX * 0.25 - s.swayX) * ease;
    s.cameraY += (CAMERA_Y + scroll * 0.4 - s.cameraY) * 0.05;
    s.shake = Math.max(0, s.shake - delta * 4);
    const jolt = s.shake * s.shake * 0.02;
    state.camera.rotation.set(s.pitch, s.yaw, CAMERA_ROLL + s.rollKick);
    state.camera.position.set(
      s.swayX + (Math.random() - 0.5) * jolt,
      s.cameraY + (Math.random() - 0.5) * jolt,
      CAMERA_Z,
    );
  });

  return (
    <group>
      <mesh ref={ribbonRef} geometry={ribbonGeometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={ribbonVertexShader}
          fragmentShader={ribbonFragmentShader}
          uniforms={ribbonUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <points ref={sparksRef} geometry={sparkGeometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={sparkVertexShader}
          fragmentShader={sparkFragmentShader}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function FluidWaves() {
  const [inView, setInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
  );

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
          position: [0, CAMERA_Y, CAMERA_Z],
          rotation: [CAMERA_TILT, 0, CAMERA_ROLL],
          fov: 55,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <WaveField totalLines={isMobile ? 64 : 160} />
      </Canvas>
    </div>
  );
}
