import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { Suspense } from "react";

function Shirt() {

  const { scene } = useGLTF("/models/tshirt.glb");

  return (
    <Center>

      <primitive
        object={scene}
        scale={0.08}

        // ✅ FIX: MAKE VERTICAL
        rotation={[Math.PI / 2, Math.PI, 0]}

        // ✅ adjust height if needed
        position={[0, -1, 0]}
      />

    </Center>
  );
}

export default function TshirtModel() {

  return (

    <div style={{ width: "100%", height: "100%" }}>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        shadows
      >

        {/* ===== LIGHTING (UPGRADED) ===== */}

        <ambientLight intensity={0.9} />

        <directionalLight
          position={[3, 5, 3]}
          intensity={1.3}
          castShadow
        />

        <pointLight position={[-3, 2, 3]} intensity={0.6} />

        {/* ===== MODEL ===== */}

        <Suspense fallback={null}>
          <Shirt />
        </Suspense>

        {/* ===== CONTROLS ===== */}

        <OrbitControls
          autoRotate
          autoRotateSpeed={1.5}   // smoother

          enableZoom={false}
          enablePan={false}

          // 🔥 restrict weird angles
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
        />

      </Canvas>

    </div>

  );

}