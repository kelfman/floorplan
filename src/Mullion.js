import React from 'react'
import { Box } from '@react-three/drei'

const Mullion = (props) => {
  const { position, color } = props

  return (
    <Box castShadow args={[14, 14, 18]} position={[...position, 4]}>
      <meshStandardMaterial attach="material" color={color || 'grey'} />
    </Box>
  )
}

export default Mullion
