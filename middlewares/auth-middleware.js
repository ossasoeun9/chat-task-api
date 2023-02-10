import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"

dotenv.config()

let user

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]

  if (!token)
    return res.status(401).json({
      message: "Unauthenticated"
    })

  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_KEY, (err, data) => {
    if (err)
      return res.status(401).json({
        message: "Unauthenticated"
      })

    user = data.user
    req.user = data.user
  })

  return next()
}

export { verifyToken, user }
