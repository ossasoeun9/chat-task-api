import mongoose from "mongoose"

const subTaskSchema = mongoose.Schema(
  {
    label: { type: String, requried: true },
    parent: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Task",
      select: false
    },
    is_completed: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const SubTask = mongoose.model("Sub Task", subTaskSchema)
export default SubTask
