import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {mongooseConnect} from './dbconfig/mongooseConnect.js';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import adminController from './src/contollers/admin.controller.js';
import {auth} from './src/middlewares/auth.middleware.js';
const server=express();
server.use(express.json());
server.use(ejsLayouts);
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
    secret: process.env.sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }));
server.set('view engine','ejs');
server.set('views',path.join(path.resolve(),'src','views'));

//routing
server.get('/',adminController.getLoginPage);
server.get('/register',adminController.getRegisterPage);
server.post('/register',adminController.postRegister);
server.post('/login',adminController.postLogin);
server.get('/logout',adminController.logout);
server.get('/admin',auth,adminController.getAdminPage);
server.get('/admin/addStudent',auth,adminController.addStudent);
server.post('/admin/addStudent',auth,adminController.postAddStudent);
server.get('/admin/studentDetails/download/:studId',auth,adminController.downloadStudData);
server.get('/admin/studentDetails/:studId',auth,adminController.getStudentDetails);
server.get('/admin/addCompany',auth,adminController.getcompanypage);
server.post('/admin/addcompany',auth,adminController.postAddCompany);
server.get('/admin/companies',auth,adminController.getAllCompanies);
server.put('/admin/compnies/updateStatus',auth,adminController.updateStatus);
server.get('/admin/companyDetails/download/:compId',auth,adminController.downloadcompData)
server.get('/admin/companies/:compId/details',auth,adminController.getCompDetails);
server.get('/admin/scheduleIntrv',auth,adminController.getSchedulePage);
server.post('/admin/scheduleIntrv',auth,adminController.postScheduleIntrv);
server.use(express.static(path.resolve('public')));





server.listen(3100,()=>{
    console.log('server is started listening from 3100 port');
    mongooseConnect();
})