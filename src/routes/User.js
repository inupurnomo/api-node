const express = require('express');
require("dotenv").config()

// swagger
const swaggerUi = require('swagger-ui-express')
const apiDoc = require('../apidocs/user.json')


const router = express.Router();

const userController = require('../controller/userController');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Users',
    version: '1.0',
    documentation: "/docs"
  })
})
router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiDoc))

router.get('/getAll', userController.accessValidation, userController.getAll)
router.get('/profile', userController.accessValidation, userController.profile)

router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/validateToken', userController.validateToken)

module.exports = router;