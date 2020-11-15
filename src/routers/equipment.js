const express = require('express')
const Equipment = require('../dbModels/equipment')
const { auth } = require('../auth/auth')
const User = require('../dbModels/user')
const router = new express.Router()

//Creating equipment | body: json {name, *fields}, header: Authorization
router.post('/equipment', auth, async (req, res) => {
    const equipment = new Equipment({
        ...req.body,
        owner: req.user._id
    })

    try {
        await equipment.save()
        res.status(201).send(equipment)
    } catch (e) {
        res.status(400).send()
    }
})

//Get all equipment | header: Authorization, return (equipment(_id, name, owner, fields))
router.get('/equipment', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'equipment'
        }).execPopulate()
        res.send(req.user.equipment)
    } catch (e) {
        res.status(500).send()
    }
})

//Update own req.body.equipmentId
router.patch('/equipment', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'equipment'
        }).execPopulate()
        const equipment = req.user.equipment.find((eq) => {
            if (eq._id == req.body.equipmentId) {
                return true
            }
        })
        if (!equipment) {
            res.status(404).send()
        }
        if (req.body.name) {
            equipment.name = req.body.name
        }

        if (req.body.fields) {
            equipment.fields = req.body.fields
        }

        equipment.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    }
})

//Remove own req.body.equipmentId
router.delete('/equipment', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'equipment'
        }).execPopulate()
        const equipment = req.user.equipment.find((eq) => {
            if (eq._id == req.body.equipmentId) {
                return true
            }
        })
        if (!equipment) {
            res.status(404).send()
        }
        await equipment.remove()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router