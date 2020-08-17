const express = require('express');

const UserController = require('./controllers/UserController');

const routes = express.Router();

routes.get('/users', UserController.getAll);
routes.post('/users', UserController.new);

module.exports = routes;
