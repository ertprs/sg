const express = require('express');

const UserController = require('./controllers/UserController');
const CollectController = require('./controllers/CollectController');
const CompanyController = require('./controllers/CompanyController');
const ClientController = require('./controllers/ClientController');
const AttendanceController = require('./controllers/AttendanceController');


const routes = express.Router();

//USERS
routes.get('/users', UserController.getAll);
routes.post('/users', UserController.newRegister);
routes.post('/users/login', UserController.login);

//COLETCTS
routes.get('/collects', CollectController.getAll);
routes.get('/collects/recalc', CollectController.recalc);
routes.get('/collects/close-by-client/:clientId', CollectController.closeByClient);
routes.post('/collects', CollectController.newRegister);
routes.put('/collects/:id', CollectController.update);
routes.get('/collects/find-by-client/:client_id', CollectController.getByClient);
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


//ATTENDENCE
routes.get('/attendances', AttendanceController.getAll);
routes.post('/attendances', AttendanceController.newRegister);
routes.put('/attendances/:id', AttendanceController.update);
routes.delete('/attendances/:id', AttendanceController.deleteRegister);


module.exports = routes;
