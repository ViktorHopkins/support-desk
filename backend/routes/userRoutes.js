const express = require('express')
const router = express.Router()
// Import functions from userController
const { registerUser, loginUser } = require('../controllers/userController')

router.post('/', registerUser)

router.post('/login', loginUser)

module.exports = router