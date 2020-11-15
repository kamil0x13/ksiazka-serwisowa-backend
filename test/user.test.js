const request = require('supertest')
const app = require('../src/app')
const User = require('../src/dbModels/user')
const { setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

//Create user return 201 and check user and token exists
test('Create user', async () => {
    const res = await request(app).post('/user').send({
        name: 'Marcin',
        lastName: 'Kowal',
        email: 'macrin@ex.com',
        password: 'marcin123'
    }).expect(201)

    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()
    expect(res.body.token).not.toBeNull()
})

//Create user and them logout
test('Create and logout user', async () => {
    const res = await request(app).post('/user').send({
        name: 'Marcin',
        lastName: 'Kowal',
        email: 'macrin@ex.com',
        password: 'marcin123'
    }).expect(201)

    await request(app).post('/user/logout')
        .set('Authorization', `Bearer ${res.body.token}`)
        .send()
        .expect(200)
})

//Create user and them logout and login back
test('Create logout and login', async () => {
    const { body } = await request(app).post('/user').send({
        name: 'Marcin',
        lastName: 'Kowal',
        email: 'macrin@ex.com',
        password: 'marcin123'
    }).expect(201)

    await request(app).post('/user/logout')
        .set('Authorization', `Bearer ${body.token}`)
        .send()
        .expect(200)

    await request(app).post('/user/login').send({
        email: 'macrin@ex.com',
        password: 'marcin123'
    }).expect(200)
})

//Create user and delete them
test('Create and delete', async () => {
    const { body } = await request(app).post('/user').send({
        name: 'Marcin',
        lastName: 'Kowal',
        email: 'macrin@ex.com',
        password: 'marcin123'
    }).expect(201)

    await request(app).delete('/user')
        .set('Authorization', `Bearer ${body.token}`)
        .send()
        .expect(200)

    const user = await User.findById(body.user._id)
    expect(user).toBeNull()
})