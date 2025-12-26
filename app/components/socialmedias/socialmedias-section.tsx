"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { useInView } from "motion/react";

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

const AsciiScene = ({ isVisible }: { isVisible: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

  const [scrambledChars, setScrambledChars] = useState<Map<number, string>>(
    new Map()
  );
  const revealedCharsRef = useRef<Set<number>>(new Set());
  const revealTimesRef = useRef<Map<number, number>>(new Map());
  const startTimeRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const [, forceUpdate] = useState(0);

  // Prepare ASCII chars array
  const lines = asciiArt.split("\n");
  const chars: { char: string; x: number; y: number; index: number }[] = [];

  let charIndex = 0;
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char !== " ") {
        chars.push({
          char,
          x: (x - line.length / 2) * 0.11,
          y: (lines.length / 2 - y) * 0.2,
          index: charIndex++,
        });
      }
    });
  });

  useEffect(() => {
    canvasRef.current = gl.domElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();

      // Normalizar posição do mouse para NDC (-1 a 1) relativo ao canvas
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gl]);

  // Initialize scrambled chars on mount
  useEffect(() => {
    const initial = new Map<number, string>();
    chars.forEach((item) => {
      initial.set(item.index, generateRandomChar());
    });
    setScrambledChars(initial);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Start animation when visible
  useEffect(() => {
    if (isVisible) {
      // Sempre reiniciar quando ficar visível
      revealedCharsRef.current = new Set();
      isAnimatingRef.current = true;

      // Reinicializar caracteres embaralhados
      const initial = new Map<number, string>();
      chars.forEach((item) => {
        initial.set(item.index, generateRandomChar());
      });
      setScrambledChars(initial);

      startTimeRef.current = Date.now();
      lastFlipTimeRef.current = startTimeRef.current;

      // Atribuir tempo aleatório de revelação para cada caractere (0.5-2 segundos)
      const revealTimes = new Map<number, number>();
      chars.forEach((item) => {
        const randomDelay = 300 + Math.random() * 1000; // 500-2000ms
        revealTimes.set(item.index, randomDelay);
      });
      revealTimesRef.current = revealTimes;
    } else {
      // Parar animação quando sair da tela
      isAnimatingRef.current = false;
    }
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(() => {
    // Encrypted text reveal animation
    if (isAnimatingRef.current) {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const flipDelayMs = 30; // Speed of scramble

      // Verificar quais caracteres devem ser revelados baseado no tempo
      let hasChanges = false;

      chars.forEach((item) => {
        const revealTime = revealTimesRef.current.get(item.index) || 0;
        if (
          elapsed >= revealTime &&
          !revealedCharsRef.current.has(item.index)
        ) {
          revealedCharsRef.current.add(item.index);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        forceUpdate((prev) => prev + 1); // Força re-render
      }

      // Verificar se todos foram revelados
      if (revealedCharsRef.current.size >= chars.length) {
        isAnimatingRef.current = false;
      }

      // Flip unrevealed chars
      const timeSinceLastFlip = now - lastFlipTimeRef.current;
      if (
        timeSinceLastFlip >= flipDelayMs &&
        revealedCharsRef.current.size < chars.length
      ) {
        setScrambledChars((prev) => {
          const updated = new Map(prev);
          chars.forEach((item) => {
            if (!revealedCharsRef.current.has(item.index)) {
              updated.set(item.index, generateRandomChar());
            }
          });
          return updated;
        });
        lastFlipTimeRef.current = now;
      }
    }

    if (groupRef.current) {
      // Rotação suave seguindo o mouse (limitado a 30 graus)
      const targetRotationY = Math.max(
        -0.52,
        Math.min(0.52, mouseRef.current.x * 0.52)
      );
      // Inverter eixo Y para ficar natural
      const targetRotationX = Math.max(
        -0.52,
        Math.min(0.52, -mouseRef.current.y * 0.52)
      );

      groupRef.current.rotation.y +=
        (targetRotationY - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.x +=
        (targetRotationX - groupRef.current.rotation.x) * 0.1;

      // Converter posição do mouse de NDC para world space
      const vector = new THREE.Vector3(
        mouseRef.current.x,
        mouseRef.current.y,
        0
      );
      vector.unproject(camera);

      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const mouseWorldPos = camera.position
        .clone()
        .add(dir.multiplyScalar(distance));

      // Atualizar cor de cada char baseado na distância do mouse
      groupRef.current.children.forEach((child) => {
        if (child.userData.position) {
          const charPos = child.userData.position;

          const dx = charPos.x - mouseWorldPos.x;
          const dy = charPos.y - mouseWorldPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const glowRadius = 1.5;
          const intensity = Math.max(0, 1 - distance / glowRadius);

          // Cor roxo brilhante quando perto do mouse
          const baseColor = new THREE.Color(0.64, 0.64, 0.64);
          const glowColor = new THREE.Color(0.5, 0.2, 1.0);

          child.traverse((node) => {
            if (
              node instanceof THREE.Mesh &&
              node.material instanceof THREE.MeshBasicMaterial
            ) {
              node.material.color.lerpColors(baseColor, glowColor, intensity);
              node.material.opacity = 0.4 + intensity * 0.6;
            }
          });
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {chars.map((item) => {
        const isRevealed = revealedCharsRef.current.has(item.index);
        const displayChar = isRevealed
          ? item.char
          : scrambledChars.get(item.index) || generateRandomChar();

        return (
          <Text
            key={item.index}
            position={[item.x, item.y, 0]}
            fontSize={0.15}
            anchorX="center"
            anchorY="middle"
            userData={{ position: { x: item.x, y: item.y } }}
          >
            {displayChar}
            <meshBasicMaterial
              transparent
              opacity={0.4}
              color={new THREE.Color(0.64, 0.64, 0.64)}
            />
          </Text>
        );
      })}
    </group>
  );
};

const SocialmediasSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <div
      ref={sectionRef}
      className="w-full bg-neutral-950 grid grid-cols-[2fr_1fr] items-center px-8 relative"
    >
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 70%, 65%, .08) 0, hsla(270, 70%, 55%, .02) 50%, hsla(270, 70%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 70%, 65%, .06) 0, hsla(270, 70%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 70%, 65%, .04) 0, hsla(270, 70%, 45%, .02) 80%, transparent 100%)"
        className="opacity-70! z-20!"
        only="left"
      />

      <div className="flex flex-col gap-6 pl-30 z-30 relative">
        <div className="flex flex-col gap-2">
          {/* <h1 className="text-6xl font-bold text-neutral-100">Redes Sociais</h1> */}
          <h1 className="text-6xl font-bold">
            <EncryptedText
              text="Redes Sociais"
              encryptedClassName="text-neutral-400"
              revealedClassName="text-neutral-100"
              revealDelayMs={50}
            />
          </h1>
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-neutral-400 text-lg font-light max-w-140"
          >
            Vamos compartilhar experiências e conexões, você pode me encontrar
            nas plataformas abaixo.
          </TextAnimate>
        </div>
        <div className="flex gap-2">
          <Link target="_blank" href="#">
            <Button className="bg-neutral-950 hover:bg-neutral-900 border text-neutral-400 cursor-pointer opacity-90 hover:opacity-100">
              <Linkedin />
              LinkedIn
            </Button>
          </Link>
          <Link target="_blank" href="#">
            <Button className="bg-neutral-950 hover:bg-neutral-900 border text-neutral-400 cursor-pointer opacity-90 hover:opacity-100">
              <Github />
              GitHub
            </Button>
          </Link>
          <Link target="_blank" href="#">
            <Button className="bg-neutral-950 hover:bg-neutral-900 border text-neutral-400 cursor-pointer opacity-90 hover:opacity-100">
              <Mail />
              E-mail
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-80">
        <div className="w-full h-120 -translate-y-20 z-20 relative">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ alpha: true }}
          >
            <AsciiScene isVisible={isInView} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default SocialmediasSection;
