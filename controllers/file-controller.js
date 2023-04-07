import path from "path";
import fs from "fs";

const userProfilePath = path.join(process.cwd(), 'storage', 'user-profile');

const getUserProfile = async (req, res) => {
    try {
        const filePath = path.join(userProfilePath, req.url);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const groupProfilePath = path.join(process.cwd(), 'storage', 'group-profile');

const getGroupProfile = async (req, res) => {
    try {
        const filePath = path.join(groupProfilePath, req.url);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const voiceMessagesPath = path.join(process.cwd(), 'storage', 'voice-messages');

const getVoiceMessage = async (req, res) => {
    try {
        const filePath = path.join(voiceMessagesPath, req.url);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const mediaPath = path.join(process.cwd(), 'storage', 'media');

const getMedia = async (req, res) => {
    try {
        const filePath = path.join(mediaPath, req.url);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const filePathh = path.join(process.cwd(), 'storage', 'files');

const getFile = async (req, res) => {
    try {
        const filePath = path.join(filePathh, req.url);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export { getUserProfile,getGroupProfile, getFile,getMedia,getVoiceMessage }
