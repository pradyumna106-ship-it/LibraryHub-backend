import { Member } from "../models/members.model.js";
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { validateAllFields } from "../utils/validate.js";

async function addMember(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
                return res.status(400).json(missingField(missingFields));
        }
        const member = await Member.create(req.body)
        res.status(201).json({
            message:"Member Added Successfully", member
        })
    } catch (error) {
        InternalServerError(error,res);
    }
}

async function updateMember(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
                if (!isValid) {
                    return res.status(400).json(missingField(missingFields));
                }
        const member = await Member.findByIdAndUpdate(req.params.id,req.body,{new: true})
        if (!member) return notFoundInDatabase(res, "Member");
        res.status(200).json({
            message:"Member Updated Successfully", member
        })
    } catch (error) {
        InternalServerError(error,res);
    }
}
async function getMembers(req,res) {
    try {
        const members = await Member.find({});
        if (!members) return notFoundInDatabase(res, "Member");
        res.send(members);
    } catch (error) {
        InternalServerError(error,res)
    }
}

async function getMemberById(req,res) {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return notFoundInDatabase(res, "Member");
        res.send(member);
    } catch (error) {
       return InternalServerError(error,res);
    }
}
async function getMemberByEmail(req,res) {
    try {
        const member = await Member.findOne({email:req.params.email.toLowerCase()});
        if (!member) return notFoundInDatabase(res, "Member");
        res.send(member);
    } catch (error) {
       return InternalServerError(error,res);
    }
}
async function deleteMember(req,res) {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) return notFoundInDatabase(res, "Member");
        res.status(200).json({
            message: "Deleted Successfully",
            member
        })
    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function loginMember(req,res) {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and Password required"
            });
        }
        const user = await Member.findOne({ email: email.toLowerCase() });
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
            member:{
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
    addMember,
    updateMember,
    getMembers,
    getMemberById,
    deleteMember,
    loginMember,
    getMemberByEmail,
}