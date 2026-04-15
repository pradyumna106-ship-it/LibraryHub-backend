import { Admin } from "../models/admin.model.js";
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { validateAllFields } from "../utils/validate.js";

async function addAdmin(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
                return res.status(400).json(missingField(missingFields));
        }
        const admin = await Admin.create(req.body)
        res.status(201).json({
            message:"Admin Added Successfully", admin
        })
    } catch (error) {
        InternalServerError(error,res);
    }
}

async function updateAdmin(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
                if (!isValid) {
                    return res.status(400).json(missingField(missingFields));
                }
        const admin = await Admin.findByIdAndUpdate(req.params.id,req.body,{new: true})
        if (!admin) return notFoundInDatabase(res, "Admin");
        res.status(200).json({
            message:"Admin Updated Successfully", admin
        })
    } catch (error) {
        InternalServerError(error,res);
    }
}
async function getAdmins(req,res) {
    try {
        const admins = await Admin.find({});
        if (!admins) return notFoundInDatabase(res, "Admin");
        res.send(admins);
    } catch (error) {
        InternalServerError(error,res)
    }
}

async function getAdminById(req,res) {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return notFoundInDatabase(res, "Admin");
        res.send(admin);
    } catch (error) {
       return InternalServerError(error,res);
    }
}
async function getAdminByEmail(req,res) {
    try {
        const admin = await Admin.findOne({email:req.params.email.toLowerCase()});
        if (!admin) return notFoundInDatabase(res, "Admin");
        res.send(admin);
    } catch (error) {
       return InternalServerError(error,res);
    }
}
async function deleteAdmin(req,res) {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return notFoundInDatabase(res, "Admin");
        res.status(200).json({
            message: "Deleted Successfully",
            admin
        })
    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function loginAdmin(req,res) {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and Password required"
            });
        }
        await connectDB();
        const user = await Admin.findOne({ email: email });
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid credentials"
            });
        }
        res.status(200).json({
            message:"Login successful",
            admin:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        });
        } catch(error){
            return InternalServerError(error,res);
    }
};

export {
    addAdmin,
    updateAdmin,
    getAdmins,
    getAdminById,
    getAdminByEmail,
    deleteAdmin,
    loginAdmin
}