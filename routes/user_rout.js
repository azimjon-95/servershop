const { Router } = require('express');
const {
    GetUser,
    SignUp,
    Login,
    Logout,
    deleteUser,
    Update,
    GetById,
    GetByGoogleId,
} = require('../controller/user_control')

const user = Router();

user.post('/signup', SignUp)

user.post('/login', Login)

user.get('/logout', Logout)

user.get('/users', GetUser)

user.get('/users/:id', GetById)

user.get('/users/google/:googleId', GetByGoogleId)

user.put('/update/:id', Update)

user.delete('/delete/:id', deleteUser)

module.exports = user;