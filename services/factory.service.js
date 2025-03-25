const axios = require('axios');
const Factory = require('../models/factory.model');

class FactoryService {
    static async uploadImages(images) {
        const uploadedUrls = [];
        for (const image of images.slice(0, 5)) {
            const formData = new FormData();
            formData.append('image', image);
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData);
            uploadedUrls.push(response.data.data.url);
        }
        return uploadedUrls;
    }

    static async createFactory(data, images) {
        const imageUrls = images ? await this.uploadImages(images) : [];
        const factory = new Factory({ ...data, images: imageUrls });
        return await factory.save();
    }

    static async getFactories() {
        return await Factory.find().lean();
    }

    static async getFactoryById(id) {
        const factory = await Factory.findById(id).lean();
        if (!factory) throw new Error('Factory not found');
        return factory;
    }
}

module.exports = FactoryService;






