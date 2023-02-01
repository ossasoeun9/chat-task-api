import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
mongoose.set("strictQuery", true)

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`Unable to connect to Database: ${error}`)
  }
}

// mongoose.connection.on("error", console.error.bind(console, 'connection error:'))

export default connectDB
