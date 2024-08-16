const express = require('express')
const router = express.Router()

// swagger
const swaggerUi = require('swagger-ui-express')
const apiDoc = require('../apidocs/area.json')

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API IDN-AREA',
    version: '1.0',
    documentation: "/docs"
  })
})
router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiDoc))

module.exports = router;