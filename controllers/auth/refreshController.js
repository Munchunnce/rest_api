import Joi from "joi";
import { REFRESH_SECRET } from "../../config/index.js";
import { User } from "../../models/index.js";
import { RefreshToken } from "../../models/index.js";
import CustomErrorHandle from "../../services/CustomErrorHandler.js";
import JwtService from "../../services/JwtService.js";

const refreshController = {
    async refresh(req, res, next) {
        // validate
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);
        
        if(error){
            return next(error);
        }

        // database token check or not
        let refreshtoken;
        try {
            refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token });
            if(!refreshtoken){
                return next(CustomErrorHandle.unAuthorized('Invalid refresh token'));
            }
        
        let userId;
        try {
            const { _id } = await JwtService.verify(refreshtoken.token, REFRESH_SECRET);
            userId = _id;
        } catch (err) {
            return next(CustomErrorHandle.unAuthorized('Invalid refresh token'));
        }

        // database ke andar verify krna hai kiya ye user hai v ya nhi ok
        const user = await User.findOne({ _id: userId });
        if(!user){
            return next(CustomErrorHandle.unAuthorized('Invalid refresh token'));
        }

        // Token genrate
        const access_token = JwtService.sign({ _id: user._id, role: user.role });
        const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
        // database whiteList
        await RefreshToken.create({ token: refresh_token });
        res.json({ access_token, refresh_token });

        } catch (err) {
            return next(new Error('Something went wrong...') + err.message);
        }
    }
};


export default refreshController;