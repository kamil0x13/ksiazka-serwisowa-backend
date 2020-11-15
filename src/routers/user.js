const express = require('express')
const User = require('../dbModels/user')
const { auth } = require('../auth/auth')

const router = new express.Router()

//Creating user | body: json {name,lastName,eamil(unique, validator check that it it email),password(minlength: 7, can't include word: 'password')} | return {user(_id, name, lastName, email), token}
router.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Login user | body: json {email,password} | return {user(_id, name, lastName, email), token}
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Logout user | header Authorization ('Bearer token')
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Change user password | header Authorization ('Bearer token'), body: json {password}
router.patch('/user', auth, async (req, res) => {
    try {
        if (!req.body.password) {
            res.status(400).send()
        }
        req.user['password'] = req.body.password
        req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete user | header Authorization ('Bearer token')
router.delete('/user', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router