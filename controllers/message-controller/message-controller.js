const getMessage = async (req, res) => {
  res.send("Get Message")
}

const sendMessage = async (req, res) => {
  res.send("Send Message")
}

const editMessage = async (req, res) => {
  res.send("Edit Message")
}

const deleteMessage = async (req, res) => {
  res.send("Delete Message")
}

export { getMessage, sendMessage, editMessage, deleteMessage }
