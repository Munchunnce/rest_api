import express from 'express'
import { registerController } from '../controllers/index.js';

const router = express.Router();


router.post('/register', registerController.register);


export default router;