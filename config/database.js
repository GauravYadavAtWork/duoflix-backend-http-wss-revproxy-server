import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DATABASEURL)
.then(()=>console.log("Connected to the Database"))
.catch(err=>console.log(err));

export default mongoose;