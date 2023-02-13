import React, { memo } from 'react'
import * as THREE from 'three'

const CastumMesh = (props) => {
  const { contour, holes = [], color } = props

  const faces = new THREE.Shape(contour.map((v) => new THREE.Vector2(...v)))
  holes.forEach((hole) => faces.holes.push(new THREE.Path([...hole].map((v) => new THREE.Vector2(...v)))))

  return (
    <group>
      <mesh receiveShadow>
        <extrudeGeometry attach="geometry" args={[faces, { depth: 1, bevelEnabled: false }]} />
        <meshStandardMaterial attach="material" color={color || 'hotpink'} />
      </mesh>
    </group>
  )
}

export default memo(CastumMesh, (prevProps, nextProps) => prevProps.contour === nextProps.contour)
