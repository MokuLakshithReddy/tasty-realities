import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, MeshDistortMaterial, Sphere, Torus, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Plate = () => {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 64]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Plate rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[1.45, 0.06, 16, 64]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.2} metalness={0.2} />
      </mesh>
    </group>
  );
};

const FoodItem = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main protein - stylized sphere */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <MeshDistortMaterial
            color="#8B4513"
            roughness={0.6}
            metalness={0.1}
            distort={0.15}
            speed={2}
          />
        </mesh>
        {/* Garnish elements */}
        <mesh position={[0.4, 0.4, 0.2]} rotation={[0.3, 0.5, 0]}>
          <coneGeometry args={[0.08, 0.3, 8]} />
          <meshStandardMaterial color="#228B22" roughness={0.8} />
        </mesh>
        <mesh position={[-0.3, 0.35, -0.2]} rotation={[-0.2, 0.8, 0.3]}>
          <coneGeometry args={[0.06, 0.25, 8]} />
          <meshStandardMaterial color="#2d8b2d" roughness={0.8} />
        </mesh>
        {/* Sauce drizzle */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 8, 32]} />
          <meshStandardMaterial color="#8B0000" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Small garnish spheres */}
        {[...Array(5)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 5) * Math.PI * 2) * 0.6,
              -0.15,
              Math.sin((i / 5) * Math.PI * 2) * 0.6,
            ]}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#FF6347" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

const GlowRing = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.8, 0.02, 16, 64]} />
      <meshBasicMaterial color="#e8913a" transparent opacity={0.4} />
    </mesh>
  );
};

const Scene3D = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas camera={{ position: [3, 2.5, 3], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 8, 5]} angle={0.3} penumbra={1} intensity={1.5} color="#e8913a" />
        <spotLight position={[-3, 6, -3]} angle={0.4} penumbra={1} intensity={0.8} color="#3db8a0" />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#fff" />
        <Plate />
        <FoodItem />
        <GlowRing />
        <Environment preset="apartment" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;
