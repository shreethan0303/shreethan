"use client";

import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";

function Layer({
  y,
  size,
  color,
  children,
}: {
  y: number;
  size: [number, number, number];
  color: string;
  children?: ReactNode;
}) {
  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={size} radius={0.035} smoothness={3}>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.25} />
      </RoundedBox>
      {children}
    </group>
  );
}
function Parts({ progress }: { progress: number }) {
  const p = progress * progress * (3 - 2 * progress);
  return (
    <group rotation={[0, -0.35, 0]}>
      <Layer y={-0.5} size={[1.65, 0.16, 1.05]} color="#d8dcde">
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <mesh
              key={`${x}${z}`}
              position={[x * 0.86, -0.04, z * 0.36]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.22, 0.22, 0.14, 24]} />
              <meshStandardMaterial color="#292e31" roughness={0.65} />
            </mesh>
          )),
        )}
      </Layer>
      <Layer y={-0.27 + p * 0.7} size={[1.05, 0.12, 0.7]} color="#a9b9bd">
        {[-1, 1].map((x) => (
          <mesh key={x} position={[x * 0.3, 0.09, 0]}>
            <boxGeometry args={[0.22, 0.08, 0.32]} />
            <meshStandardMaterial color="#424d54" />
          </mesh>
        ))}
      </Layer>
      <Layer y={-0.05 + p * 1.4} size={[1.15, 0.18, 0.8]} color="#eceeed">
        <mesh position={[0, 0, 0.41]}>
          <planeGeometry args={[0.3, 0.06]} />
          <meshStandardMaterial
            color="#456b7e"
            emissive="#456b7e"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Layer>
      {p > 0.02 && (
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.8 + p * 1.1, 6]} />
          <meshBasicMaterial color="#ccd2d5" transparent opacity={p * 0.5} />
        </mesh>
      )}
    </group>
  );
}
class ViewerBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="assembly-fallback">
        The 3D view is unavailable. The component descriptions remain below.
      </p>
    ) : (
      this.props.children
    );
  }
}
export default function AssemblyScene({ progress }: { progress: number }) {
  return (
    <ViewerBoundary>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [3.5, 2.5, 5.5], fov: 36 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
        gl={{ antialias: true, powerPreference: "low-power" }}
        fallback={
          <p className="assembly-fallback">
            3D is unavailable on this device. Read the component descriptions
            below.
          </p>
        }
      >
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1.6} />
        <directionalLight position={[-3, 6, 5]} intensity={2} />
        <Parts progress={progress} />
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.15}
          scale={7}
          blur={2}
          far={4}
          frames={1}
        />
      </Canvas>
    </ViewerBoundary>
  );
}
