import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";

function StarCrest({ title, earned }) {
  const groupRef = useRef();
  const glowRef = useRef();

  useFrame((state, delta) => {
    if (!earned) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Star shape for the badge
  const starShape = new THREE.Shape();
  const outerR = 1.2;
  const innerR = 0.55;
  const points = 5;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) starShape.moveTo(x, y);
    else starShape.lineTo(x, y);
  }
  starShape.closePath();

  const extrudeSettings = { depth: 0.18, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 };

  return (
    <group ref={groupRef}>
      {/* Star body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.09, 0]}>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial
          color={earned ? "#f59e0b" : "#6b7280"}
          metalness={earned ? 0.85 : 0.1}
          roughness={earned ? 0.15 : 0.8}
          emissive={earned ? "#d97706" : "#000000"}
          emissiveIntensity={earned ? 0.3 : 0}
        />
      </mesh>

      {/* Inner glow disc */}
      {earned && (
        <mesh ref={glowRef} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.2} />
        </mesh>
      )}

      {/* Center letter */}
      <Text
        position={[0, 0.14, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.55}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {title?.charAt(0) ?? "?"}
      </Text>

      {/* Fire-like particle trail */}
      {earned && (
        <>
          <Sparkles
            count={30}
            size={3}
            speed={0.6}
            scale={3}
            color="#f59e0b"
            opacity={0.7}
          />
          <Sparkles
            count={15}
            size={2}
            speed={0.8}
            scale={2}
            color="#ef4444"
            opacity={0.4}
          />
        </>
      )}
    </group>
  );
}

export default function LegendaryBadge({ title, earned }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center">
      <Canvas
        camera={{ position: [0, 2.5, 1.8], fov: 38 }}
        style={{ width: 56, height: 56 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <pointLight position={[-2, 2, -1]} intensity={0.5} color="#f59e0b" />
        <pointLight position={[1, -1, 2]} intensity={0.3} color="#ef4444" />
        <StarCrest title={title} earned={earned} />
      </Canvas>
    </div>
  );
}
