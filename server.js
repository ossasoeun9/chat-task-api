import express from "express"
import dotenv from "dotenv"
import connectDB from "./configs/db-config.js"
import verifyToken from "./middlewares/auth-middleware.js"
import phoneCodeRoute from "./routes/country-route.js"
import userRoute from "./routes/user-route.js"

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(verifyToken);

const port = process.env.PORT || 3000;

app.use("/country", phoneCodeRoute);
app.use("/users", userRoute)

app.listen(port, () => {
  console.log(`ChatTask app listening on port ${port}!`);
});
