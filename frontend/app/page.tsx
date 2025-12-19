"use client";
// Required by Next.js App Router to tell React this component runs on the client
// (because it uses WebGL, animations, and browser-only APIs)

import { Canvas, useFrame } from "@react-three/fiber";
// Canvas = Three.js scene wrapper for React
// useFrame = hook that runs on every render frame (≈60 times/sec)

import {
  OrbitControls,
  Sphere,
  Stars,
  Grid,
  useTexture,
} from "@react-three/drei";
// Drei = helper components built on top of Three.js
// Sphere = shortcut for sphere geometry + mesh
// Stars = procedural starfield background
// Grid = infinite grid helper (used as spacetime fabric)
// OrbitControls = mouse camera controls

import * as THREE from "three"; // Core Three.js library
import { useRef } from "react"; // React reference hook

/* ===================== SUN ===================== */
function Sun() {
  // Reference to the Sun mesh so we can rotate it every frame
  const ref = useRef<THREE.Mesh>(null!);
  const sunTexture = useTexture("/textures/sun.jpg");

  // Runs on every animation frame
  useFrame(() => {
    // Slow axial rotation of the Sun
    ref.current.rotation.y += 0.0005;
  });

  return (
    <Sphere ref={ref} args={[2, 128, 128]}>
      {/* 
        args = [radius, widthSegments, heightSegments]
        High segment count makes the sphere smooth
      */}
      <meshStandardMaterial
        map={sunTexture}
        emissiveMap={sunTexture}
        emissive="orange"
        emissiveIntensity={2}
      />
    </Sphere>
  );
}

/* ===================== ORBIT LINE ===================== */
function Orbit({ radius }: { radius: number }) {
  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      // Rotates the ring so it lies flat on the XZ plane

      position={[0, 0.01, 0]}
      // Slightly lifted so it doesn't z-fight with the grid

      renderOrder={1}
      // Ensures it renders above background elements
    >
      <ringGeometry
        args={[
          radius - 0.02, // inner radius
          radius + 0.02, // outer radius (thin ring)
          256, // smoothness
        ]}
      />
      <meshBasicMaterial
        color="white"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthTest={true}
        // depthTest=false ensures orbit is always visible
        // even if something else overlaps in depth
      />
    </mesh>
  );
}

/* ===================== PLANET ===================== */
function Planet({
  radius,
  distance,
  speed,
  texture,
  emissiveIntensity = 0.5, // default glow
}: {
  radius: number; // Planet size
  distance: number; // Orbital radius from Sun
  speed: number; // Orbital speed
  texture: string; // Planet texture
  emissiveIntensity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const map = useTexture(texture);

  useFrame(({ clock }) => {
    // elapsedTime increases continuously since scene start
    const t = clock.elapsedTime * speed;

    // Circular orbital motion using cosine & sine
    ref.current.position.set(Math.cos(t) * distance, 0, Math.sin(t) * distance);

    // Planet self-rotation (spin)
    ref.current.rotation.y += 0.002;
  });

  return (
    <Sphere ref={ref} args={[radius, 64, 64]}>
      <meshStandardMaterial map={map} />
    </Sphere>
  );
}

/* ===================== SPACETIME FABRIC ===================== */
// function SpacetimeFabric() {
//   return (
//     <group position={[0, -2.5, 0]}>
//       {/*
//         Grid placed below planets to represent spacetime
//         The Sun appears to sit "above" the fabric
//       */}
//       <Grid
//         args={[100, 100]} // Overall size of the grid
//         cellSize={1} // Small grid squares
//         cellThickness={0.5}
//         sectionSize={5} // Larger section grouping
//         sectionThickness={0.6}
//         infiniteGrid // Extends infinitely
//       />
//     </group>
//   );
// }

/* ===================== SCENE ===================== */
export default function SolarSystemScene() {
  return (
    <div className="h-screen w-screen bg-black">
      {/* Fullscreen container */}

      <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
        {/* Camera placed above the system, angled down */}
        <ambientLight intensity={0.15} />
        {/* Soft global light so dark areas aren’t pitch black */}
        <pointLight position={[0, 0, 0]} intensity={15} />
        {/* Sun light source at the center */}
        <Stars radius={200} depth={200} count={10300} factor={6} fade />
        {/* Procedural star background */}
        {/* Spacetime fabric */}
        {/* <SpacetimeFabric /> */}
        {/* Orbit lines (must match planet distances) */}
        <Orbit radius={4} />
        <Orbit radius={6} />
        <Orbit radius={8} />
        <Orbit radius={10} />
        <Orbit radius={14} />
        <Orbit radius={18} />
        <Orbit radius={22} />
        <Orbit radius={26} />
        {/* Sun */}
        <Sun />
        {/* Planets */}
        <Planet
          radius={0.4}
          distance={4}
          speed={1.6}
          texture="/textures/mercury.jpg"
        />{" "}
        {/* Mercury */}
        <Planet
          radius={0.6}
          distance={6}
          speed={1.2}
          texture="/textures/venus.jpg"
        />{" "}
        {/* Venus */}
        <Planet
          radius={0.65}
          distance={8}
          speed={1}
          texture="/textures/earth.jpg"
        />{" "}
        {/* Earth */}
        <Planet
          radius={0.5}
          distance={10}
          speed={0.8}
          texture="/textures/mars.jpg"
          emissiveIntensity={0.6}
        />{" "}
        {/* Mars */}
        <Planet
          radius={1.2}
          distance={14}
          speed={0.4}
          texture="/textures/jupyter.jpg"
        />{" "}
        {/* Jupiter */}
        <Planet
          radius={1}
          distance={18}
          speed={0.3}
          texture="/textures/saturn.jpg"
        />{" "}
        {/* Saturn */}
        <Planet
          radius={0.9}
          distance={22}
          speed={0.2}
          texture="/textures/uranus.jpg"
        />{" "}
        {/* Uranus */}
        <Planet
          radius={0.85}
          distance={26}
          speed={0.15}
          texture="/textures/neptune.jpg"
        />
        {/* Neptune */}
        <OrbitControls enablePan={false} />
        {/* Mouse controls: rotate + zoom, no panning */}
      </Canvas>
    </div>
  );
}
