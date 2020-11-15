const User = require('../../src/dbModels/user')

const setupDatabase = async () => {
    await User.deleteMany()
}

module.exports = {
    setupDatabase
}