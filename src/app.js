const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const paginate  = require('express-paginate')


//Aquí pueden colocar las rutas de las APIs
const movieApiRoutes = require('./routes/v1/movies.routes')
const genreApiRoutes = require("./routes/v1/genres.routes")
// view engine setup
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../public')));

//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(paginate.middleware(8,50));

app.use('/api/v1/movies', movieApiRoutes),
app.use("/api/v1/genres", genreApiRoutes),

app.use('#',(req,res)=> res.status(404).json({
    ok: false,
    status: 404,
    msg: 'not found'
}))

//Activando el servidor desde express
app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
