const db = require("../database/models");
const { getAllGenres, getGenreByPK } = require("../services/genres.services");
const sequelize = db.sequelize;

const genresController = {
  list: async (req, res) => {
    try {
        const {genres} = await getAllGenres();

        return res.status(200).json({
            ok: true, 
            data: genres
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
        const genre= await getGenreByPK(req.params.id);

        return res.status(200).json({
            ok: true, 
            data: genre
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            status : error.status || 500,
            error : error.message || 'Hubo un error'
        }) 
    }
  }
};

module.exports = genresController;
