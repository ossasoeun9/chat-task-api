import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
import User from "../models/user-model.js";

dotenv.config()

let user

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token)
    return res.status(401).json({
      message: "Unauthenticated"
    })

  if (token.includes('Bearer')) {
    token = token.replace('Bearer ', '')
  }

  try {
    const data = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_KEY);
    const user = await User.findById(data.user._id);
    req.user = JSON.parse(JSON.stringify(user));
    if (user.is_delete === true) {
      return res.status(401).json({
        message: "Unauthenticated"
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthenticated"
    });
  }
}

export { verifyToken, user }
