// server.js 
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors({
    methods:['GET','POST','PUT','DELETE'],
    origin:'*'
}));

const port = process.env.PORT || 8080;
const httpServer = app.listen(port,()=>console.log(`WebSocket server is running on ws://localhost:${port}`));

export {app,httpServer};
