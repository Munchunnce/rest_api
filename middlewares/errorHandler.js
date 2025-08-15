import { DEBUG_MODE } from "../config/index.js";
import Joi from "joi";
import CustomErrorHandle from "../services/CustomErrorHandler.js";
const { ValidationError } = Joi;

const errorhandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: 'Internal Error!',
        ...(DEBUG_MODE === 'true' && { originalError: err.message })
    };

    if(err instanceof ValidationError){
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    if(err instanceof CustomErrorHandle){
        statusCode = err.status;
        data = {
            message: err.message,
        }
    }

    return res.status(statusCode).json(data);
};

export default errorhandler;