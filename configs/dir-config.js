import fs from "fs"

const createDir = () => {
  try {
    if (!fs.existsSync("storage")) {
      fs.mkdirSync("storage")
    }
    if (!fs.existsSync("storage/user-profile")) {
      fs.mkdirSync("storage/user-profile")
    }
    if (!fs.existsSync("storage/group-profile")) {
      fs.mkdirSync("storage/group-profile")
    }
    if (!fs.existsSync("storage/voice-messages")) {
      fs.mkdirSync("storage/voice-messages")
    }
    if (!fs.existsSync("storage/media")) {
      fs.mkdirSync("storage/media")
    }
    if (!fs.existsSync("storage/files")) {
      fs.mkdirSync("storage/files")
    }
    if (!fs.existsSync("storage/task-attachments")) {
      fs.mkdirSync("storage/task-attachments")
    }
    if (!fs.existsSync("storage/task-media")) {
      fs.mkdirSync("storage/task-media")
    }
  } catch (err) {
    console.log(err)
  }
}

export default createDir
