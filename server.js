import express from "express"
import dotenv from "dotenv"
import formData from "express-form-data"
import os from "os"

import pigConfig from "./configs/pagination-config.js"
import createDir from "./configs/dir-config.js"
import connectDB from "./configs/db-config.js"
import { verifyToken } from "./middlewares/auth-middleware.js"
import phoneCodeRoute from "./routes/country-route.js"
import userRoute from "./routes/user-route.js"
import authRoute from "./routes/auth-route.js"
import deviceRoute from "./routes/device-route.js"
import contactRoute from "./routes/contact-route.js"
import chatRoomRoute from "./routes/chat-room-route.js"
import taskRoute from "./routes/task-route.js"
import subtaskRoute from "./routes/subtask-route.js"
import messageRoute from "./routes/message-route.js"
import areaRoute from "./routes/area-route.js"
import headingRoute from "./routes/heading-route.js"
import expressWs from "express-ws"
import { wsController } from "./controllers/ws-chats-controller.js"
import { wsMessageController } from "./controllers/ws-message-controller.js"
import { wsUserController } from "./controllers/ws-user-controller.js"
import { wsLoginQrController } from "./controllers/ws-login-qr-controller.js"
import {getFile, getGroupProfile, getMedia, getUserProfile, getVoiceMessage} from "./controllers/file-controller.js";

dotenv.config()
connectDB()
createDir()
pigConfig()

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
}

const app = express()
expressWs(app)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(formData.parse(options))

app.use("/country", phoneCodeRoute)
app.use("/auth", authRoute)


app.use("/user-profile", getUserProfile);
app.use("/group-profile", getGroupProfile);
app.use("/voice-messages", getVoiceMessage);
app.use("/media", getMedia);
app.use("/files", getFile);
app.ws("/login-qr", wsLoginQrController)

// Protected route
app.use(verifyToken)
app.use("/users", userRoute)
app.use("/device-login", deviceRoute)
app.use("/contacts", contactRoute)
app.use("/chat-rooms", chatRoomRoute)
app.use("/messages", messageRoute)
app.use("/areas", areaRoute)
app.use("/heading", headingRoute)
app.use("/task", taskRoute)
app.use("/subtask", subtaskRoute)

// protected websoket
app.ws("/chats", wsController)
app.ws("/message", wsMessageController)
app.ws("/user", wsUserController)


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`ChatTask app listening on port ${port}!`)
})
