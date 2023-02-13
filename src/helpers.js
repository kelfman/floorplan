import lodashIsNumber from 'lodash/isNumber'
import lodashJoin from 'lodash/join'
import lodashPullAll from 'lodash/pullAll'
import lodashPullAt from 'lodash/pullAt'
import lodashDrop from 'lodash/drop'
import lodashUniq from 'lodash/uniq'

export const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise,no-mixed-operators
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

export const numberWithComma = (number, options = { fixed: 3, suffix: '' }) => {
  if (!lodashIsNumber(Number(number))) {
    return
  }
  return (
    parseFloat(Number(number).toFixed(options.fixed))
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + options.suffix
  )
}

export const lerp = (x, y, a) => x * (1 - a) + y * a

export const compareVertexAdjacency = (a, b) => {
  const filteredVertexes = lodashPullAll(
    a.map((x) => lodashJoin(x)),
    b.map((x) => lodashJoin(x))
  )
  return filteredVertexes.length && filteredVertexes.length < a.length
}

export const areAllRoomsClose = (rooms) => {
  const goodRooms = [rooms[0]]
  const roomsToInsert = [...lodashDrop(rooms)]

  while (goodRooms.length < rooms.length) {
    let found_good_room_this_round = false
    for (const roomIndex in roomsToInsert) {
      for (const goodRoomIndex in goodRooms) {
        if (compareVertexAdjacency(goodRooms[goodRoomIndex].points, roomsToInsert[roomIndex].points)) {
          goodRooms.push(roomsToInsert[roomIndex])
          lodashPullAt(roomsToInsert, [roomIndex])
          found_good_room_this_round = true
          break
        }
      }
    }
    if (!found_good_room_this_round) {
      return false
    }
  }

  return true
}

export const isInTheSameTube = (rooms) => {
  return lodashUniq(rooms.map((room) => room.tubeId)).length === 1
}
