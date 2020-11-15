const { MONGODB_URL } = require('../../config/dev')
const mongosse = require('mongoose')

mongosse.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})