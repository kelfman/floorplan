import React, { useEffect, useState } from 'react'
import { Canvas, extend } from 'react-three-fiber'
import { Stats, Circle } from '@react-three/drei'
import * as THREE from 'three'
import T from 'i18n-react'
import * as meshline from 'threejs-meshline'
import { Flex, Box } from '@react-three/flex'

import CameraController from './components/CameraController'
import EditModeToggleButton from './components/EditModeToggleButton'
import yaml from 'js-yaml'
import plan from './plan2.yaml'
import Floor from './Floor'
import en from './en'

extend(meshline)
const parsedPlan = yaml.safeLoad(plan)

const App = () => {
  THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1)
  const [isOrthographic, setIsOrthographic] = useState(true)

  console.log(parsedPlan)

  useEffect(() => {
    T.setTexts(en)
  }, [])

  const toggleOrthographic = (update) => {
    update(!isOrthographic)
  }

  return (
    <>
      <EditModeToggleButton toggle={() => toggleOrthographic(setIsOrthographic)} selected={isOrthographic} />
      <Canvas shadowMap colorManagement style={{ background: '#f9f9f9' }} invalidateFrameloop>
        {/* ============== Lights ============== */}
        <ambientLight intensity={0.5} />

        <directionalLight
          castShadow
          position={[40, 60, 128]}
          intensity={0.8}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <Circle position={[0, 0, 200]}>
          <meshBasicMaterial attach="material" color="hotpink" />
        </Circle>

        {/* ============== floors ============== */}
        <group position={[-150, 0, 0]}>
          <Flex flexDirection="row" flexWrap="wrap" size={[300, 600, 0]}>
            {parsedPlan.floors.map((floor, index) => (
              <Box centerAnchor margin={5} key={index}>
                <Floor floor={floor} />
              </Box>
            ))}
          </Flex>
        </group>

        {/* ============== controls ============== */}
        <CameraController isOrthographic={isOrthographic} />
        <Stats />
      </Canvas>
    </>
  )
}

export default App
