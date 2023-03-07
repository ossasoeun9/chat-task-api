import { msgToJson } from "./msg-to-json.js"
import dotenv from "dotenv"

dotenv.config()
const apiHost = process.env.API_HOST

const roomPaginateToJson = (pData, userId) => {
  const { meta, data } = pData
  const newRooms = roomsToJson(data, userId)
  return {
    data: newRooms,
    meta
  }
}

const roomsToJson = (rooms, userId) => {
  let listRoom = []
  for (let i = 0; i < rooms.length; i++) {
    listRoom.push(roomToJson(rooms[i], userId))
  }
  return listRoom
}

const roomToJson = (room, userId) => {
  const {
    _id,
    name,
    profile_url,
    admin,
    type,
    description,
    latest_message,
    unread,
    people,
    muted_by,
    created_at,
    updated_at,
    total_member,
  } = room

  const newRoom = { _id, type }

  if (type == 2 && people && people.length == 2) {
    const indexOfPerson =
      people.map((v) => v._id.valueOf()).indexOf(userId) == 0 ? 1 : 0
    newRoom.person = people[indexOfPerson]
  }

  if (type == 3 || type == 4) {
    newRoom.admin = admin
    newRoom.name = name
    newRoom.profile_url = profile_url
      ? `group-profile/${_id}/${profile_url}`
      : null
    newRoom.description = description
  }

  if (latest_message) {
    newRoom.latest_message = msgToJson(latest_message, userId)
  }
  newRoom.unread = unread
  newRoom.is_mute = muted_by.map((v) => v.valueOf()).indexOf(userId) != -1
  newRoom.total_member = total_member
  newRoom.created_at = created_at
  newRoom.updated_at = updated_at

  return newRoom
}

export { roomPaginateToJson, roomsToJson, roomToJson }
