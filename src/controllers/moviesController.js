const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../services/movies.services');
const { count } = require('console');
const paginate = require('express-paginate')
const createError = require('http-errors')



//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: async (req, res) => {
        try {
            const {movies, total} = await getAllMovies(req.query.limit, req.skip);
            const pagesCount = Math.ceil(total/req.query.limit) 
            const currentPage = req.query.page;
            const pages = paginate.getArrayPages(req)(pagesCount,pagesCount,currentPage)

            return res.status(200).json({
                ok: true,
                meta : {
                    total,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                    pagesCount, 
                    currentPage,
                    pages
                },
                data: movies
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status : error.status || 500,
                error : error.message || 'Hubo un error'
            })
        }
       
    },
    detail: async (req, res) => {
        try {
            const movie= await getMovieById(req.params.id);

            return res.status(200).json({
                ok: true,
                data : movie
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status : error.status || 500,
                error : error.message || 'Hubo un error'
            })
        }},
   new: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    recomended: (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
        .catch(error => res.send(error))
    },
    create: async (req,res)=> {
       try {
            const {title, release_date,awards,rating,length,genre_id,actors} = req.body;

           if([title, release_date, awards, rating].includes(''|| undefined)){
                throw createError(400, 'Los campos title, release_date, awards, rating son obligatorios')
           }

         const newMovie = await createMovie({
            title,
            release_date,
            awards, 
            rating,
            length,
            genre_id
         },actors)
         
         return res.status(200).json({
            ok: true,
            data : 'Pelicula creada con éxito',
            url: `${req.protocol}://${req.get(`host`)}/api/v1/movies/${newMovie.id}`
        })
     } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            status : error.status || 500,
            error : error.message || 'Hubo un error'
        })
    }},
   
    update: async(req,res) => {
        try {
            


            const movie = updateMovie(req.params.id,req.body);

            return res.status(200).json({
                ok: true,
                msg : 'Pelicula updateada con éxito',
                
                url: `${req.protocol}://${req.get(`host`)}/api/v1/movies/${movie.id}`
            })

     } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            status : error.status || 500,
            error : error.message || 'Hubo un error'
        })
    }},
    
    destroy: async (req,res)=> {
        try {
            await deleteMovie(req.params.id)

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status : error.status || 500,
                error : error.message || 'Hubo un error'
            })
        }
    }
}

module.exports = moviesController;