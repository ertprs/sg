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
routes.put('/collects/:id', CollectController.update);
routes.delete('/collects/:id', CollectController.deleteRegister);
routes.post('/collects/import-collect', CollectController.importCollect);

//COMPANIES
routes.get('/companies', CompanyController.getAll);
routes.get('/companies/find-by-id/:id', CompanyController.getById);
routes.get('/companies/find-by-name/:name', CompanyController.findByName);
routes.post('/companies', CompanyController.newRegister);
routes.put('/companies/:id', CompanyController.update);
routes.delete('/companies/:id', CompanyController.deleteRegister);


//CLIENT
routes.get('/clients', ClientController.getAll);
routes.get('/clients/find-by-id/:id', ClientController.getById);
routes.get('/clients/find-by-name/:name', ClientController.findByName);
routes.post('/clients', ClientController.newRegister);
routes.put('/clients/:id', ClientController.update);
routes.delete('/clients/:id', ClientController.deleteRegister);


module.exports = routes;
