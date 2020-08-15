const express = require('express');
const routes = express.Router();
const user = require('./controllers/user');

//USERS
routes.get('/user', user.getAll);
routes.get('/user/:contador', user.getById);
routes.post('/user/login', user.login);



module.exports = routes;