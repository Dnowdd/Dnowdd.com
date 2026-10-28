"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

const generateRandomChar = (): string => {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
};

const asciiArt = `
                       +++++++++++++++
                    +++++++++++   +++++++
                  ++++++                +++
                +++++                     +++
               ++++                         ++
              ++++                           ++
             ++++                             ++
             +++                              +++
            ++++                              +++
            +++       -:-------::--:::         ++
            +++       --    =    -   -        +++
            ++++       --   =   =   --        +++
             +++        --   =     -:        +++
              +++        -- ======---        ++
              ++++       --  ++++ --        +++
               ++++       -- ++++--        +++
                ++++       -=+++==        +++
                 ++++     +++++++++      ++
                  ++++     ++++++++     +++
                   ++++    ++++++++    +++
                    +++    ++++++++    ++
                    +++    ++++++++    ++
                     +++   ++++++++   +++
                     ++====+++++=+=  =++
                      :::::::---::.::.:
                      :::::::---.......
                       ::::::---...::::
                       :::::--=-...::::
                       ::::---=-:.:::::
                      ::::::----::::-::
                       :::::--=-:::::::
                        ::--======--:
                          ==++++++=
`;

// Métricas da textura 2D (multiplicadas por 2 para nitidez em telas retina)
const CELL_W = 14;
const CELL_H = 25;
const FONT_SIZE = 19;

// Mapeamento do mundo 3D: mantém as dimensões da cena original
// (x = (col - len/2) * 0.11, y = (lines/2 - row) * 0.2)
const WORLD_X_STEP = 0.11;
const WORLD_Y_STEP = 0.2;

type AsciiChar = {
  char: string;
  col: number;
  row: number;
  index: number;
};

// Parsing puro da arte, feito uma vez em module scope.
// Normaliza pela bounding box do conteúdo para centralizar a arte no plano.
const { chars, cols, rows } = (() => {
  const lines = asciiArt.split("\n");
  const raw: AsciiChar[] = [];

  lines.forEach((line, row) => {
    line.split("").forEach((char, col) => {
      if (char !== " ") {
        raw.push({ char, col, row, index: 0 });
      }
    });
  });

  const minCol = Math.min(...raw.map((c) => c.col));
  const maxCol = Math.max(...raw.map((c) => c.col));
  const minRow = Math.min(...raw.map((c) => c.row));
  const maxRow = Math.max(...raw.map((c) => c.row));
  const cols = maxCol - minCol + 1;
  const rows = maxRow - minRow + 1;

  const chars: AsciiChar[] = raw.map((c, i) => ({
    char: c.char,
    col: c.col - minCol,
    row: c.row - minRow,
    index: i,
  }));

  return { chars, cols, rows };
})();

// Plano com as mesmas proporções da cena original em world units
const planeW = cols * WORLD_X_STEP;
const planeH = rows * WORLD_Y_STEP;

const BASE_ROW = 24;
const FILAMENT_ROW = 12;

const mixColor = (a: number[], b: number[], t: number) =>
  a.map((channel, k) => channel + (b[k] - channel) * t);

function charTone(item: AsciiChar, lit: number): [number[], number] {
  if (item.row >= BASE_ROW) {
    const silver = [0.72, 0.72, 0.8, 0.62];
    return [mixColor(silver, [0.95, 0.85, 0.7, 0.8], lit * 0.4), 0];
  }
  const nearFilament = Math.max(0, 1 - Math.abs(item.row - FILAMENT_ROW) / 12);
  if (item.char !== "+") {
    const idle = [0.78, 0.72, 0.95, 0.62];
    const hot = [1.0, 0.66, 0.22, 1.0];
    return [mixColor(idle, hot, lit), lit];
  }
  const t = item.row / BASE_ROW;
  const glass = mixColor([0.72, 0.62, 1.0, 0.72], [0.92, 0.52, 0.9, 0.72], t);
  const warmth = lit * (0.55 + nearFilament * 0.25);
  return [mixColor(glass, [1.0, 0.72, 0.36, 1.0], warmth), warmth * 0.6];
}

type CanvasAssets = {
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
};

const AsciiScene = ({
  isVisible,
  lit,
}: {
  isVisible: boolean;
  lit: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const domCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

  const scrambledRef = useRef<Map<number, string>>(new Map());
  const revealedRef = useRef<Set<number>>(new Set());
  const revealTimesRef = useRef<Map<number, number>>(new Map());
  const startTimeRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const lastDrawnMouseRef = useRef({ x: Infinity, y: Infinity });
  const litRef = useRef({ level: 0, drawn: -1 });

  // Canvas 2D + textura são criados no primeiro frame e vivem num ref,
  // já que são objetos gráficos mutados a cada redraw
  const assetsRef = useRef<CanvasAssets | null>(null);

  useEffect(() => {
    const assets = assetsRef;
    return () => assets.current?.texture.dispose();
  }, []);

  useEffect(() => {
    domCanvasRef.current = gl.domElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (!domCanvasRef.current) return;

      const rect = domCanvasRef.current.getBoundingClientRect();

      // Normalizar posição do mouse para NDC (-1 a 1) relativo ao canvas
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gl]);

  // (Re)inicia a animação de reveal quando a seção fica visível
  useEffect(() => {
    if (isVisible) {
      revealedRef.current = new Set();
      isAnimatingRef.current = true;

      const initial = new Map<number, string>();
      chars.forEach((item) => {
        initial.set(item.index, generateRandomChar());
      });
      scrambledRef.current = initial;

      startTimeRef.current = Date.now();
      lastFlipTimeRef.current = startTimeRef.current;

      const revealTimes = new Map<number, number>();
      chars.forEach((item) => {
        revealTimes.set(item.index, 300 + Math.random() * 1000);
      });
      revealTimesRef.current = revealTimes;
    } else {
      isAnimatingRef.current = false;
    }
  }, [isVisible]);

  useFrame(() => {
    // Animação de scramble/reveal
    if (isAnimatingRef.current) {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      chars.forEach((item) => {
        const revealTime = revealTimesRef.current.get(item.index) || 0;
        if (elapsed >= revealTime) {
          revealedRef.current.add(item.index);
        }
      });

      if (revealedRef.current.size >= chars.length) {
        isAnimatingRef.current = false;
      }

      if (now - lastFlipTimeRef.current >= 30) {
        chars.forEach((item) => {
          if (!revealedRef.current.has(item.index)) {
            scrambledRef.current.set(item.index, generateRandomChar());
          }
        });
        lastFlipTimeRef.current = now;
      }
    }

    // Rotação suave seguindo o mouse (limitado a ~30 graus)
    if (groupRef.current) {
      const targetRotationY = Math.max(
        -0.52,
        Math.min(0.52, mouseRef.current.x * 0.52),
      );
      const targetRotationX = Math.max(
        -0.52,
        Math.min(0.52, -mouseRef.current.y * 0.52),
      );

      groupRef.current.rotation.y +=
        (targetRotationY - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.x +=
        (targetRotationX - groupRef.current.rotation.x) * 0.1;
    }

    // Cria o canvas 2D + textura no primeiro frame e pluga no material
    if (!assetsRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = cols * CELL_W;
      canvas.height = rows * CELL_H;
      const context = canvas.getContext("2d");
      if (!context) return;

      const canvasTexture = new THREE.CanvasTexture(canvas);
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      assetsRef.current = { ctx: context, texture: canvasTexture };

      if (meshRef.current) {
        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        material.map = canvasTexture;
        material.needsUpdate = true;
        meshRef.current.visible = true;
      }
    }
    const { ctx, texture } = assetsRef.current;

    // Nada mudou (reveal completo e mouse parado)? Pula o redraw da textura
    const mouseMoved =
      Math.abs(mouseRef.current.x - lastDrawnMouseRef.current.x) > 0.001 ||
      Math.abs(mouseRef.current.y - lastDrawnMouseRef.current.y) > 0.001;
    const light = litRef.current;
    light.level += ((lit ? 1 : 0) - light.level) * 0.08;
    const lightChanged = Math.abs(light.level - light.drawn) > 0.002;
    if (
      !isAnimatingRef.current &&
      !mouseMoved &&
      !lightChanged &&
      light.level < 0.02
    )
      return;
    lastDrawnMouseRef.current = { ...mouseRef.current };
    light.drawn = light.level;
    const flicker = light.level * (0.88 + Math.random() * 0.12);

    // Posição do mouse em world space para o glow
    const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const mouseWorld = camera.position
      .clone()
      .add(dir.multiplyScalar(distance));

    // Redesenha a textura: um fillText por caractere, cor/alpha pelo glow
    ctx.clearRect(0, 0, cols * CELL_W, rows * CELL_H);
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const glowRadius = 1.6;

    chars.forEach((item) => {
      const isRevealed = revealedRef.current.has(item.index);
      const displayChar = isRevealed
        ? item.char
        : scrambledRef.current.get(item.index) || generateRandomChar();

      // Posição do caractere em world space (mesma fórmula da cena original)
      const worldX = (item.col - cols / 2 + 0.5) * WORLD_X_STEP;
      const worldY = (rows / 2 - item.row - 0.5) * WORLD_Y_STEP;

      const dx = worldX - mouseWorld.x;
      const dy = worldY - mouseWorld.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0, 1 - dist / glowRadius);

      const light = Math.max(flicker, intensity * (0.9 + Math.random() * 0.1));
      const [color, glowAmount] = charTone(item, light);
      const alpha = Math.min(1, color[3] + glowAmount * 0.3);

      ctx.fillStyle = `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${alpha})`;
      ctx.fillText(
        displayChar,
        item.col * CELL_W + CELL_W / 2,
        item.row * CELL_H + CELL_H / 2,
      );
    });

    texture.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Invisível até a textura ser criada no primeiro frame (evita flash branco) */}
      <mesh ref={meshRef} visible={false}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default function AsciiCanvas({
  isVisible,
  lit = false,
}: {
  isVisible: boolean;
  lit?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Abaixo de xl a cena fica a 30% de opacidade atrás do texto —
  // custo de GPU/CPU alto demais em mobile para um detalhe quase invisível
  const [isDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1280px)").matches,
  );

  if (prefersReducedMotion || !isDesktop) return null;

  return (
    <Canvas
      frameloop={isVisible ? "always" : "never"}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ alpha: true }}
    >
      <AsciiScene isVisible={isVisible} lit={lit} />
    </Canvas>
  );
}
