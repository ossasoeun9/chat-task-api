import path from "path"
import fs from "fs"

const root = process.cwd()

const defaultImagePath = "asset-data/default.png"
const glitchSound = path.normalize(`${root}/asset-data/glitch-sound.mp3`)

const userProfilePath = path.join(process.cwd(), "storage", "user-profile")

const getUserProfile = async (req, res) => {
  try {
    const filePath = path.join(userProfilePath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
      return res.sendFile(defaultImagePath)
      // res.status(404).send('File not found');
    }
  } catch (err) {
    return res.sendFile(defaultImagePath)
    // res.status(500).send(err.message);
  }
}

const groupProfilePath = path.join(process.cwd(), "storage", "group-profile")

const getGroupProfile = async (req, res) => {
  try {
    const filePath = path.join(groupProfilePath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
        return res.sendFile(defaultImagePath)
      // res.status(404).send('File not found');
    }
  } catch (err) {
    return res.sendFile(defaultImagePath)
    // res.status(500).send(err.message);
  }
}

const voiceMessagesPath = path.join(process.cwd(), "storage", "voice-messages")

const getVoiceMessage = async (req, res) => {
  try {
    const filePath = path.join(voiceMessagesPath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
        return res.sendFile(glitchSound)
      // res.status(404).send('File not found');
    }
  } catch (err) {
    return res.sendFile(glitchSound)
    // res.status(500).send(err.message);
  }
}

const mediaPath = path.join(process.cwd(), "storage", "media")

const getMedia = async (req, res) => {
  try {
    const filePath = path.join(mediaPath, req.url)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
        return res.sendFile(defaultImagePath)
      // res.status(404).send('File not found');
    }
  } catch (err) {
    return res.sendFile(defaultImagePath)
    // res.status(500).send(err.message);
  }
}

const filePathww = path.join(process.cwd(), "storage", "files")

const getFile = async (req, res) => {
  try {
    const newFilePath = path.join(filePathww, req.url)
    if (fs.existsSync(newFilePath)) {
      res.sendFile(newFilePath)
    } else {
        return res.sendFile(defaultImagePath)
      // res.status(404).send('File not found');
    }
  } catch (err) {
    return res.sendFile(defaultImagePath)
    // res.status(500).send(err.message);
  }
}

export { getUserProfile, getGroupProfile, getFile, getMedia, getVoiceMessage }
