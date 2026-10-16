"use client";
import { Component, Suspense, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

/** Browser assets only: GLB or glTF with its referenced files. CAD source stays private. */
function Model({ url, size }: { url: string; size: number }) {
  const { scene } = useGLTF(url);
  const { object, scale, height } = useMemo(() => {
    const object = scene.clone(true);
    object.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(object);
    const dimensions = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const longest = Math.max(dimensions.x, dimensions.y, dimensions.z);
    if (!Number.isFinite(longest) || longest <= 0)
      throw new Error("Model has no renderable bounds");
    const scale = size / longest;
    object.position.sub(center);
    return { object, scale, height: dimensions.y * scale };
  }, [scene, size]);
  return (
    <group scale={scale} position={[0, height / 2, 0]}>
      <primitive object={object} />
    </group>
  );
}
class ModelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function ProjectModel({
  url,
  size,
  children,
}: {
  url: string | null;
  size: number;
  children: ReactNode;
}) {
  if (!url) return <>{children}</>;
  return (
    <ModelBoundary key={url} fallback={children}>
      <Suspense fallback={children}>
        <Model url={url} size={size} />
      </Suspense>
    </ModelBoundary>
  );
}
