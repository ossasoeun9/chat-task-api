import express from "express"
import dotenv from "dotenv"
import session from "express-session"

import connectDB from "./configs/db-config.js"
import verifyToken from "./middlewares/auth-middleware.js"
import initializeFirbaseApp from "./configs/firebase-config.js"
import phoneCodeRoute from "./routes/country-route.js"
import userRoute from "./routes/user-route.js"
import authRoute from "./routes/auth-route.js"

dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.use(session({
  secret: '123456',
  cookie: {
    maxAge: 90000,
  },
  saveUninitialized: true,
  resave: false,
}))

app.use('/auth', authRoute)

app.use(verifyToken);

const port = process.env.PORT || 3000;

app.use("/country", phoneCodeRoute);
app.use("/users", userRoute)


app.listen(port, () => {
  console.log(`ChatTask app listening on port ${port}!`);
});
