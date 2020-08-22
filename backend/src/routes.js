const express = require('express');

const UserController = require('./controllers/UserController');
const CollectController = require('./controllers/CollectController');
const CompanyController = require('./controllers/CompanyController');

const routes = express.Router();

//USERS
routes.get('/users', UserController.getAll);
routes.post('/users', UserController.new);
routes.post('/users/login', UserController.login);

//COLETCTS
routes.get('/collects', CollectController.getAll);
routes.post('/collects', CollectController.new);

//COMPANIES
routes.get('/companies', CompanyController.getAll);
routes.post('/companies', CompanyController.new);

//CLIENT
routes.get('/clients', CollectController.getAll);
routes.post('/clients', CollectController.new);


module.exports = routes;
