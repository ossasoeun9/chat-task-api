import Task from "../models/task-model.js"
import JSONStream from "JSONStream"

const getTasks = (req, res) => {
  const { latest_timestamp } = req.query
  const { _id } = req.user
  let query = { owner: _id }
  if (latest_timestamp) {
    query.updated_at = { $gte: latest_timestamp, $ne: latest_timestamp }
  }
  Task.find(query)
    .sort({ created_at: -1 })
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res.type("json"))
}

const createTask = async (req, res) => {
  const { _id } = req.user
  const { label, room } = req.body

  if (!label) {
    return res.status(400).json({ message: "Label is required" })
  }

  try {
    const task = await Task.create({
      owner: _id,
      label: label,
      room,
    })
    return res.json(task)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const editTask = async (req, res) => {
  const { _id } = req.user
  const {
    label,
    room,
    depend_on,
    start_at,
    end_at,
    status,
    priority,
    location,
    note,
  } = req.body

  try {
    const task = await Task.updateOne(
      { _id: req.params.id },
      {
        owner: _id,
        label: label,
        room,
        depend_on: depend_on ? JSON.stringify(depend_on) : undefined,
        start_at,
        end_at,
        status,
        priority,
        location,
        note,
      }
    )
    return res.json(task)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const assignTaskTo = async (req, res) => {
  return res.json("Assign Task")
}

const removeAssignTaskTo = async (req, res) => {
  return res.json("Remove Assign Task")
}

const deleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id, owner: req.user._id })
    return res.json({ message: "Delete successfully" })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const addAttachment = async (req, res) => {
  return res.json("Add Attachment")
}

const deleteAttachment = async (req, res) => {
  return res.json("delete Attachment")
}

export {
  addAttachment,
  deleteAttachment,
  getTasks,
  createTask,
  editTask,
  assignTaskTo,
  removeAssignTaskTo,
  deleteTask,
}
