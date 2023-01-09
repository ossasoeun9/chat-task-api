
import dotenv from 'dotenv'

dotenv.config()

const verifyToken = (req, res, next) => {
   console.log(req.url)
   return next();
};

export default verifyToken