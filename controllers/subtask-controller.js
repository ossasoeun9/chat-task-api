import Message from "../models/message-model.js"
import SubTask from "../models/sub-task-model.js"
import Task from "../models/task-model.js"
import { sendMessageToClient } from "./ws-message-controller.js"

const addSubtask = async (req, res) => {
  const { _id } = req.user
  const { label, task_id } = req.body
  if (!label || !task_id) {
    return res.status(400).json({ message: "Label and Task id is required" })
  }
  try {
    const task = await Task.findById(task_id)
    if (!task) return res.status(400).json({ message: "Task not found" })
    if (task.owner != _id && !task.assigned_to.includes(_id))
      return res.status(400).json({ message: "Permission denined" })
    const subtask = await SubTask.create({
      label,
      parent: task_id
    })
    if (task.room) {
      createMessageAndSendToClient(
        _id,
        `(${label}) was added to Task (${task.label})`,
        task.room,
        task._id
      )
    }
    return res.json(subtask)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const editSubtask = async (req, res) => {
  const { _id } = req.user
  const { label } = req.body
  const { id } = req.params
  if (!label) {
    return res.status(400).json({ message: "Label is required" })
  }
  try {
    const subtask = await SubTask.findById(id)
    if (!subtask) {
      return res.status(400).json({ message: "Subtask not found" })
    }
    const task = await Task.findById(subtask.parent)
    if (!task) return res.status(400).json({ message: "Task not found" })
    if (task.owner != _id && !task.assigned_to.includes(_id))
      return res.status(400).json({ message: "Permission denined" })
    subtask.label = label
    await subtask.save()
    if (task.room) {
      createMessageAndSendToClient(
        _id,
        `(${label}) of Task (${task.label}) was edited`,
        task.room,
        task._id
      )
    }
    return res.json(subtask)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const removeSubtask = async (req, res) => {
  const { _id } = req.user
  const { id } = req.params
  try {
    const subtask = await SubTask.findById(id)
    if (!subtask) {
      return res.status(400).json({ message: "Subtask not found" })
    }
    const task = await Task.findById(subtask.parent)
    if (!task) return res.status(400).json({ message: "Task not found" })
    if (task.owner != _id && !task.assigned_to.includes(_id))
      return res.status(400).json({ message: "Permission denined" })
    await subtask.delete()
    if (task.room) {
      createMessageAndSendToClient(
        _id,
        `(${subtask.label}) was removed from Task (${task.label})`,
        task.room,
        task._id
      )
    }
    return res.json({ message: "Deleted succesfully" })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const markOrUnmarkSubtask = async (req, res) => {
  const { _id } = req.user
  const { id } = req.params
  try {
    const subtask = await SubTask.findById(id)
    if (!subtask) {
      return res.status(400).json({ message: "Subtask not found" })
    }
    const task = await Task.findById(subtask.parent)
    if (!task) return res.status(400).json({ message: "Task not found" })
    if (task.owner != _id && !task.assigned_to.includes(_id))
      return res.status(400).json({ message: "Permission denined" })
    subtask.is_completed = !subtask.is_completed
    await subtask.save()
    if (task.room) {
      createMessageAndSendToClient(
        _id,
        `(${subtask.label}) of (Task ${task.label}) was checked as ${subtask.is_completed? 'completed': 'incompleted'}`,
        task.room,
        task._id
      )
    }
    return res.json(subtask)
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

export { addSubtask, editSubtask, removeSubtask, markOrUnmarkSubtask }
