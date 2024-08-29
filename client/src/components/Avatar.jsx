import React, { useRef, useState, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { MathUtils } from "three";
import { facialExpressions, visemesLookUpTable } from "../constants/Constants";
import { useAIStore } from "../stores/useAI";

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF("/models/Girlfriend.glb");
  const { animations } = useGLTF("/models/animations.glb");

  const group = useRef();
  const { actions } = useAnimations(animations, group);

  const loading = useAIStore((state) => state.loading);
  const currentMessage = useAIStore((state) => state.currentMessage);

  const [animation, setAnimation] = useState("Standing Idle");
  const [blink, setBlink] = useState(false);
  const [facialExpression, setFacialExpression] = useState("default");

  const lerpMorphTarget = (name, value, speed) => {
    // loop through all skinnedMeshes
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[name];

        child.morphTargetInfluences[index] = MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();

    return () => actions[animation].fadeOut(0.5);
  }, [animation]);

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, MathUtils.randInt(2000, 5000));
    };
    nextBlink();

    return () => clearTimeout(blinkTimeout);
  }, []);

  useEffect(() => {
    if (loading) {
      setAnimation("Thinking");
    } else if (currentMessage) {
      setAnimation(currentMessage.answers[0].animation);
      setFacialExpression(currentMessage.answers[0].facialExpression);
    } else {
      setAnimation("Standing Idle");
      setFacialExpression("default");
    }
  }, [currentMessage, loading]);

  useFrame(() => {
    // facial expression
    Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
      const mapping = facialExpressions[facialExpression];

      // eyes blink are handled separately
      if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
        return;
      }

      if (mapping && mapping[key]) {
        lerpMorphTarget(key, mapping[key], 0.1);
      } else {
        lerpMorphTarget(key, 0, 0.1);
      }
    });

    // blinking
    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.1);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.1);

    // lipsync
    if (currentMessage && currentMessage.answers[0].visemes) {
      const answer = currentMessage.answers[0];
      for (let i = answer.visemes.length - 1; i >= 0; i--) {
        const [audioOffset, visemeId] = answer.visemes[i];
        if (answer.audio.currentTime * 1000 >= audioOffset) {
          lerpMorphTarget(visemesLookUpTable[visemeId], 1, 0.2);

          // break out of loop when you find it
          break;
        }
      }
    }
  });

  // leva UI
  useControls({
    애니메이션: {
      value: animation,
      options: animations.map((item) => item.name),
      onChange: (v) => setAnimation(v),
    },
    "얼굴 표정": {
      value: facialExpression,
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
  });

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/Girlfriend.glb");
useGLTF.preload("/models/animations.glb");
