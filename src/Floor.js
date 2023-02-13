import React, { useState } from 'react'
import lodashIncludes from 'lodash/includes'
import lodashIsEmpty from 'lodash/isEmpty'
import lodashFlatten from 'lodash/flattenDepth'
import { difference, union } from 'polygon-clipping'
import { geom } from 'jsts'
import * as THREE from 'three'

import Room from './Room'
import Mesh from './Mesh'
import Mullion from './Mullion'
import { areAllRoomsClose, isInTheSameTube } from './helpers'

const extrudeSettings = {
  steps: 1,
  depth: 50,
  bevelEnabled: false,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1
}

const Floor = (props) => {
  const { floor } = props
  const [selectedRooms, useSelectedRooms] = useState([])
  console.log(selectedRooms)
  const onRoomClicked = (id, update) => {
    if (lodashIncludes(selectedRooms, id)) {
      const newSelectedRooms = selectedRooms.filter((item) => item !== id)
      update(newSelectedRooms)
    } else {
      update([...selectedRooms, id])
    }
  }

  const renderActionList = () => {
    const selectedRoomsObjects = selectedRooms.map((id) => floor.rooms.find((room) => room.id === id))
    if (lodashIsEmpty(selectedRoomsObjects)) {
      return
    }

    const avilableActions = ['RENAME', 'PIN']

    if (selectedRooms.length === 1 && !lodashIsEmpty(selectedRoomsObjects[0].splitTo)) {
      avilableActions.push('SPLIT')
    }

    if (selectedRooms.length === 2 && isInTheSameTube(selectedRoomsObjects)) {
      avilableActions.push('SWAP')
    }

    if (selectedRooms.length >= 2 && isInTheSameTube(selectedRoomsObjects)) {
      if (areAllRoomsClose(selectedRoomsObjects)) {
        avilableActions.push('MERGE')
      }
    }
    console.log(avilableActions)
  }

  renderActionList()

  const renderRooms = () => {
    return floor.rooms.map((room, index) => (
      <Room
        index={index}
        selected={lodashIncludes(selectedRooms, index)}
        onClick={(id) => onRoomClicked(id, useSelectedRooms)}
        key={index}
        room={room}
      />
    ))
  }

  const renderExternalwalls = () => {
    const wallWidth = 3
    const polygon = [...floor.boundary_points, floor.boundary_points[0]]

    const jstsArray = polygon.map((v) => new geom.Coordinate(...v, 0))
    const boundary_line = new geom.GeometryFactory().createLinearRing(jstsArray)
    const boundary_poly = boundary_line.buffer(wallWidth, -2)

    const externalLine = boundary_poly._shell._points._coordinates
    const holeLine = boundary_poly._holes[0]._points._coordinates

    const shape = new THREE.Shape(externalLine.map((v) => new THREE.Vector2(v.x, v.y)))
    shape.holes.push(new THREE.Shape(holeLine.map((v) => new THREE.Vector2(v.x, v.y))))

    return (
      <mesh castShadow>
        <extrudeBufferGeometry castShadow attach="geometry" args={[shape, extrudeSettings]} />
        <meshStandardMaterial attach="material" color={'grey'} />
      </mesh>
    )
  }

  const renderInnerWalls = () => {
    // cut the number to only 2 decimals for performance
    const shorterVertexCoordinates = (polygon) => polygon.map((vertex) => vertex.map((coordinate) => Number(coordinate.toFixed(2))))
    // get the wall shape using 2 cuntors of the walls and inner walls
    const getRoomWalls = (room) =>
      room.points && room.inner_points && difference([shorterVertexCoordinates(room.points)], [shorterVertexCoordinates(room.inner_points)])

    // get all of the room walls of this floor
    const wallMultiPolygon = floor.rooms.map((room) => getRoomWalls(room)).filter((e) => e)
    // unlion the walls and return array of secctions that the first item is the wall and all other are the holes
    const unionedWallPolygons = union(lodashFlatten(wallMultiPolygon, 1))

    return (
      <group>
        {unionedWallPolygons.map((polygon, index) => {
          const shape = new THREE.Shape(polygon[0].map((v) => new THREE.Vector2(...v))) // first item is the room external wall

          if (polygon.length >= 2) {
            // from index 1 its the holes polygon
            const holesArray = [...polygon]
            holesArray.shift() // remove the first polygon
            holesArray.map((hole) => shape.holes.push(new THREE.Shape(hole.map((v) => new THREE.Vector2(...v)))))
          }

          return (
            <mesh castShadow key={index}>
              <extrudeBufferGeometry castShadow attach="geometry" args={[shape, extrudeSettings]} />
              <meshStandardMaterial attach="material" color={'grey'} />
            </mesh>
          )
        })}
      </group>
    )
  }

  const renderCorridors = () => {
    return floor.corridor_polygons.map((corridor, index) => (
      <Mesh key={index} contour={corridor.boundary} holes={corridor.holes} color={'#e1d4c6'} />
    ))
  }

  const renderObstacles = () => {
    if (!floor.obstacles) {
      return null
    }

    return floor.obstacles.map((obstacle, index) => <Mesh key={index} contour={obstacle} color={'gray'} />)
  }

  const renderMullions = () => {
    if (!floor.mullions) {
      return null
    }

    return floor.mullions.map((mullion, index) => <Mullion key={index} position={mullion[0]} />)
  }

  return (
    <group scale={[0.05, 0.05, 0.05]}>
      {/* ============== corridors ============== */}
      {renderCorridors()}

      {/* ============== core ============== */}
      {/* {renderObstacles()} */}

      {/* ============== rooms ============== */}
      {renderRooms()}

      {/* ============== mullions ============== */}
      {renderMullions()}

      {/* ============== border line ============== */}
      {renderExternalwalls()}

      {/* ============== inner walls ============== */}
      {renderInnerWalls()}
    </group>
  )
}

export default Floor
