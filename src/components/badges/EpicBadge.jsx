import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Text } from "@react-three/drei";

function OctagonalBadge({ title, earned }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current && earned) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  const shape = new Array(8).fill(null).map((_, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 8;
    return [Math.cos(angle) * 1.1, Math.sin(angle) * 1.1];
  });

  return (
    <group ref={meshRef}>
      {/* Octagonal badge body */}
      <mesh>
        <cylinderGeometry args={[1.1, 1.1, 0.2, 8]} />
        <meshStandardMaterial
          color={earned ? "#a855f7" : "#6b7280"}
          metalness={earned ? 0.6 : 0.1}
          roughness={earned ? 0.3 : 0.8}
          emissive={earned ? "#7c3aed" : "#000000"}
          emissiveIntensity={earned ? 0.2 : 0}
        />
      </mesh>

      {/* Inner ring */}
      <mesh position={[0, 0.11, 0]}>
        <ringGeometry args={[0.65, 0.75, 8]} />
        <meshStandardMaterial
          color={earned ? "#c084fc" : "#9ca3af"}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Center letter */}
      <Text
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {title?.charAt(0) ?? "?"}
      </Text>

      {/* Sparkles for earned badges */}
      {earned && (
        <Sparkles
          count={20}
          size={2}
          speed={0.4}
          scale={2.5}
          color="#a855f7"
          opacity={0.6}
        />
      )}
    </group>
  );
}

export default function EpicBadge({ title, earned }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center">
      <Canvas
        camera={{ position: [0, 2.2, 1.5], fov: 40 }}
        style={{ width: 56, height: 56 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 2]} intensity={1} />
        <pointLight position={[-2, 1, -1]} intensity={0.3} color="#a855f7" />
        <OctagonalBadge title={title} earned={earned} />
      </Canvas>
    </div>
  );
}
