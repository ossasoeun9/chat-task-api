import path from "path"
import fs from "fs"

const root = process.cwd()
const __dirname = "./"
const defaultImagePath = "asset-data/default.png"
const glitchSound = "asset-data/glitch-sound.mp3"

const userProfilePath = path.join(root, "storage", "user-profile")

const getUserProfile = async (req, res) => {
  try {
    const filePath = path.join(userProfilePath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
      res.sendFile(path.join(root, '..', defaultImagePath));
    }
  } catch (err) {
    res.sendFile(path.join(root, '..', defaultImagePath));
  }
}

const groupProfilePath = path.join(root, "storage", "group-profile")

const getGroupProfile = async (req, res) => {
  try {
    const filePath = path.join(groupProfilePath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
      res.sendFile(path.join(root, '..', defaultImagePath));
    }
  } catch (err) {
    res.sendFile(path.join(root, '..', defaultImagePath));
  }
}

const voiceMessagesPath = path.join(root, "storage", "voice-messages")

const getVoiceMessage = async (req, res) => {
  try {
    const filePath = path.join(voiceMessagesPath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
      res.sendFile(path.join(root, '..', glitchSound));
    }
  } catch (err) {
    res.sendFile(path.join(root, '..', glitchSound));
  }
}

const mediaPath = path.join(root, "storage", "media")

const getMedia = async (req, res) => {
  try {
    const filePath = path.join(mediaPath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
      res.sendFile(path.join(root, '..', defaultImagePath));
    }
  } catch (err) {
    res.sendFile(path.join(root, '..', defaultImagePath));
  }
}

const filePathww = path.join(root, "storage", "files")

const getFile = async (req, res) => {
  try {
    const newFilePath = path.join(filePathww, req.url)
    if (fs.existsSync(newFilePath)) {
      res.sendFile(newFilePath)
    } else {
      res.sendFile(path.join(root, '..', defaultImagePath));
    }
  } catch (err) {
    res.sendFile(path.join(root, '..', defaultImagePath));
  }
}

export { getUserProfile, getGroupProfile, getFile, getMedia, getVoiceMessage }
