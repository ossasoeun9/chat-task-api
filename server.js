import express from "express"
import dotenv from "dotenv"

import connectDB from "./configs/db-config.js"
import verifyToken from "./middlewares/auth-middleware.js"
import phoneCodeRoute from "./routes/country-route.js"
import userRoute from "./routes/user-route.js"
import authRoute from "./routes/auth-route.js"

dotenv.config()
connectDB()

const app = express()
app.use(express.json())

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
