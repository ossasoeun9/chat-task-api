import Area from "../models/area-model.js"
import JSONStream from "JSONStream"
import ChatRoom from "../models/chat-room-model.js"
import { roomToJson } from "../utils/chat-room-to-json.js"

const getAreas = (req, res) => {
  const { latest_timestamp } = req.query
  const { _id } = req.user
  let query = { owner: _id }
  if (latest_timestamp) {
    query.updated_at = { $gte: latest_timestamp, $ne: latest_timestamp }
  }
  Area.find(query)
    .sort({ created_at: -1 })
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res.type("json"))
}

const createArea = async (req, res) => {
  const { _id } = req.user
  const { label } = req.body
  if (!label) {
    return res.status(400).json("Label is required")
  }
  try {
    const area = await Area.create({ label, owner: _id })
    return res.json(area)
  } catch (error) {
    res.status(500).json({ error })
  }
}

const editArea = async (req, res) => {
  const { _id } = req.user
  const { label } = req.body
  const { id } = req.params
  if (!label) {
    return res.status(400).json("Label is required")
  }
  try {
    const area = await Area.find({ _id: id, owner: _id })
    if (!area || area.length == 0) {
      return res.status(400).json({ message: "Room not found" })
    }
    area[0].label = label
    await area[0].save()
    return res.json(area[0])
  } catch (error) {
    res.status(500).json({ error })
  }
}

const deleteArea = async (req, res) => {
  const { _id } = req.user
  const { id } = req.params
  try {
    const area = await Area.find({ _id: id, owner: _id })
    if (!area || area.length == 0) {
      return res.status(400).json({ message: "Room not found" })
    }
    await area[0].delete()
    return res.json({ message: "deleted" })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const addProjects = async (req, res) => {
  const { projects } = req.body
  const { id } = req.params
  if (!projects) {
    return res.status(400).json({
      message: "Projects is required"
    })
  }
  const projectsJson = JSON.parse(projects)

  try {
    await ChatRoom.updateMany(
      { _id: { $in: projectsJson }, type: 5 },
      { $addToSet: { areas: [id] } }
    )
    ChatRoom.find({ _id: { $in: projectsJson }, type: 5 })
      .cursor({
        transform: (data) => {
          return roomToJson(data, req.user.id)
        }
      })
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  } catch (error) {
    res.status(500).json({ error })
  }
}

const removeProjects = async (req, res) => {
  const { projects } = req.body
  const { id } = req.params
  if (!projects) {
    return res.status(400).json({
      message: "Projects is required"
    })
  }
  const projectsJson = JSON.parse(projects)

  try {
    await ChatRoom.updateMany(
      { _id: { $in: projectsJson }, type: 5 },
      {$pullAll: { areas: [id] }}
    )
    ChatRoom.find({ _id: { $in: projectsJson }, type: 5 })
      .cursor({
        transform: (data) => {
          return roomToJson(data, req.user.id)
        }
      })
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export {
  getAreas,
  createArea,
  editArea,
  deleteArea,
  addProjects,
  removeProjects
}
