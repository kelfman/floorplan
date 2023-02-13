import React, { useState, useRef, useEffect, memo } from 'react'
import { Text, Plane } from '@react-three/drei'
import * as THREE from 'three'
import T from 'i18n-react'
import lodashGet from 'lodash/get'
import { colorLayers } from './themes'
import { numberWithComma } from './helpers'

const Room = (props) => {
  const { room, onClick, selected, index } = props

  const intractable = room.intractable || true
  const contour = room.points
  const innerContour = room.inner_points
  const furniture = room.furniture
  const vertices = innerContour || contour
  const color = room.color || colorLayers[room.category][14]
  const faces = THREE.ShapeUtils.triangulateShape(
    vertices.map((v) => new THREE.Vector2(...v)),
    []
  )
  const area = THREE.ShapeUtils.area(contour.map((v) => new THREE.Vector2(...v)))
  const [hovered, setHover] = useState(false)
  const [roomCenterPosition, setRoomCenterPosition] = useState()
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef) {
      const target = new THREE.Vector3()
      const geometry = lodashGet(meshRef, 'current.geometry')
      if (geometry) {
        geometry.computeBoundingBox()
        geometry.boundingBox.getCenter(target)
        setRoomCenterPosition(target)
      }
    }
  }, [meshRef, room])

  return (
    <group>
      {/* ============== inside room ============== */}
      <mesh
        receiveShadow
        position={[0, 0, 2]}
        ref={meshRef}
        onPointerOver={() => intractable && setHover(true)}
        onPointerOut={() => intractable && setHover(false)}
        onClick={() => intractable && onClick(index)}>
        <geometry
          attach="geometry"
          receiveShadow
          vertices={vertices.map((v) => new THREE.Vector3(...v))}
          faces={faces.map((f) => new THREE.Face3(...f, new THREE.Vector3(0, 0, 1)))}
        />
        <meshStandardMaterial attach="material" color={selected ? 'yellowgreen' : color} opacity={hovered ? 0.9 : 1} />
      </mesh>

      {/* ============== isPined ============== */}
      {room.isPined && (
        <mesh position={[0, 0, 3]}>
          <Plane position={roomCenterPosition} args={[14, 14]}>
            <meshBasicMaterial attach="material" color="hotpink" />
          </Plane>
        </mesh>
      )}

      {/* ============== inside room text ============== */}
      <group position={[0, 0, 51]}>
        {/* <Html position={roomCenterPosition}>
          <div style={{ widht: '600px', pointerEvents: 'none', fontSize: '11px', display: 'flex', background: 'red', textAlign: 'center' }}>
            {`${T.translate(room.type)}\n ${index} ${numberWithComma(Math.abs(area) / 144, { fixed: 0, suffix: ' SF' })}`}
          </div>
        </Html> */}
        <mesh>
          <Text textAlign="center" position={roomCenterPosition} fontSize={15} color="black">
            {`${T.translate(room.type)}\n ${index} ${numberWithComma(Math.abs(area) / 144, { fixed: 0, suffix: ' SF' })}`}
          </Text>
        </mesh>
      </group>

      {/* ============== furniture ============== */}
      {/* {furniture &&
        furniture.map((item) => (
          <mesh position={[0, 0, 3]} key={uuidv4()}>
            <meshLine attach="geometry" vertices={item.points.map((v) => new THREE.Vector3(...v))} />
            <meshLineMaterial attach="material" color={item.furniture_type === 'door' ? 'green' : 'red'} lineWidth={0.1} />
          </mesh>
        ))} */}

      {/* ============== walls ============== */}
      <mesh position={[0, 0, 3]}>
        <meshLine attach="geometry" vertices={contour.map((v) => new THREE.Vector3(...v))} />
        <meshLineMaterial attach="material" color="grey" lineWidth={0.05} />
      </mesh>
    </group>
  )
}

export default memo(Room, (prevProps, nextProps) => prevProps.room.id === nextProps.room.id || prevProps.selected === nextProps.selected)
