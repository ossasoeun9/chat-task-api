import SubTask from "../models/sub-task-model.js"
import Task from "../models/task-model.js"

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
    return res.json(subtask)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const editSubtask = async (req, res) => {
  const {_id} = req.user
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
    return res.json(subtask)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const removeSubtask = async (req, res) => {
  const {_id} = req.user
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
    return res.json({ message: "Deleted succesfully" })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const markOrUnmarkSubtask = async (req, res) => {
  const {_id} = req.user
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
    return res.json(subtask)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export { addSubtask, editSubtask, removeSubtask, markOrUnmarkSubtask }
