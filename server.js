import express from "express"
import dotenv from "dotenv"
import formData from "express-form-data"
import os from "os"

import connectDB from "./configs/db-config.js"
import verifyToken from "./middlewares/auth-middleware.js"
import phoneCodeRoute from "./routes/country-route.js"
import userRoute from "./routes/user-route.js"
import authRoute from "./routes/auth-route.js"
import createDir from "./configs/dir-config.js"

dotenv.config()
connectDB()
createDir()

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

const app = express()

app.use(express.json())
app.use(formData.parse(options))
app.use('/user-profile', express.static('storage/user-profile'))

// Public route
app.use("/country", phoneCodeRoute);
app.use('/auth', authRoute)

// Protected route
app.use(verifyToken);
app.use("/users", userRoute)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`ChatTask app listening on port ${port}!`);
});
