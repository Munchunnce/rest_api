import CustomErrorHandle from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";

const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if(!authHeader){
        return next(CustomErrorHandle.unAuthorized());
    }

    const token = authHeader.split(' ')[1];

    try {
        const { _id, role } = await JwtService.verify(token);
        const user = {
            _id,
            role
        };
        req.user = user;
        next();
    } catch (err) {
        return next(CustomErrorHandle.unAuthorized());
    }
};

export default auth;