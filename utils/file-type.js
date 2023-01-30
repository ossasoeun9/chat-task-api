import path from "path"
import {
  imageExtentions,
  videoExtensions
} from "./constants/file-type-contants.js"

const isVideo = (filePath) => {
  const ext = path.extname(filePath).replace(".", "")
  const isVideo = videoExtensions.indexOf(ext) != -1
  return isVideo
}

const isImage = (filePath) => {
  const ext = path.extname(filePath).replace(".", "")
  const isImage = imageExtentions.indexOf(ext) != -1
  return isImage
}

export { isVideo, isImage }
