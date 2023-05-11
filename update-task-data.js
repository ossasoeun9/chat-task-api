import connectDB from "./configs/db-config.js"
import Task from "./models/task-model.js"

connectDB()

const updateTaskData = async () => {
  try {
    console.log("Start update task data...")
    var result = await Task.updateMany(
      { message: undefined },
      { message: null }
    )
    console.log("Task updated...")
    console.log({ result })
  } catch (error) {
    console.log({ error })
  }
}

updateTaskData()
