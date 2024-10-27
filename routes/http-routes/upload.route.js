import express from "express";
import Movie from '../../models/movies.models.js';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const s3client = new S3Client({
    region:'ap-south-1',
    credentials:{
        accessKeyId:process.env.ACCESSKEY,
        secretAccessKey:process.env.SECRETKEY
    }
});

async function getObjectURL(key){   // generating presigned urls to retrive items from the bucket
    const command = new GetObjectCommand({
        Bucket:'duoflixmoviestore',
        Key:key
    });
    const url = getSignedUrl(s3client,command);
    return url;
};

async function putObjectURL(key,contentType){   // generating presigned urls to put items to the bucket
    const command = new PutObjectCommand({
        Bucket:'duoflixmoviestore',
        Key:key,
        ContentType:contentType
    });
    const url = getSignedUrl(s3client,command);
    return url;
};


// router.get('/getpresignedurl-retrive/:key',async(req,res)=>{
//     try{
//         console.log(req.params.key);
//         const signedUrl = await getObjectURL(req.params.key);
//         res.status(200).json({url:signedUrl});
//     }catch(err){
//         res.status(500).json(err);
//     }
// });


// router.get('/getpresignedurl-upload/:key',async(req,res)=>{
//     try{
//         console.log(req.params.key);
//         const signedUrl = await putObjectURL(req.params.key,'video/*');
//         res.status(200).json({url:signedUrl});
//     }catch(err){
//         res.status(500).json(err);
//     }
// });


router.post('/upload-presigned-url',async (req,res)=>{
    try{
        const filename = req.body.filename;
        const filetype = req.body.filetype;
        const description = req.body.description;
        const bannerlink = req.body.bannerlink;
        const newmovie = new Movie({
            name:filename,
            description:description,
            poster_url:bannerlink
        });
        const data = await newmovie.save();
        console.log("Generated Presigned link for ",data.name);
        const key = String(data._id);
        const url = await putObjectURL(key,filetype);
        res.status(200).json({url:url});
    }catch(err){
        res.status(500).json(err);
    }   
}) ;


export default router;