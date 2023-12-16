const db = require('../database/models')
const createError = require('http-errors');


const getAllGenres = async () =>{
    try {
        const genres = await db.Genre.findAll();

        return {
            genres
        }
        
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            status : error.status || 500,
            error : error.message || 'Hubo un error'
        }) 
    }
};
const getGenreByPK = async(id) =>{
    try {
        if(!id){
            throw createError(400,'No existe id')
        }
        const genre = await db.Genre.findByPk(id);

        if(!genre){
            throw createError(404, ' La pelicula no existe')
        }
        return genre
        
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            status : error.status || 500,
            error : error.message || 'Hubo un error'
        }) 
    }
};

module.exports = {
    getAllGenres,
    getGenreByPK
}