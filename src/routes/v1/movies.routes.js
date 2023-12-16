const express = require('express')
const { list, detail , create, update, destroy} = require('../../controllers/moviesController')
const router = express.Router()

router.get('/', list)
      .get('/:id', detail)  
      .post('/',create)
      .put('/:id', update)
      .delete('/:id', destroy)
module.exports = router