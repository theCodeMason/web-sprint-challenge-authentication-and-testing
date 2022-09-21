const { JWT_SECRET } = require("../secrets/index");
const {findBy} = require('../auth/users-model')
const jwt = require('jsonwebtoken')

const checkFields = (req, res, next) => {
  if(req.body.username == null || req.body.password == null){
    res.status(401).json({message: "username and password required"})
  }
  else{
    next()
  }
}
  
const restricted = (req, res, next) => {
    const token = req.headers.authorization;
    if(token == null){
      next({ status: 401, message: "token required"})
      return
    }
    
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if(err){
        console.log(err);
        next({status: 401, message: "token invalid"})
        return
      }
  
      req.decodedToken = decodedToken
      next()
    })
  }

  const checkUsernameAvailable = async (req, res, next) => {
    try {
      const [user] = await findBy({username: req.body.username})
      if(!user){
        req.user = user
        next()
      } else{
        next({status: 401, message: "username taken"})
      }
    } catch(err){
      next(err)
    }
  }

  const checkUsernameExists = async (req, res, next) => {
  try {
    const [user] = await findBy({username: req.body.username})
    if(!user){
      next({status: 401, message: "invalid credentials"})
    } else{
      req.user = user
      next()
    }
  } catch(err){
    next(err)
  }
  }
  /*
    IMPLEMENT
    1- On valid token in the Authorization header, call next.
    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".
    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
module.exports = {
  restricted,
  checkUsernameAvailable,
  checkFields,
  checkUsernameExists
}
