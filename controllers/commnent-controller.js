import Comment from "../models/comment-model.js"
import JSONStream from "JSONStream"
import fs from "fs"
import path from "path"
import { isVideo } from "../utils/file-type.js"
import { getFileSize } from "../utils/file-utils.js"
import getAudioDurationInSeconds from "get-audio-duration"
import { randomBytes } from "crypto"

const getCommnets = (req, res) => {
  const { id: taskId } = req.params
  Comment.find({ task: taskId })
    .sort({ created_at: -1 })
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res.type("json"))
}

const postCommnent = (req, res) => {
  const { type } = req.body
  if (!type) return res.status(400).json({ message: "Type is required" })
  if (type < 2 || type > 3)
    return res.status(400).json({ message: "Type is between (2-3)" })
  if (type == 2) {
    return postText(req, res)
  }
  if (type == 3) {
    return postMedia(req, res)
  }
}

const postText = (req, res) => {
  const { _id } = req.user
  const { id: taskId } = req.params
  const { text, ref_commnent } = req.body
  if (!text) return res.status(400).json({ message: "Text is required" })
  Comment.create({
    owner: _id,
    type: 2,
    text,
    task: taskId,
    ref_commnent
  })
    .then(async (value) => {
      res.json(value)
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
}

const postMedia = async (req, res) => {
  const { media } = req.files
  const { id: taskId } = req.params
  const { _id: userId } = req.user
  const { text } = req.body

  const is_video = isVideo(media.path)
  const size = getFileSize(media.path)

  const dir = `storage/task-media/${taskId}/`

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    const filename =
      Date.now() +
      "_" +
      randomBytes(6).toString("hex") +
      path.extname(media.path)

    const fullPath = path.normalize(`${dir}/${filename}`)

    const content = fs.readFileSync(media.path)

    // write
    fs.writeFileSync(fullPath, content)

    // clear tmp dir
    fs.unlinkSync(media.path)

    let media2
    if (is_video) {
      const duration = (await getAudioDurationInSeconds(fullPath)) * 1000
      media2 = {
        filename,
        size,
        duration,
        is_video,
        task: taskId
      }
    } else {
      media2 = {
        filename,
        size,
        is_video,
        task: taskId
      }
    }
    res.json(
      await Comment.create({
        owner: userId,
        text,
        media: media2,
        task: taskId
      })
    )
  } catch (error) {
    res.status(500).json({ error })
  }
}

const deleteComment = async (req, res) => {
  const { commentId } = req.params
  try {
    const com = await Comment.findById(commentId)
    if (!com) {
      return res.json({ message: "Deleted" })
    }
    if (com.media) {
      fs.unlinkSync(
        path.normalize(
          `storage/task-media/${com.media.task}/${com.media.filename}`
        )
      )
    }
    await com.delete()
    res.json({ message: "Deleted" })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const editComment = async (req, res) => {
  const { commentId } = req.params
  const { text } = req.body
  try {
    const com = await Comment.findById(commentId)
    if (!com) {
      return res.status(400).json({ message: "Not found" })
    }
    com.text = text
    await com.save()
    res.json(com)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export { getCommnets, postCommnent, deleteComment, editComment }
