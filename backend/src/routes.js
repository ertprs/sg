const express = require('express');

const UserController = require('./controllers/UserController');
const CollectController = require('./controllers/CollectController');
const CompanyController = require('./controllers/CompanyController');
const ClientController = require('./controllers/ClientController');
const AttendanceController = require('./controllers/AttendanceController');
const BilletController = require('./controllers/BilletController');

const routes = express.Router();

//USERS
routes.get('/users', UserController.getAll);
routes.post('/users', UserController.newRegister);
routes.put('/users/:id', UserController.update);
routes.post('/users/login', UserController.login);

//COLETCTS
routes.get('/collects', CollectController.getAll);
routes.get('/collects/recalc', CollectController.recalc);
routes.get('/collects/close-by-client/:client/:attendance', CollectController.closeByClient);
routes.post('/collects', CollectController.newRegister);
routes.put('/collects/:id', CollectController.update);
routes.get('/collects/find-by-client/:client_id', CollectController.getByClient);
routes.get('/collects/find-by-attendance/:attendance_id', CollectController.getByAttendance);
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
routes.get('/clients/find-client/:find', ClientController.findClient);
routes.post('/clients', ClientController.newRegister);
routes.put('/clients/:id', ClientController.update);
routes.delete('/clients/:id', ClientController.deleteRegister);


//ATTENDENCE
routes.get('/attendances', AttendanceController.getAll);
routes.get('/attendances/get-by-id/:id', AttendanceController.getById);
routes.post('/attendances', AttendanceController.newRegister);
routes.put('/attendances/:id', AttendanceController.update);
routes.delete('/attendances/:id', AttendanceController.deleteRegister);
routes.get('/attendances/chart-actual-month', AttendanceController.chartActualMonth);


//BILLET
routes.get('/billets', BilletController.getAll);
routes.get('/billets/find-by-id/:id', BilletController.getById);
routes.get('/billets/find-by-attendance/:attendance_id', BilletController.getByAttendanceId);

routes.post('/billets', BilletController.newRegister);
routes.put('/billets/:id', BilletController.update);
routes.delete('/billets/:id', BilletController.deleteRegister);

module.exports = routes;
