import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Leva } from "leva";

import Scene from "./components/Scene";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <UI />
      <Leva hidden />
      <Canvas camera={{ position: [0, 0, 10], fov: 15 }}>
        <Scene />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
