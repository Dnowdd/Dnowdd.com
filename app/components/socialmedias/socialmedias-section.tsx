"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";

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

const AsciiScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

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

  useFrame(() => {
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

  const lines = asciiArt.split("\n");
  const chars: { char: string; x: number; y: number }[] = [];

  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char !== " ") {
        chars.push({
          char,
          x: (x - line.length / 2) * 0.11,
          y: (lines.length / 2 - y) * 0.2,
        });
      }
    });
  });

  return (
    <group ref={groupRef}>
      {chars.map((item, index) => (
        <Text
          key={index}
          position={[item.x, item.y, 0]}
          fontSize={0.15}
          anchorX="center"
          anchorY="middle"
          userData={{ position: { x: item.x, y: item.y } }}
        >
          {item.char}
          <meshBasicMaterial
            transparent
            opacity={0.4}
            color={new THREE.Color(0.64, 0.64, 0.64)}
          />
        </Text>
      ))}
    </group>
  );
};

const SocialmediasSection = () => {
  return (
    <div className="w-full bg-neutral-950 grid grid-cols-[2fr_1fr] items-center px-8 relative">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 70%, 65%, .08) 0, hsla(270, 70%, 55%, .02) 50%, hsla(270, 70%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 70%, 65%, .06) 0, hsla(270, 70%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 70%, 65%, .04) 0, hsla(270, 70%, 45%, .02) 80%, transparent 100%)"
        className="opacity-5"
        only="left"
      />

      <div className="flex flex-col gap-6 pl-30">
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-bold text-neutral-100">Redes Sociais</h1>
          <p className="text-neutral-400 text-lg font-light max-w-140">
            Vamos compartilhar experiências e conexões, você pode me encontrar
            nas plataformas abaixo.
          </p>
        </div>
        <div className="flex gap-2">
          <Link target="_blank" href="#">
            <Button className="bg-[#0077B5] hover:bg-[#005d8f] text-neutral-200 cursor-pointer opacity-50 hover:opacity-100">
              <Linkedin />
              LinkedIn
            </Button>
          </Link>
          <Link target="_blank" href="#">
            <Button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 cursor-pointer opacity-50 hover:opacity-100">
              <Github />
              GitHub
            </Button>
          </Link>
          <Link target="_blank" href="#">
            <Button className="bg-red-800 hover:bg-red-700 text-neutral-400 cursor-pointer opacity-50 hover:opacity-100">
              <Mail />
              E-mail
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-80">
        <div className="w-full h-120 -translate-y-20">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ alpha: true }}
          >
            <AsciiScene />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default SocialmediasSection;
