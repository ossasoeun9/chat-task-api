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
import messageRoute from "./routes/message-route.js"
import expressWs from "express-ws"
import { wsController } from "./controllers/ws-controller.js"

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
app.use("/user-profile", express.static("storage/user-profile"))
app.use("/group-profile", express.static("storage/group-profile"))
app.use("/voice-messages", express.static("storage/voice-messages"))
app.use("/media", express.static("storage/media"))
app.use("/files", express.static("storage/files"))

// Protected route
app.use(verifyToken)
app.use("/users", userRoute)
app.use("/device-login", deviceRoute)
app.use("/contacts", contactRoute)
app.use("/chat-rooms", chatRoomRoute)
app.use("/messages", messageRoute)

// protected websoket
app.ws("/chats", wsController)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`ChatTask app listening on port ${port}!`)
})
