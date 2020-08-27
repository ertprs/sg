const express = require('express');

const UserController = require('./controllers/UserController');
const CollectController = require('./controllers/CollectController');
const CompanyController = require('./controllers/CompanyController');
const ClientController = require('./controllers/ClientController');


const routes = express.Router();

//USERS
routes.get('/users', UserController.getAll);
routes.post('/users', UserController.newRegister);
routes.post('/users/login', UserController.login);

//COLETCTS
routes.get('/collects', CollectController.getAll);
routes.post('/collects', CollectController.newRegister);
routes.post('/collects/importCollect', CollectController.importCollect);

//COMPANIES
routes.get('/companies', CompanyController.getAll);
routes.post('/companies', CompanyController.newRegister);
routes.put('/companies/:id', CompanyController.update);
routes.delete('/companies/:id', CompanyController.deleteRegister);


//CLIENT
routes.get('/clients', ClientController.getAll);
routes.post('/clients', ClientController.newRegister);


module.exports = routes;
