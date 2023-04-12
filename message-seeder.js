import connectDB from "./configs/db-config.js"
import ChatRoom from "./models/chat-room-model.js"
import randomWords from "random-words"
import Message from "./models/message-model.js"


// First run `npm install`
// Then run `node message-seeder.js`

const members = [
  "63ebadefdfc50068bb925f03",
  "63ebb20fdfc50068bb925f3d",
  "63ebb5a4dfc50068bb925f6e",
  "640afe98d4d605334793175b",
  "641b352b935adbe3d96de262",
  "63f2f2a5ba703987e3c2e20d",
  "63ebac9ddfc50068bb925ef9",
  "63ec73b4dfc50068bb9260b2",
  "63ee323cef0b3b66ef9ede8d",
  "641a6e6fb6da59e7f345fa4a",
]
const admin = "63ebadefdfc50068bb925f03"

const generate5000Messages = async () => {
  console.log("5000 Messages group was creating")
  const { _id } = await ChatRoom.create({
    name: "5000 Messages",
    admin,
    type: 4,
    members
  })
  console.log("5000 Messages group was created")

  console.log("5000 Messages was generating")
  var messages = []
  for (let i = 0; i < 5000; i++) {
    const text = randomWords({
      exactly: parseInt(Math.random() * 10 + 10),
      join: " "
    })
    const sender = members[parseInt(Math.random() * members.length)]
    messages[i] = { sender, text, room: _id, type: 2 }
  }

  await Message.insertMany(messages)
  console.log("5000 Message was created")
}

const generate10000Messages = async () => {
  console.log("10000 Messages group was creating")
  const { _id } = await ChatRoom.create({
    name: "10000 Messages",
    admin,
    type: 4,
    members
  })
  console.log("10000 Messages group was created")

  console.log("10000 Messages was generating")
  var messages = []
  for (let i = 0; i < 10000; i++) {
    const text = randomWords({
      exactly: parseInt(Math.random() * 10 + 10),
      join: " "
    })
    const sender = members[parseInt(Math.random() * members.length)]
    messages[i] = { sender, text, room: _id, type: 2 }
  }

  await Message.insertMany(messages)
  console.log("10000 Message was created")
}

const runSeader = async () => {
  await connectDB()
  console.log('------------------------------------------------------')
  await generate5000Messages()
  console.log('------------------------------------------------------')
  await generate10000Messages()
  console.log('------------------------------------------------------')
  console.log('Generated successfully')
}

runSeader()
