import mongoose from '../config/database.js';

const movieSchema = new mongoose.Schema({
    name:String,
    description:String,
    poster_url:String
});

const Movie = new mongoose.model('movies',movieSchema);

export default Movie;