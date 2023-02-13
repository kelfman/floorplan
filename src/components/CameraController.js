import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useThree } from 'react-three-fiber'
import { OrbitControls, MapControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

const CameraController = (props) => {
  const { isOrthographic } = props
  const { setDefaultCamera } = useThree()
  const perspectiveCameraRef = useRef()
  const orthographicCameraRef = useRef()
  // console.log(orthographicCameraRef && orthographicCameraRef.current)
  useEffect(() => {
    if (setDefaultCamera) {
      setDefaultCamera(isOrthographic ? orthographicCameraRef.current : perspectiveCameraRef.current)
    }
  }, [setDefaultCamera, isOrthographic])

  return (
    <>
      {isOrthographic ? (
        <MapControls
          maxZoom={60}
          minZoom={1}
          enableRotate={false}
          dampingFactor={0.6}
          mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN }}
        />
      ) : (
        <OrbitControls
          maxDistance={500}
          minDistance={20}
          dampingFactor={0.6}
          maxPolarAngle={Math.PI / 2.1}
          mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN }}
        />
      )}
      {isOrthographic ? (
        <OrthographicCamera ref={orthographicCameraRef} position={[0, 0, 270]} zoom={4} />
      ) : (
        <PerspectiveCamera ref={perspectiveCameraRef} position={[0, 0, 115]} near={1} />
      )}
    </>
  )
}

CameraController.propTypes = {
  isOrthographic: PropTypes.bool,
  defaultPosition: PropTypes.object
}

export default CameraController
