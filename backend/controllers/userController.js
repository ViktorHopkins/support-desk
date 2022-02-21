// userController makes userRoutes more clean by separating code

// Express async handler for mongoose which makes promise returns easier, found on: github.com/Abazhenov/express-async-handler
const asyncHandler = require('express-async-handler')

// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const {name, email, password} = req.body

    // Validation
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }

    res.send('Register Route')
})

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {


    res.send('Login Route')
})

module.exports = {
    registerUser,
    loginUser
}