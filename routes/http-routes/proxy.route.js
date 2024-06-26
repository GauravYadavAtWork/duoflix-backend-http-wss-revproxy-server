import express, { request } from "express";
import proxyverification from '../../middlewares/proxyurls.middleware.js';
import https from 'https';
const router = express.Router();

router.get('/stream/:id', proxyverification ,async(req,res)=>{
    try{
        const videoUrl = `https://d1xn08gdn1krvd.cloudfront.net/${req.params.id}`;
        https.get(videoUrl, (proxyRes) => {
            if (proxyRes.statusCode === 200) {
            // Set the content type of the response
            res.set('Content-Type', 'video/mp4');
            
            // Pipe the response from the proxy request to the client response
            proxyRes.pipe(res);
            } else {
            res.status(proxyRes.statusCode).send(proxyRes.statusMessage);
            }
        }).on('error', (error) => {
            console.error('Error fetching video:', error);
            res.status(500).send('Internal Server Error');
        });
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

export default router;