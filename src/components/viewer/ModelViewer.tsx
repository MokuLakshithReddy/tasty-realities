import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Html,
  useProgress,
  useGLTF,
  Float,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";

// Loading indicator inside the canvas
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-sm text-muted-foreground font-medium">
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

// Placeholder 3D scene when no GLB is available
function PlaceholderModel() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <MeshDistortMaterial
            color="#e8913a"
            roughness={0.4}
            metalness={0.2}
            distort={0.2}
            speed={3}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.08, 64]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.3} metalness={0.1} />
        </mesh>
        {[...Array(6)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 0.7,
              -0.05,
              Math.sin((i / 6) * Math.PI * 2) * 0.7,
            ]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#3db8a0" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// GLB Model loader
function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Auto-scale model to fit
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);

    const center = box.getCenter(new THREE.Vector3());
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [scene]);

  return (
    <Center>
      <primitive ref={modelRef} object={scene} />
    </Center>
  );
}

interface ModelViewerProps {
  modelUrl: string | null;
  itemName: string;
}

const ModelViewer = ({ modelUrl, itemName }: ModelViewerProps) => {
  const [key, setKey] = useState(0);

  // Force remount when model changes for clean transitions
  useEffect(() => {
    setKey((k) => k + 1);
  }, [modelUrl]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        <Canvas
          camera={{ position: [3, 2, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <spotLight
            position={[5, 8, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1.5}
            color="#e8913a"
            castShadow
          />
          <spotLight
            position={[-3, 6, -3]}
            angle={0.4}
            penumbra={1}
            intensity={0.8}
            color="#3db8a0"
          />
          <pointLight position={[0, 4, 0]} intensity={0.4} />

          <Suspense fallback={<Loader />}>
            {modelUrl && modelUrl !== "demo" ? (
              <GLBModel url={modelUrl} />
            ) : (
              <PlaceholderModel />
            )}
            <ContactShadows
              position={[0, -0.8, 0]}
              opacity={0.4}
              scale={8}
              blur={2}
              far={4}
            />
            <Environment preset="apartment" />
          </Suspense>

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            minDistance={1.5}
            maxDistance={6}
          />
        </Canvas>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModelViewer;
