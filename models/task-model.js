import mongoose from "mongoose"
import Attachment from "./attachment-model.js"
import User from "./user-model.js"
import mongooseAutoPopulate from "mongoose-autopopulate"
import mongooseDelete from "mongoose-delete"
import SubTask from "./sub-task-model.js"

/*
Note:

Priority
1 is none
2 is low
3 is medium
4 is hight
5 is critical

Status
1 is none
2 is todo
3 is doing
4 is late
5 is timely
6 is ahead
*/

const taskSchema = mongoose.Schema(
  {
    label: { type: String, required: true },
    note: String,
    owner: { type: mongoose.Types.ObjectId, required: true, ref: User },
    room: { type: mongoose.Types.ObjectId, default: null, ref: "Chat Room" },
    assigned_to: [{ type: mongoose.Types.ObjectId, ref: User }],
    start_at: Date,
    end_at: Date,
    location: { address: String, lat: Number, lng: Number },
    depend_on: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
    progress: { type: Number, default: 0 },
    priority: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 },
    status: { type: Number, enum: [1, 2, 3, 4, 5, 6], default: 1 }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

taskSchema.plugin(mongooseAutoPopulate)
taskSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedBy: true,
  deletedByType: String
})


taskSchema.virtual("attachments", {
  ref: "Attachment",
  localField: "_id",
  foreignField: "task"
})

taskSchema.virtual("subtasks", {
  ref: "Sub Task",
  localField: "_id",
  foreignField: "parent"
})

taskSchema.set("toObject", { virtuals: true, getters: true })
taskSchema.set("toJSON", {
  transform: (_, ret, __) => {
    delete ret.id
    return ret
  },
  virtuals: true,
  getters: true
})

const Task = mongoose.model("Task", taskSchema)
export default Task
