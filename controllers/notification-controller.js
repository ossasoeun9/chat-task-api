import https from "https"
import Message from "../models/message-model.js"
import User from "../models/user-model.js"
import os from "os"
import { msgToJson } from "../utils/msg-to-json.js"

const sendNotification = async (messageId) => {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic ZTY5YWY3MWItZTMzNi00ZDJiLWEyMTgtYjY0YTlmN2I1ZmRj"
  }

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  }
  var message = await Message.findById(messageId)
    .populate("room")
    .populate("sender")
  User.find({
    rooms: { $in: [message.room._id] },
    _id: { $ne: message.sender._id },
    is_online: false
  }).then(async (users) => {
    let content = "Sent a message"
    var ids = users.map((user) => {
      return user._id.valueOf()
    })

    if (message.type == 2 || message.type == 1) {
      content = message.text
    }

    if (message.type == 3) {
        content = "Fowarded a message"
    }

    if (message.type == 4) {
        content = "Sent voice message"
    }

    if (message.type == 5) {
        content = "Sent media"
    }

    if (message.type == 6) {
        content = "Sent file"
    }

    if (message.type == 7) {
        content = "Sent url"
    }

    let heading = message.sender.first_name
      ? message.sender.first_name
      : `@${message.sender.username}`
    if (message.room.type != 2) {
      heading = message.room.name + " | " + heading
    }

    message.sender = message.sender._id
    message.room = message.room._id
    const oneSignalAppId = process.env.ONE_SIGNAL_APP_ID;
    var body = {
      app_id: oneSignalAppId,
      contents: { en: content },
      headings: {
        en: heading
      },
      include_external_user_ids: ids,
      data: msgToJson(message)
    }

    var req = https.request(options, function (res) {
      res.on("data", function (data) {})
    })

    req.on("error", function (e) {
      console.log("ERROR:")
      console.log(e)
    })

    req.write(JSON.stringify(body))
    req.end()
  })
}

export { sendNotification }
