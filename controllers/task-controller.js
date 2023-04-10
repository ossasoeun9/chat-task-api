import Task from "../models/task-model.js"
import JSONStream from "JSONStream"
import { randomBytes } from "crypto"
import path from "path"
import fs from "fs"
import { getFileSize } from "../utils/file-utils.js"
import Attachment from "../models/attachment-model.js"
import Message from "../models/message-model.js"
import { sendMessageToClient } from "./ws-message-controller.js"
import User from "../models/user-model.js"
import SubTask from "../models/sub-task-model.js"

const getTasks = (req, res) => {
  const { latest_timestamp } = req.query
  const { _id } = req.user
  let query = { $or: [{ owner: _id }, { assigned_to: { $in: [_id] } }] }
  if (latest_timestamp) {
    query.updated_at = { $gte: latest_timestamp, $ne: latest_timestamp }
  }
  if (latest_timestamp) {
    Task.findWithDeleted(query)
      .populate("subtasks")
      // .populate("owner")
      // .populate("assigned_to")
      .populate("attachments")
      .sort({ created_at: -1 })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  } else {
    Task.find(query)
      .populate("subtasks")
      // .populate("owner")
      // .populate("assigned_to")
      .populate("attachments")
      .sort({ created_at: -1 })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  }
}

const createTask = async (req, res) => {
  const { _id } = req.user
  const {
    label,
    depend_on,
    start_at,
    end_at,
    status,
    priority,
    location,
    progress,
    note,
    heading,
    room,
    member_ids
  } = req.body

  if (!label) {
    return res.status(400).json({ message: "Label is required" })
  }

  try {
    const task = await Task.create({
      owner: _id,
      label: label,
      heading,
      room,
      location: location ? JSON.parse(location) : undefined,
      depend_on: depend_on ? JSON.parse(depend_on) : undefined,
      start_at,
      end_at,
      status,
      priority,
      progress,
      note,
      assign_to: JSON.parse(member_ids)
    })
    if (room) {
      createMessageAndSendToClient(
        _id,
        `Task (${label}) was created`,
        room,
        task._id
      )
    }
    return res.json(task)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const editTask = async (req, res) => {
  const { _id } = req.user
  const { id } = req.params
  const {
    label,
    depend_on,
    start_at,
    end_at,
    status,
    priority,
    location,
    progress,
    note,
    heading,
    room,
    member_ids
  } = req.body

  if (!label) {
    return res.status(400).json({ message: "Label is required" })
  }

  if (progress && (progress < 0 || progress > 100)) {
    return res.status(400).json({ message: "Progress is between (0-100)" })
  }

  try {
    const task = await Task.findById(id)
      .populate("subtasks")
      .populate("attachments")
    if (!task) return res.status(400).json({ message: "Task not found" })
    if (task.owner != _id && !task.assigned_to.includes(_id))
      return res.status(400).json({ message: "Permission denined" })
    task.label = label
    task.depend_on = depend_on ? JSON.parse(depend_on) : undefined
    task.start_at = start_at
    task.end_at = end_at
    task.status = status
    task.priority = priority
    task.location = location ? JSON.parse(location) : undefined
    task.progress = progress
    task.heading = heading
    task.note = note
    task.room = room
    task.assigned_to = JSON.parse(member_ids)
    await task.save()
    if (task.room) {
      createMessageAndSendToClient(
        _id,
        `Task (${label}) was edited`,
        task.room,
        task._id
      )
    }
    res.json(task)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
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
      .populate("subtasks")
      .populate("attachments")
    if (updatedTask.room) {
      const members = JSON.parse(member_ids)
      for (let i = 0; i < members.length; i++) {
        const user = await User.findById(members[i])
        if (user) {
          createMessageAndSendToClient(
            _id,
            `@${user.username} was assigned to Task (${task.label})`,
            task.room,
            id
          )
        }
      }
    }
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
      .populate("subtasks")
      .populate("attachments")
    if (updatedTask.room) {
      const members = JSON.parse(member_ids)
      for (let i = 0; i < members.length; i++) {
        const user = await User.findById(members[i])
        if (user) {
          createMessageAndSendToClient(
            _id,
            `@${user.username} was removed from Task (${updatedTask.label})`,
            task.room,
            id
          )
        }
      }
    }
    res.json(updatedTask)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const deleteTask = async (req, res) => {
  const { _id } = req.user
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(400).json({ message: "Task not found" })
    }
    if (task.owner != _id) {
      return res.status(400).json({ message: "Permission denined" })
    }
    await Task.delete({ _id: req.params.id })
    await Attachment.deleteMany({ task: req.params.id })
    await SubTask.deleteMany({ parent: req.params.id })
    if (task.room) {
      createMessageAndSendToClient(
        _id,
        `Task (${task.label}) was deleted`,
        task.room,
        task._id
      )
    }
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
    const task = await Task.findById(id)
    if (!task) return res.status(400).json({ message: "Task not found" })
    if (task.owner != _id && !task.assigned_to.includes(_id))
      return res.status(400).json({ message: "Permission denined" })
    if (Array.isArray(attachments)) {
      var resFiles = []
      for (let i = 0; i < attachments.length; i++) {
        const element = attachments[i]
        var sss = await storeAttachment(element.path, id, _id)
        sss.original_name = path.basename(element.originalFilename)
        resFiles.push(sss)
      }
      await Attachment.insertMany(resFiles)
      const updatedData = await Task.findById(id)
        .populate("subtasks")
        .populate("attachments")
      if (task.room) {
        createMessageAndSendToClient(
          _id,
          `${resFiles.length} attachments was added to Task (${task.label})`,
          task.room,
          task._id
        )
      }
      return res.json(updatedData)
    } else {
      var resFile = await storeAttachment(attachments.path, id, _id)
      resFile.original_name = path.basename(attachments.originalFilename)
      await Attachment.create(resFile)
      const updatedData = await Task.findById(id)
        .populate("subtasks")
        .populate("attachments")
      if (task.room) {
        createMessageAndSendToClient(
          _id,
          `An attachment was added to Task (${task.label})`,
          task.room,
          task._id
        )
      }
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
    Date.now() + "_" + randomBytes(6).toString("hex") + path.extname(filePath)

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
    const task = await Task.findById(id)
      .populate("subtasks")
      .populate("attachments")
    if (!task) return res.status(400).json({ message: "Task not found" })
    if (task.owner != _id && !task.assigned_to.includes(_id))
      return res.status(400).json({ message: "Permission denined" })
    await Attachment.deleteMany({
      _id: { $in: JSON.parse(attachment_ids) },
      task: id
    })
    const updatedData = await Task.findById(id)
      .populate("subtasks")
      .populate("attachments")
    if (task.room) {
      const ids = JSON.parse(attachment_ids)
      createMessageAndSendToClient(
        _id,
        `${
          ids.length == 1 ? "An attachment" : `${ids.length} attachments`
        } was removed from Task (${task.label})`,
        task.room,
        task._id
      )
    }
    return res.json(updatedData)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const createMessageAndSendToClient = (senderId, text, roomId, taskId) => {
  Message.create({
    type: 2,
    text,
    sender: senderId,
    room: roomId,
    task: taskId
  })
    .then(async (value) => {
      sendMessageToClient(value, roomId)
    })
    .catch((error) => {
      console.log(error)
    })
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
