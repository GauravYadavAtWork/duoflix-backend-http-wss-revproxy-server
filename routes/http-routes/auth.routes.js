import express from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// user route is present in auth server
// admin auth is here
router.post('/admin/login', async (req,res)=>{
    try{
        console.log("request for admin logging");
        const username = req.body.adminusername;
        const password = req.body.adminpassword;
        
        const adminUser = process.env.ADMINUSERNAME;
        const adminPass = process.env.ADMINPASSWORD;
        
        if((username==adminUser) && (password==adminPass)){
            const token = await jwt.sign({admin:'IAMADMIN'},process.env.ADMINJWTSECRETKEY);
            res.status(200).json({authToken:token});
        }else {
            res.status(403).json({auth:'Invalid Username or Password'});
        }
    }catch(err){
        res.status(500).json(err);
    }
});

export default router;