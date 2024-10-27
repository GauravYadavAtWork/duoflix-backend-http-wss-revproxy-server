// import express, { request } from "express";
// import proxyverification from '../../middlewares/proxyurls.middleware.js';
// import dotenv from 'dotenv';
// dotenv.config();
// import https from 'https';
// const router = express.Router();

// router.get('/stream/:id', proxyverification ,async(req,res)=>{
//     try{
//         const videoUrl = `${process.env.CDN_URL}/${req.params.id}`;
//         https.get(videoUrl, (proxyRes) => {
//             if (proxyRes.statusCode === 200) {
//                 res.set('Content-Type', 'video/mp4');
//                 proxyRes.pipe(res);
//             } else {
//                 res.status(proxyRes.statusCode).send(proxyRes.statusMessage);
//             }
//         }).on('error', (error) => {
//             console.error('Error fetching video:', error);
//             res.status(500).send('Internal Server Error');
//         });
//     }catch(err){
//         console.log(err);
//         res.status(500).json(err);
//     }
// });

// export default router;





import express from "express";
import proxyverification from '../../middlewares/proxyurls.middleware.js';
import dotenv from 'dotenv';
import https from 'https';
dotenv.config();

const router = express.Router();

router.get('/stream/:id', proxyverification, async (req, res) => {
    try {
        const videoUrl = `${process.env.CDN_URL}/${req.params.id}`;

        // Get the Range header from the request
        const range = req.headers.range;
        if (!range) {
            return res.status(400).send('Requires Range header');
        }

        // Parse the range header (e.g., "bytes=123456-")
        const byteRange = range.replace(/bytes=/, "").split("-");
        const start = parseInt(byteRange[0], 10);
        const end = byteRange[1] ? parseInt(byteRange[1], 10) : undefined;

        // Make an HTTPS request to the CDN with the correct Range header
        const options = {
            headers: {
                'Range': range
            }
        };

        https.get(videoUrl, options, (proxyRes) => {
            if (proxyRes.statusCode === 206) {  // Partial content status
                const contentRange = proxyRes.headers['content-range'];
                const contentLength = proxyRes.headers['content-length'];
                const contentType = proxyRes.headers['content-type'];

                // Send appropriate headers for partial content
                res.writeHead(206, {
                    'Content-Range': contentRange,
                    'Content-Length': contentLength,
                    'Content-Type': contentType
                });

                // Pipe the video stream
                proxyRes.pipe(res);
            } else {
                res.status(proxyRes.statusCode).send(proxyRes.statusMessage);
            }
        }).on('error', (error) => {
            console.error('Error fetching video:', error);
            res.status(500).send('Internal Server Error');
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

export default router;
