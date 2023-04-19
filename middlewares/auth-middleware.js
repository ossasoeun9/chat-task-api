import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
import User from "../models/user-model.js";

dotenv.config()

let user

const verifyToken = (req, res, next) => {
  var token = req.headers["authorization"]

  if (!token)
    return res.status(401).json({
      message: "Unauthenticated"
    })

  if (token.includes('Bearer')) {
    token = token.replace('Bearer ', '')
  }

  return jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, data) => {
    if (err)
      return res.status(401).json({
        message: "Unauthenticated"
      })

    // check token when user deleted account
    user = await User.findById(data.user._id);
    req.user = user
    if (user.is_delete === true) {
      return res.status(401).json({
        message: "Unauthenticated"
      })
    } else {
      return next()
    }

  })
}

export { verifyToken, user }
