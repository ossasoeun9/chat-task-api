const getAreas = (req, res) => {
  res.send("Get Areas")
}

const createArea = (req, res) => {
  res.send("Create Area")
}

const editArea = (req, res) => {
  res.send("Edit Area")
}

const deleteArea = (req, res) => {
  res.send("Delete area")
}

const addProjects = (req, res) => {
  res.send("Add projects")
}

const removeProjects = (req, res) => {
  res.send("Remove area")
}

export {
  getAreas,
  createArea,
  editArea,
  deleteArea,
  addProjects,
  removeProjects
}
