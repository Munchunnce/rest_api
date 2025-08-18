import { User } from "../models/index.js"
import CustomErrorHandle from "../services/CustomErrorHandler.js";

const admin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if(user.role === 'admin'){
            next();
        } else {
            return next(CustomErrorHandle.unAuthorized());
        }
    } catch (err) {
        return next(CustomErrorHandle.serverError());
    }

};


export default admin;