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
  } catch (err) {
    console.log(err)
  }
}

export default createDir
