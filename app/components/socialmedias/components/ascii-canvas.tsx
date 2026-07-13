"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
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

const AsciiScene = ({ isVisible }: { isVisible: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const domCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

  const scrambledRef = useRef<Map<number, string>>(new Map());
  const revealedRef = useRef<Set<number>>(new Set());
  const revealTimesRef = useRef<Map<number, number>>(new Map());
  const startTimeRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);

  // Prepara os caracteres e a textura 2D uma única vez.
  // Normaliza pela bounding box do conteúdo para centralizar a arte no plano.
  const { chars, cols, rows, texture, ctx, planeW, planeH } = useMemo(() => {
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

    const canvas = document.createElement("canvas");
    canvas.width = cols * CELL_W;
    canvas.height = rows * CELL_H;
    const ctx = canvas.getContext("2d")!;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    // Plano com as mesmas proporções da cena original em world units
    const planeW = cols * WORLD_X_STEP;
    const planeH = rows * WORLD_Y_STEP;

    return { chars, cols, rows, texture, ctx, planeW, planeH };
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

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
  }, [isVisible, chars]);

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

    const glowRadius = 1.5;

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

      // Base cinza (0.64) -> roxo brilhante (0.5, 0.2, 1.0) perto do mouse
      const r = Math.round((0.64 + (0.5 - 0.64) * intensity) * 255);
      const g = Math.round((0.64 + (0.2 - 0.64) * intensity) * 255);
      const b = Math.round((0.64 + (1.0 - 0.64) * intensity) * 255);
      const alpha = 0.4 + intensity * 0.6;

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
      <mesh>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default function AsciiCanvas({ isVisible }: { isVisible: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ alpha: true }}>
      <AsciiScene isVisible={isVisible} />
    </Canvas>
  );
}
