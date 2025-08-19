import { Product } from "../models/index.js";
import multer from "multer";
import path from 'path';
import CustomErrorHandle from "../services/CustomErrorHandler.js";
import fs from 'fs';
import productSchema from "../validator/productValidator.js";


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
    },

    async update(req, res, next) {
        // Multipart from data
        handlerMultipartData(req, res, async (err) => {
            if(err){
                return next(CustomErrorHandle.serverError(err.message));
            }

            let filePath;
            if(req.file){
                filePath = req.file.path;
            }
            // validate
            const { error } = productSchema.validate(req.body);
                            
            if(error){
                //Delete the uploaded file
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if(err){
                            return next(CustomErrorHandle.serverError(err.message));
                        }
                    });
                }
                return next(error);
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findByIdAndUpdate({_id: req.params.id},{
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, { new: true })
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        })
    },

    async destroy(req, res, next) {
        const document = await Product.findByIdAndDelete({ _id: req.params.id });
        if(!document){
            return next(new Error('Nothing to delete!'));
        }
        //image
        const imagePath = document.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if(err){
                return next(CustomErrorHandle.serverError());
            }
        });
        res.json(document);
    }
};


export default productController;