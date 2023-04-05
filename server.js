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
import path from "path";
import fs from "fs";

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
// app.use("/user-profile", express.static("storage/user-profile"))
app.use("/user-profile", (req, res, next) => {
  try {
    express.static(path.join(__dirname, "storage", "user-profile"))(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(404).send("File not found");
  }
});
// app.use("/group-profile", express.static("storage/group-profile"))
app.use("/group-profile", (req, res, next) => {
  try {
    express.static(path.join(__dirname, "storage", "group-profile"))(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(404).send("File not found");
  }
});
// app.use("/voice-messages", express.static("storage/voice-messages"))
app.get('/voice-messages/:id/:name', (req, res) => {
  const id = req.params.id;
  const name = req.params.name;

  const voiceMessage = path.join("storage/voice-messages/"+id+"/", name);

  if (voiceMessage) {
    res.json(voiceMessage);
  } else {
    res.status(404).send('Voice message not found');
  }
});
// app.get('/voice-messages/:fileName', (req, res) => {
//   try {
//     const fileName = req.params.fileName;
//     const filePath = path.join(__dirname, 'storage/voice-messages', fileName);
//
//     if (!fs.existsSync(filePath)) {
//       throw new Error('File not found');
//     }
//
//     res.download(filePath, fileName, (err) => {
//       if (err) {
//         throw new Error('Error downloading file');
//       }
//     });
//   } catch (err) {
//     res.status(404).send(err.message);
//   }
// });
// app.use("/media", express.static("storage/media"))
app.use("/media", (req, res, next) => {
  try {
    express.static(path.join(__dirname, "storage", "media"))(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(404).send("File not found");
  }
});
// app.use("/files", express.static("storage/files"))
app.use("/files", (req, res, next) => {
  try {
    express.static(path.join(__dirname, "storage", "files"))(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(404).send("File not found");
  }
});

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

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`ChatTask app listening on port ${port}!`)
})
