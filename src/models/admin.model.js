import {adminsModel} from '../schemas/adminSchema.js';
import {studentsModel} from '../schemas/studentSchema.js';
import {companiesModel} from '../schemas/compniesSchema.js';
import {registerModel} from '../schemas/registrationSchema.js';
export default class adminModel{
    
    static async addAdmin (content){
        try{
            const admin=await new adminsModel(content);
            const savedAdmin=await admin.save();
            if(savedAdmin)
                return savedAdmin;
        }
        catch(err){
            console.log('error occured at addAdmin method in admin.model.js');
            console.log(err);
        }
    }

    static async findAdmin(email){
        try{
            const result=await adminsModel.findOne({email:email});
            if(result)
                return result;
        }
        catch(err){
            console.log('error occured at findAdmin method in admin.model.js');
            console.log(err);
        }
    }

    static async getAllStudents(){
        try{
            const students=await studentsModel.find().sort({name:1});
            return students;
        }
        catch(err){
            console.log('error occured at getAllStudents method in admin.model.js');
            console.log(err);
        }
    }

    static async findStudent(email){
        try{
            const result=await studentsModel.findOne({email:email});
            if(result)
                return 1;
        }
        catch(err){
            console.log('error occured at findStudent method in admin.model.js');
            console.log(err);
        }
    }

    static async getStudentDetails(studId){
        try{
            const result=await studentsModel.findById(studId).populate({
                path:'registerations',
                populate:{
                    path:'companyId',
                }
            }).exec();
            if(result){
                return result;
            }
        }
        catch(err){
            console.log('error occured at getStudentDetails method in admin.model.js');
            console.log(err);
        }
    }

    static async addStudent(content){
        try{
            const student=await new studentsModel(content);
            const savedStudent=await student.save();
            if(savedStudent)
                return 1 
        }
        catch(err){
            console.log('error occured at addStudent method in admin.model.js');
            console.log(err);
        }
    }

    static async findCompany(name){
        try{
            const result=await companiesModel.findOne({name:name});
            if (result)
                return 1;
        }
        catch(err){
            console.log('error occured at findCompany method in admin.model.js');
            console.log(err);
        }
    }

    static async registerCompany(content){
        try{
            const company=new companiesModel(content);
            const savedCompany=await company.save();
            if(savedCompany)
                return savedCompany;
        }
        catch(err){
            console.log('error occured at registerCompany method in admin.model.js');
            console.log(err);
        }
    }

    static async getAllCompanies(){
        try{
            const companies=await companiesModel.find().sort({name:1});
            if(companies)
                return companies;
        }
        catch(err){
            console.log('error occured at getAllCompanies method in admin.model.js');
            console.log(err);
        }
    }

    static async getCompDetails(compId){
        try{
             const compDetails=await companiesModel.findById(compId).populate({
                path:'registerations',
                populate:{
                    path:'studentId'
                }
             });
             if(compDetails)
                return compDetails;
        }
        catch(err){
            console.log('error occured at getAllCompanies method in admin.model.js');
            console.log(err);
        }
    }

    static async registeredOrNot(studId,compId){
        try{
            const student=await studentsModel.findById(studId).populate('registerations');
            let found=0;
            student.registerations.forEach((registration)=>{
                if(registration.companyId==compId){
                    found=1;
                    return true;
                }
            })
            if(found)
                return true;
            else
                return false;
        }
        catch(err){
            console.log('error occured at registeredOrNot method in admin.model.js');
            console.log(err);
        }
    }

    static async scheduleIntrv(content){
        try{
            const registered=await new registerModel(content);
            const savedSchedule=await registered.save();
            if(savedSchedule)
                return savedSchedule._id;
        }
        catch(err){
            console.log('error occured at scheduleIntrv method in admin.model.js');
            console.log(err);
        }
    }

    static async addRegsitIdToStud(studId,registerdId){
        try{
            const student=await adminModel.getStudentDetails(studId);
            if(student){
                student.registerations.push(registerdId);
                await student.save();
                return true;
            }
            else
                return false;
        }
        catch(err){
            console.log('error occured at addRegsitIdToStud method in admin.model.js');
            console.log(err);
        }
    }

    static async addRegistIdToComp(compId,registerdId){
        try{
            const company=await companiesModel.findById(compId);
            if(company){
                company.registerations.push(registerdId);
                await company.save();
                return true;
            }
            else
                return false;
        }
        catch(err){
            console.log('error occured at addRegistIdToComp method in admin.model.js');
            console.log(err);
        }
    }

    static async updateStatus(content){
        try{
            const registration=await registerModel.findById(content.id);
            if(registration){
                registration.status=content.status;
                await registration.save();
                return true;
            }
        }
        catch(err){
            console.log('error occured at updateStatus method in admin.model.js');
            console.log(err);
        }
    }
}