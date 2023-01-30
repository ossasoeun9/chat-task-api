import fs from "fs"

const getFileSize = (path) => {
  var stats = fs.statSync(path)
  return stats.size
}

export { getFileSize }
