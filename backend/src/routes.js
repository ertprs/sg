const express = require('express');

const UserController = require('./controllers/UserController');

const routes = express.Router();

//USERS
routes.get('/users', UserController.getAll);
routes.post('/users', UserController.new);
routes.post('/users/login', UserController.login);

module.exports = routes;
