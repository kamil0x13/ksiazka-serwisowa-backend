const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    fields: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: String
        },
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
})

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment