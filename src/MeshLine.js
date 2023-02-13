import React from 'react'
import * as THREE from 'three'

const LineGeometry = (props) => {
  const { vertices, color, lineWidth, height = 0 } = props

  if (!vertices) {
    return null
  }

  return (
    <mesh castShadow position={[0, 0, height]}>
      <meshLine attach="geometry" vertices={vertices.map((v) => new THREE.Vector3(...v))} />
      <meshLineMaterial attach="material" color={color || 'black'} lineWidth={lineWidth || 0.2} />
    </mesh>
  )
}

export default LineGeometry
