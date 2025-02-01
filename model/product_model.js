const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    size: [{ type: String, trim: true }],
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Unisex'] },
    colors: [{ type: String, trim: true }],
    rate: { type: Number, required: true, min: 0, max: 5 },
    company: { type: String, required: true, trim: true },
    comments: [
        {
            user: { type: String, required: true },
            comment: { type: String, required: true, trim: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const Product = model('Product', productSchema);

module.exports = Product;
