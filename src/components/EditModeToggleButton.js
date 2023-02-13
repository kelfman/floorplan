import React from 'react'
import styled from 'styled-components'
import ToggleIcon from './ToggleIcon'

const EditModeToggleButtonWrapper = styled.div`
  position: absolute;
  z-index: 2;
  background: #ffffff;
  color: ${({ selected }) => (selected ? '#5772ff' : '#8b8b8b')};
  top: 7px;
  right: 7px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 22px;
  overflow: hidden;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.22);
  cursor: pointer;

  svg {
    position: absolute;
    top: 5px;
    left: 5px;
  }
`

const EditModeToggleButton = (props) => {
  const { toggle, selected } = props

  return (
    <EditModeToggleButtonWrapper onClick={() => toggle()} selected={!selected}>
      <ToggleIcon />
    </EditModeToggleButtonWrapper>
  )
}

export default EditModeToggleButton
