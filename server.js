import express from "express"
import dotenv from "dotenv"
import formData from "express-form-data"
import os from "os"

import createDir from "./configs/dir-config.js"
import connectDB from "./configs/db-config.js"
import verifyToken from "./middlewares/auth-middleware.js"
import phoneCodeRoute from "./routes/country-route.js"
import userRoute from "./routes/user-route.js"
import authRoute from "./routes/auth-route.js"
import deviceRoute from "./routes/device-route.js"
import contactRoute from "./routes/contact-route.js"
import chatRoomRoute from "./routes/chat-room-route.js"

dotenv.config()
connectDB()
createDir()

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(formData.parse(options))

app.use("/country", phoneCodeRoute)
app.use("/auth", authRoute)
app.use("/user-profile", express.static("storage/user-profile"))

// Protected route
app.use(verifyToken)
app.use("/users", userRoute)
app.use("/device-login", deviceRoute)
app.use("/contacts", contactRoute)
app.use("/chat-rooms", chatRoomRoute)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`ChatTask app listening on port ${port}!`)
})
