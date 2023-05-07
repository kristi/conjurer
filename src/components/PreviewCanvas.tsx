import { Block } from "../types/Block";
import { Canvas } from "@react-three/fiber";
import { useStore } from "@/src/types/StoreContext";
import { observer } from "mobx-react-lite";
import RenderPipeline from "@/src/components/RenderPipeline";
import RenderingGate from "@/src/components/RenderingGate";
import Canopy from "@/src/components/Canopy";
import ThreeEffects from "@/src/components/ThreeEffects";
import CameraControls from "@/src/components/CameraControls";

type PreviewCanvasProps = {
  block: Block;
};

export default observer(function PreviewCanvas({ block }: PreviewCanvasProps) {
  const { timer } = useStore();

  return (
    <Canvas frameloop="demand">
      <RenderingGate shouldRender={!timer.playing} />
      <CameraControls />
      <RenderPipeline block={block} autorun>
        {(renderTarget) => <Canopy renderTarget={renderTarget} />}
      </RenderPipeline>
      <ThreeEffects />
    </Canvas>
  );
});
