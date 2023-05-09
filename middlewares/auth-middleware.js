import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
import User from "../models/user-model.js"
import RevokedToken from "../models/revoked_token.js"

dotenv.config()

let user

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"]

  if (!token)
    return res.status(401).json({
      message: "Unauthenticated",
    })

  if (token.includes("Bearer")) {
    token = token.replace("Bearer ", "")
  }

  var revokedToken = await RevokedToken.findOne({ access_token: token })
  console.log(revokedToken)

  if (revokedToken) {
    return res.status(401).json({
      message: "Unauthenticated",
    })
  }

  try {
    const data = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_KEY)
    const user = await User.findById(data.user._id)
    req.user = JSON.parse(JSON.stringify(user))

    // check user deleted account or not
    if (user.is_delete === true) {
      return res.status(401).json({
        message: "Unauthenticated",
      })
    }

    // check token exist in devices list or not, if not reject access

    // everything good, can access now
    next()
  } catch (err) {
    return res.status(401).json({
      message: "Unauthenticated",
    })
  }
}

export { verifyToken, user }
