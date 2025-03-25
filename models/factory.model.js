const mongoose = require('mongoose');

const factorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    legalForm: { type: String, required: true },
    address: {
        region: { type: String, required: true },
        district: { type: String, required: true },
        city: String,
        neighborhood: String,
        street: String
    },
    director: { type: String, required: true },
    projectValue: { type: Number, required: true },
    activityType: { type: String, required: true },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    employees: { type: Number, required: true },
    images: [{ type: String }]
});

module.exports = mongoose.model('Factory', factorySchema);