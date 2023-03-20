const getTasks = async (req, res) => {
  return res.json("Get Task")
}

const createTask = async (req, res) => {
  return res.json("Create Task")
}

const editTask = async (req, res) => {
  return res.json("Edit Task")
}

const assignTaskTo = async (req, res) => {
  return res.json("Assign Task")
}

const removeAssignTaskTo = async (req, res) => {
  return res.json("Remove Assign Task")
}

const deleteTask = async (req, res) => {
  return res.json("Create Task")
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
  deleteTask
}
