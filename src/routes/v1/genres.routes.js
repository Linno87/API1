const express = require('express')
const { list, detail} = require('../../controllers/genresController')
const router = express.Router()


/* /api/v1/genres */

router.get("/", list)
      .get("/:id", detail)


module.exports = router