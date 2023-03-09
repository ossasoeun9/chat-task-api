import connectDB from "./configs/db-config.js"
import ChatRoom from "./models/chat-room-model.js"
import User from "./models/user-model.js"

connectDB()

const storePhones = async () => {
  try {
    const users = await User.find()
    const rooms = await ChatRoom.find()
    for (let i = 0; i < users.length; i++) {
      const { _id } = users[i]
      console.log(
        rooms
          .filter(
            (data) => data.members.includes(_id) || data.people.includes(_id)
          )
          .map((e) => e._id)
      )
      await User.updateOne(
        { _id: _id },
        {
          $set: {
            rooms: rooms
              .filter(
                (data) =>
                  data.members.includes(_id) || data.people.includes(_id)
              )
              .map((e) => e._id)
          }
        }
      )
    }
    console.log("Success")
  } catch (error) {
    console.log(error)
  }
}

storePhones()
