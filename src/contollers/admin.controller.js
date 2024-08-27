import adminModel from "../models/admin.model.js";
import bcrypt from 'bcrypt';
import ejs from 'ejs';
import path from 'path';
import puppeteer from "puppeteer";

export default class adminController{

    static async getLoginPage(req,res,next){
        return res.status(200).render('login');
    }

    static async getRegisterPage(req,res,next){
        return res.status(200).render('register');
    }

    static async postRegister(req,res,next){
        const {name,email,password}=req.body;
        const hashPassword=await bcrypt.hash(password,12);
        const savedUser=await adminModel.addAdmin({name:name,email:email,password:hashPassword});
        if(savedUser)
            return res.status(200).render('login');
        else
            return res.status(400).render('register',{errorMessage:'user with this mailid allready existed try login or try register with another email'})
    }

    static async postLogin(req,res,next){
        const {email,password}=req.body;
        const adminFound=await adminModel.findAdmin(email);
        if(adminFound){
            const validadmin=await bcrypt.compare(password,adminFound.password);
            if(validadmin){
                req.session.adminEmail=adminFound.email;
                res.cookie('adminName',adminFound.name);
                res.cookie('adminId',adminFound._id);
                return res.status(200).redirect('/admin');
            }
            else
             return res.status(400).render('login',{errorMessage:'incorrect password'});
        }
        else{
            return res.status(404).render('login',{errorMessage:'employee with this mail is not found'});
        }
        
    }

    static async getAdminPage(req,res,next){
        const students=await adminModel.getAllStudents();
        if(students.length>0)
            return res.status(200).render('studentList',{userName:req.cookies.adminName,students:students});
        else
            return res.status(200).render('studentList',{userName:req.cookies.adminName});
    }

    static async addStudent(req,res,next){
        return res.status(200).render('addStudent',{userName:req.cookies.adminName});
    }

    static async postAddStudent(req,res,next){
        const {name,email,college,batch,dsaScore,webDScore,reactScore}=req.body;
        const foundStud=await adminModel.findStudent(email);
        if(foundStud)
            return res.render('addStudent',{errorMessage:'sutdent with this mailid is allredy existed'});
        else{
            const addedStudent=await adminModel.addStudent({name,email,college,batch,dsaScore,webDScore,reactScore});
            if(addedStudent)
                return res.redirect('/admin');
            else
                return res.send(`
                    <!DOCTYPE html>
                    <html>
                        <body>
                            <h2>some error occurd at server side</h2>
                            </h3>click here-><a href="/admin">redirect to admin page</a></h3>
                        </body>
                    </html>
            `);
        }
    }

    static async getStudentDetails(req,res,next){
        const studId=req.params.studId;
        const studDetails=await adminModel.getStudentDetails(studId);
        if(studDetails)
            return res.status(200).render('studentDetails',{studDetails:studDetails,userName:req.cookies.adminName})
        else
            return res.status(404).render('studentDetails',{userName:req.cookies.adminName});
    }

    static async getcompanypage(req,res,next){
        return res.status(200).render('addCompany',{userName:req.cookies.adminName});
    }

    static async postAddCompany(req,res,next){
        const {name,jd,aplDeadLine}=req.body;
        if(new Date(aplDeadLine)< new Date())
            return res.render('addCompany',{userName:req.cookies.adminName,errorMessage:'the expired deadline companies or not accepted'});
        else{
            const existed=await adminModel.findCompany(name);
            if(existed)
                return res.status(409).render('addCompany',{userName:req.cookies.adminName,errorMessage:'a company with this name allready registered'});
            else{
                const savedCompany=await adminModel.registerCompany({name,jd,aplDeadLine});
                if(savedCompany)
                    return res.status(200).redirect('/admin/companies');
            }
        }
    }

    static async getAllCompanies(req,res,next){
        const companies=await adminModel.getAllCompanies();
        if(companies){
            if(companies.length>0)
                return res.status(200).render('companiesList',{companies:companies,userName:req.cookies.adminName});
            else
                return res.status(200).render('companiesList',{userName:req.cookies.adminName});
        }
        else
            return res.status(400).send('some error occured at the server side please try again');
    }

    static async getCompDetails(req,res,next){
        const compId=req.params.compId;
        const compDetails=await adminModel.getCompDetails(compId);
        if(compDetails){
           return res.status(200).render('companyDetails',{compDetails:compDetails,userName:req.cookies.adminName});
        }
        else
            return res.status(200).render('companyDetails',{userName:req.cookies.adminName});
    }

    static async getSchedulePage(req,res,next){
        const companies=await adminModel.getAllCompanies();
        const students=await adminModel.getAllStudents();
        if(req.query.compId && req.query.compName){
            let compId=req.query.compId;
            let compName=req.query.compName;
            return res.status(200).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,specific:{compId,compName}}); 
        }
        return res.status(200).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students});

    }

    static async postScheduleIntrv(req,res,next){
        const {student,company,status,interviewDate}=req.body;
        const companies=await adminModel.getAllCompanies();
        const students=await adminModel.getAllStudents();
        switch(true){
            case student=="select student":
                return res.status(400).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:"you have to select the student"});
            case student=="no students":
                return res.status(400).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:"as of now no student registered for placement, so add student then schedule"});
            case company=="select company":
                return res.status(400).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:"you have to select the company"});
            case company=="no companies":
                return res.status(400).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:"as of now no company is registed for recuritment so first add the company then schedule"});
            case status=="select status":
                return res.status(400).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:"you have to select status of the student"});
            case interviewDate=="":
                return res.status(400).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:"you have to select the date"});
            case new Date(interviewDate).toISOString().split('T')[0]< new Date().toISOString().split('T')[0]:
                return res.status(400).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:`the date should not be before the ${new Date().toISOString().split('T')[0]}`});       
        }
        //checking weather the student allready registerd to the same company or not
            const registered=await adminModel.registeredOrNot(student,company);
            if(registered){
                return res.status(209).render('invSchedulePage',{userName:req.cookies.adminName,companies:companies,students:students,errorMessage:"student allready registerd to the selected company"});
            }
        // create a registration schema document with student id ,company id ,schedule date and status
            const scheduledIntrvId=await adminModel.scheduleIntrv({studentId:student,companyId:company,status:status,scheduledDate:interviewDate});
            let done=1;
            if(scheduledIntrvId){
                //add registration id to company schema
                    const addedIdToStud=await adminModel.addRegsitIdToStud(student,scheduledIntrvId);
                // add registration id to student schema
                    const addedIdToComp=await adminModel.addRegistIdToComp(company,scheduledIntrvId);
                if(addedIdToStud && addedIdToComp){
                    done=0
                    // alert('interview scheduled sucessfully');
                    return res.status(200).send(`<!DOCTYPE html>
                    <html>
                        <body>
                            <h2>interview schedule created sucessfully</h2>
                            </h3>click here to redirect to:-> <a href="/admin/scheduleIntrv">admin page</a></h3>
                        </body>
                    </html>`);
                }
            }
            if(done){
                return res.status(404).send(`<!DOCTYPE html>
                    <html>
                        <body>
                            <h2>some error occured while scheduling interview please check your details and try again</h2>
                            </h3>click here to redirect to:-> <a href="/admin/scheduleIntrv">admin page</a></h3>
                        </body>
                    </html>`)
            }
    }

    static async updateStatus(req,res,next){
        const {status,id}=req.body;
        const updated=adminModel.updateStatus({status,id});
        if(updated){
            return res.status(200).send({content:'hero'});
        }
        else{
            return res.status(404).send('unsucessfull');
        }
    }

    static async downloadStudData(req,res,next){
        const studId=req.params.studId;
        const studDetails=await adminModel.getStudentDetails(studId);
        if(studDetails){
            try {
                // Render the EJS template to HTML
                const html = await ejs.renderFile(path.join(path.resolve(),'src','views','studentDetails.ejs'),{studDetails:studDetails,download:true});

                // Launch a headless browser using Puppeteer
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                // Set the HTML content
                await page.setContent(html, { waitUntil: 'networkidle0'});
                await page.setViewport({width:1680,height:1050});
                // Generate the PDF
                const pdf = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    orientation:'portrait',
                    border:'3mm',
                });

                // Close the browser
                await browser.close();

                // Set the response headers to indicate a file download
                res.setHeader('Content-Disposition', `attachment; filename=${studDetails.email.split('.')[0]}.pdf`);
                res.setHeader('Content-Type', 'application/pdf');

                // Send the PDF to the client
                res.send(pdf);
            } 
            catch (err) {
                console.error('Error generating PDF:', err);
                res.status(500).send('Internal Server Error');
            }
        }
        else{
            return res.status(500).send('some error occured at server side please try again');
        }
    }

    static async logout(req,res,next){
        req.session.destroy((err) => {
            if (err) {
              res.send('error occured while destroying the session');
            } else {
              res.redirect('/');
            }
          });
          res.clearCookie('adminName');
    }
}