import express from "express";
const router = express.Router();
import Movie from '../../models/movies.models.js';

router.get('/fetch-movie-list',async(req,res)=>{
    try{
        const movieslist = await Movie.find();
        res.status(200).json(movieslist);
    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/fetch-movie-metadata/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const metadata = await Movie.findOne({_id:id});
        res.status(200).json(metadata);
    }catch(err){
        res.status(500).json(err);
    }
});

export default router;