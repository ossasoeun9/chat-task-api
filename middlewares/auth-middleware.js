import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"

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

  return jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_KEY, (err, data) => {
    if (err)
      return res.status(401).json({
        message: "Unauthenticated"
      })

    user = data.user
    req.user = data.user
    return next()
  })
}

export { verifyToken, user }
