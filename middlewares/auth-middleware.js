
import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'

dotenv.config()

const verifyToken = (req, res, next) => {
   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split(' ')[1]
   
   if (!token) return res.status(401).json({
      message: "Unauthenecated"
   })

   jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
      if (err) return res.status(401).json({
         message: "Unauthenecated"
      })

      return res.send(user)

      req.user = user
   })

   return next();
};

export default verifyToken