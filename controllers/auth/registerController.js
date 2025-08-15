import Joi from "joi";
import CustomErrorHandle from "../../services/CustomErrorHandler.js";
import { User } from '../../models/index.js';
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService.js";

const registerController = {
    async register(req, res, next){
    // CHECKLIST
    // [1] validate the request
    // [2] authorise the request
    // [3] check if user is in the database already
    // [4] prepare model
    // [5] store in database
    // [6] generate jwt token
    // [7] send response

        // Validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });

        const { error } = registerSchema.validate(req.body);
        if(error){
            return next(error);
        }
        
        // check if user in the database already
        try {
            const exist = await User.exists({ email: req.body.email });
            if(exist){
                return next(CustomErrorHandle.alreadyExist('This email is already taken'));
            }
        } catch (err) {
            return next(err);
        }

        const { name, email, password } = req.body;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // prepare the model

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // database ke andar save krna hai
        let access_token;
        try {
            const result = await user.save();
            console.log(result);
            // token
            access_token = JwtService.sign({ _id: result._id, role: result.role });

        } catch (err) {
            return next(err);
        }
        res.json({ access_token: access_token });
    }
};

export default registerController;