const express = require('express');

const UserController = require('./controllers/UserController');
const ClientController = require('./controllers/ClientController')
const routes = express.Router();

//USERS
routes.get('/users', UserController.getAll);
routes.post('/users', UserController.new);
routes.post('/users/login', UserController.login);



//CLIENT
routes.get('/clients', ClientController.getAll);
routes.post('/clients', ClientController.new);
routes.post('/clients/batch-import', ClientController.batchImport);


module.exports = routes;
