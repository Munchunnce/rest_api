import { Product } from "../models/index.js";
import multer from "multer";
import path from 'path';
import CustomErrorHandle from "../services/CustomErrorHandler.js";
import Joi from "joi";
import fs from 'fs';


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random() * 1E9}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handlerMultipartData = multer({storage, limits: { fileSize: 1000000 * 5 } }).single('image');


const productController = {
    async store(req, res, next) {
        // Multipart from data
        handlerMultipartData(req, res, async (err) => {
            if(err){
                return next(CustomErrorHandle.serverError(err.message));
            }
            const filePath = req.file.path;
            // validate
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
            });
            const { error } = productSchema.validate(req.body);
                            
            if(error){
                //Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if(err){
                        return next(CustomErrorHandle.serverError(err.message));
                    }
                });
                return next(error);
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        })
    }
};


export default productController;