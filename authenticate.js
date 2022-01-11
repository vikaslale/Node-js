 const jwt = require('jsonwebtoken');
 require('dotenv').config();
  
const authenticate =(req,res,next)=>{
    const {authorization}= req.headers;
    if(authorization){
        const arr = authorization.split('');
        if(arr[0]=== "Bearer"){
            const token =arr[1];

            return jwt.verify(token, process.env.SECRE,(err,payload)=>{
   if(err) return res.sendStatus(401);
        
    req.user=payload;
    return next();
            });
        }
    }
        return res.sendStatus(401);
    
    };
module.exports =authenticate;