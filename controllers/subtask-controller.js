const addSubtask = async (req, res) => {
  return res.json("Add subtask")
}

const editSubtask = async (req, res) => {
  return res.json("Edit subtask")
}

const removeSubtask = async (req, res) => {
  return res.json("Remove subtask")
}

const markOrUnmarkSubtask = async (req, res) => {
  return res.json("Complete subtask")
}

export { addSubtask, editSubtask, removeSubtask, markOrUnmarkSubtask }
