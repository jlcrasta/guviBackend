const express = require('express')
const CreateUser = require('../Models/createUser')
const jwt = require('jsonwebtoken')
const router = express.Router();
const UserDetails = require('../Models/UserDetails')
const bcrypt = require('bcrypt')


function AuthenticateToken(req, res, next) {//middleware
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]//to get only token
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    })
}


router.post('/', async (req, res) => {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 12)

        const isUser = await CreateUser.findOne({ name: req.body.name })
        const isEmail = await CreateUser.findOne({ email: req.body.email })
        if (!isUser && !isEmail) {
            const newUser = new CreateUser({
                name: req.body.name,
                email: req.body.email,
                password: hashedPwd
            })
            await newUser.save();
            res.status(200).json(newUser)
        }
        else {
            res.status(200).json({ message: "username or email exists" })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})

router.post('/login', async (req, res) => {
    try {
        const foundUser = await CreateUser.findOne({
            name: req.body.name
        })

        if (foundUser) {
            const isUser = await bcrypt.compare(req.body.password, foundUser.password);
            if (isUser) {
                const user = foundUser.name;
                const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN)
                res.status(200).json({ name: user, accessToken: accessToken })
            } else {
                res.status(404).json('Worng credentials')
            }
        } else {
            res.status(404).json('User Not Found')
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }

})

router.get('/getDetails', AuthenticateToken, async (req, res) => {
    const userDetails = await UserDetails.findOne({ user: req.user })
    if (userDetails === null) {
        res.status(403).json({ message: "user details not found" })
    }
    else {
        res.status(200).json({ userDetails })
    }
})

router.post('/userDetails', AuthenticateToken, async (req, res) => {
    try {
        const userDetails = new UserDetails({
            user: req.user,
            age: req.body.age,
            gender: req.body.gender,
            DOB: req.body.DOB,
            mobile: req.body.mobile
        })

        userDetails.save()
        res.status(200).json({ userDetails })

    } catch (err) {
        res.status(400).json({ message: res.message })
    }
})


router.patch('/updateDetails', AuthenticateToken, async (req, res) => {
    try {
        const updateDetails = await UserDetails.findOneAndUpdate({ user: req.user }, {
            age: req.body.age,
            gender: req.body.gender,
            DOB: req.body.DOB,
            mobile: req.body.mobile
        }, { new: true })

        res.status(200).json({ updateDetails })

    } catch (err) {
        res.status(400), json({ message: res.message })
    }

})

router.get('/logout', AuthenticateToken, (req, res) => {
    try {

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})


module.exports = router;
