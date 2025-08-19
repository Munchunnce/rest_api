import mongoose from "mongoose";
import { APP_URL } from "../config/index.js";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, require: true },
    size: { type: String, require: true },
    image: { type: String, require: true, get: (image) => {
        // http://localhost:5000/uploads/1755529139439-209511301.15726292.png
        if (!image) return null;
        return `${APP_URL}/${image}`;
    } },
}, { timestamps: true, toJSON: { getters: true }, id: false });

export default mongoose.model('Product', productSchema, 'products');