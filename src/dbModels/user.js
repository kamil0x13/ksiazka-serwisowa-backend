const { JWT_SECRET } = require('../../config/dev')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error('Nie poprawny email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(v) {
            if (v.toLowerCase().includes('password')) {
                throw new Error('Hasło nie może zawierać słowa "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})


//Tworzenie relacji
userSchema.virtual('equipment', {
    ref: 'Equipment',
    localField: '_id', //nazwa pola łączącego
    foreignField: 'owner' //nazwa pola z _id w task
})

//Dodaje nowy token do usera i zwraca go w wyniku
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

//Przekazywanie JSON bez hasła i tokenów nazwa funkcji działa jak toStrion z Javy >> poprostu po podaniu nazwy instancji (JSON.stringify(instancja))
userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//Metody statyczna dostępne są na obiektach (.statics)

//Szukanie usera po emailu
userSchema.statics.findByEmail = async (email) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Brak użytkownika w bazie!')
    }
    return user
}

//Sprawdzanie logowania
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Niepoprawne dane logowania!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Niepoprawne dane logowania!')
    }
    return user
}

//Hash hasło przed zapisaniem
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User