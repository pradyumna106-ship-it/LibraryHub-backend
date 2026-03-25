import { missingField } from "../exception/exception.js";
import { Publisher } from "../models/publishers.model.js";
import { validateAllFields } from "../utils/validate.js";
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";

async function addPublisher(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
            return res.status(400).json(missingField(missingFields));
        }
            const publisher = await Publisher.create(req.body)
            res.status(201).json({
                message:"Member Added Successfully", publisher
            })
        } catch (error) {
            // 🔥 HANDLE DUPLICATE EMAIL
                if (error.code === 11000) {
                return res.status(400).json({
                    message: "Email already exists"
                });
                }
            return InternalServerError(error,res);
        }
}

async function updatePublisher(req,res) {
    try {
            const { isValid, missingFields } = validateAllFields(req.body);
            if (!isValid) {
                return res.status(400).json(missingField(missingFields));
            }
            const publisher = await Publisher.findByIdAndUpdate(req.params.id,req.body,{new: true})
            if (!publisher) return notFoundInDatabase(res, "Publisher");
            res.status(200).json({
                message:"Member Updated Successfully", publisher
            })
        } catch (error) {
            return InternalServerError(error,res);
        }
}

async function getPublishers(req, res) {
    try {
            const publishers = await Publisher.find({});
            if (!publishers) return notFoundInDatabase(res, "Publisher"); 
            res.send(publishers);
        } catch (error) {
            return InternalServerError(error,res)
    }
}

async function getPublisherById(req,res) {
    try {
            const publisher = await Publisher.findById(req,params.id);
            if (!publisher) return notFoundInDatabase(res, "Publisher");
            res.send(publisher);
        } catch (error) {
            return InternalServerError(error,res)
    }
}

async function deletePublisher(req,res) {
    try {
            const publisher = await Publisher.findByIdAndDelete(req.params.id);
            if (!publisher) return notFoundInDatabase(res, "Publisher");
            res.status(200).json({
                message: "Deleted Successfully",
                publisher
            })
        } catch (error) {
            return InternalServerError(error,res)
        }
}
export {
    addPublisher,
    updatePublisher,
    getPublishers,
    getPublisherById,
    deletePublisher
}