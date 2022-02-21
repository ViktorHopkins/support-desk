// userController makes userRoutes more clean by separating code

// Express async handler for mongoose which makes promise returns easier, found on: github.com/Abazhenov/express-async-handler
const asyncHandler = require('express-async-handler')

// For encrypting passwords
const bcrypt = require('bcryptjs')

// Jsonwebtoken for users cookies
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const { restart } = require('nodemon')

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

    // Find if user already exists
    const userExits = await User.findOne({email})

    if (userExits) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new error('Invalid user data')
    }
})

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    // Check user and passwords match
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // Retrieves full user info
    //res.status(200).json(req.user)
    
    // Retrieves only id, email and name
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
    }
    
    res.status(200).json(user)
})

// Generate token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}