import Task from "../models/task-model.js"
import JSONStream from "JSONStream"
import { randomBytes } from "crypto"
import path from "path"
import fs from "fs"
import { getFileSize } from "../utils/file-utils.js"
import Attachment from "../models/attachment-model.js"

const getTasks = (req, res) => {
  const { latest_timestamp, type } = req.query
  const { _id } = req.user
  let query = { $or: [{ owner: _id }, { assigned_to: { $in: [_id] } }] }
  if (latest_timestamp) {
    query.updated_at = { $gte: latest_timestamp, $ne: latest_timestamp }
  }
  if (type == 1) {
    return Task.find(query)
      .sort({ created_at: -1 })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  }
  if (type == 2) {
    return Task.findDeleted(query)
      .sort({ created_at: -1 })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  }
  return Task.findWithDeleted(query)
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
      room
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
    progress,
    note
  } = req.body

  if (progress && (progress < 0 || progress > 100)) {
    return res.status(400).json({ message: "Progress is between (0-100)" })
  }

  // try {
  await Task.updateOne(
    { _id: req.params.id },
    {
      owner: _id,
      label: label,
      room,
      depend_on: depend_on ? JSON.parse(depend_on) : undefined,
      start_at,
      end_at,
      status,
      priority,
      location: JSON.parse(location),
      progress,
      note
    }
  )
  const updatedTask = await Task.findById(req.params.id)
  res.json(updatedTask)
  // } catch (error) {
  //   return res.status(500).json({ message: error })
  // }
}

const assignTaskTo = async (req, res) => {
  const { _id } = req.user
  const { id } = req.params
  const { member_ids } = req.body
  if (!member_ids) {
    return res.status(400).json({ message: "Member ids is required" })
  }
  try {
    const task = await Task.findById(id)
    if (!task) {
      return res.status(400).json({ message: "Task not found" })
    }
    if (task.owner != _id) {
      return res.status(400).json({ message: "Permission denined" })
    }
    await Task.updateOne(
      { _id: id },
      { $addToSet: { assigned_to: JSON.parse(member_ids) } }
    )
    const updatedTask = await Task.findById(id)
    res.json(updatedTask)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const removeAssignTaskTo = async (req, res) => {
  const { _id } = req.user
  const { id } = req.params
  const { member_ids } = req.body
  if (!member_ids) {
    return res.status(400).json({ message: "Member ids is required" })
  }
  try {
    const task = await Task.findById(id)
    if (!task) {
      return res.status(400).json({ message: "Task not found" })
    }
    if (task.owner != _id) {
      return res.status(400).json({ message: "Permission denined" })
    }
    await Task.updateOne(
      { _id: id },
      { $pullAll: { assigned_to: JSON.parse(member_ids) } }
    )
    const updatedTask = await Task.findById(id)
    res.json(updatedTask)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const deleteTask = async (req, res) => {
  try {
    await Task.delete({ _id: req.params.id, owner: req.user._id })
    return res.json({ message: "Delete successfully" })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const addAttachment = async (req, res) => {
  const { _id } = req.user
  const { attachments } = req.files
  const { id } = req.params

  if (!attachments) {
    return res.status(400).json({ message: "Attchments is required" })
  }

  try {
    if (Array.isArray(attachments)) {
      var resFiles = []
      for (let i = 0; i < attachments.length; i++) {
        const element = attachments[i]
        const sss = await storeAttachment(element.path, id, _id)
        resFiles.push(sss)
      }
      const newAttachments = await Attachment.insertMany(resFiles)
      await Task.updateOne(
        { _id: id, owner: _id },
        {
          $addToSet: { attachments: newAttachments }
        }
      )
      const updatedData = await Task.findById(id)
      return res.json(updatedData)
    } else {
      const resFile = await storeAttachment(attachments.path, id, _id)
      const newAttachment = await Attachment.create(resFile)
      await Task.updateOne(
        { _id: id, owner: _id },
        {
          $addToSet: { attachments: [newAttachment._id] }
        }
      )
      const updatedData = await Task.findById(id)
      return res.json(updatedData)
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const storeAttachment = async (filePath, taskId, userId) => {
  const size = getFileSize(filePath)

  const dir = `storage/task-attachments/${taskId}/`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const filename =
    Date.now() + "." + randomBytes(6).toString("hex") + path.extname(filePath)

  const fullPath = path.normalize(`${dir}/${filename}`)

  const content = fs.readFileSync(filePath)

  // write
  fs.writeFileSync(fullPath, content)

  // clear tmp dir
  fs.unlinkSync(filePath)

  return {
    filename,
    size,
    task: taskId,
    owner: userId
  }
}

const deleteAttachment = async (req, res) => {
  const { _id } = req.user
  const { id } = req.params
  const { attachment_ids } = req.body
  try {
    await Attachment.deleteMany({
      _id: { $in: JSON.parse(attachment_ids) },
      task: id
    })
    await Task.updateOne(
      { _id: id, owner: _id },
      { $pullAll: { attachments: JSON.parse(attachment_ids) } }
    )
    const updatedData = await Task.findById(id)
    return res.json(updatedData)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export {
  addAttachment,
  deleteAttachment,
  getTasks,
  createTask,
  editTask,
  assignTaskTo,
  removeAssignTaskTo,
  deleteTask
}
