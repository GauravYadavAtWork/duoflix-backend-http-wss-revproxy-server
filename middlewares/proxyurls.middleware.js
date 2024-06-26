import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const proxyverification = (req,res,next)=>{
    const token = req.query.token;

    console.log("hehe");
    if(!token) return res.status(400).json({message:'Authentication Token Missing, Please Send the Token as authToken Header'});
    jwt.verify(token,process.env.USERJWTSECRETKEY,(err,decoded)=>{
        if(err) res.status(401).json({message:'Invalid Token'});
        else{
            req.user = decoded;
            next();
        }
    });
};

export default proxyverification;