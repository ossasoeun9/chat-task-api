import mongoose from "mongoose"
import Message from "./message-model.js"
import User from "./user-model.js"
import mongoosePaginate from "mongoose-paginate-v2"
import mongooseAutoPopulate from "mongoose-autopopulate"

/*
Note
1 is saved message room
2 is two people room
3 is private group
4 is public group
*/

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    profile_url: {
      type: String,
      default: null
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: User,
      default: null,
      autopopulate: true
    },
    type: {
      type: Number,
      enum: [1, 2, 3, 4]
    },
    description: {
      type: String,
      default: null
    },
    latest_message: {
      type: mongoose.Types.ObjectId,
      ref: Message,
      default: null,
      autopopulate: true
    },
    people: [
      {
        type: mongoose.Types.ObjectId,
        ref: User,
        default: null,
        autopopulate: true
      }
    ],
    members: [{ type: mongoose.Types.ObjectId, ref: User, autopopulate: true }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

chatRoomSchema.post("find", function () {
  const { $or } = this.getQuery()
  if ($or && $or[0] && $or[0].people) {
    chatRoomSchema.virtual("person").get(function () {
      const { type } = this
      if (type == 2) {
        for (var p in this.people) {
          const person = this.people[p]
          if (person._id.valueOf() != $or[0].people.$in[0].valueOf()) {
            return person
          }
        }
      }
    })
  }
})

chatRoomSchema.post("findOne", function () {
  const { people } = this.getQuery()
  if (people && people[0]) {
    chatRoomSchema.virtual("person").get(function () {
      const { type } = this
      if (type == 2) {
        for (var p in this.people) {
          const person = this.people[p]
          if (person._id.valueOf() != people[0].valueOf()) {
            return person
          }
        }
      }
    })
  }
})

chatRoomSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    const { type } = ret
    delete ret.people
    if (type == 2 || type == 1) {
      delete ret.admin
      delete ret.name
      delete ret.description
      delete ret.created_at
    }
    return ret
  },
  virtuals: true
})

chatRoomSchema.set("toObject", { virtuals: true })

chatRoomSchema.plugin(mongooseAutoPopulate)
chatRoomSchema.plugin(mongoosePaginate)

const ChatRoom = mongoose.model("Chat Room", chatRoomSchema)
export default ChatRoom
