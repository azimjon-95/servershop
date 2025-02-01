const { Router } = require('express');
const Product = require('../model/product_model');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();

const {
    GetProduct,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetProductById,
    GetDatasByPrice,
    SearchProduct,
    getMaxAndMinPrice
} = require('../controller/product_control');

const router = Router();

// Get all products
router.get('/products', GetProduct);
// Get product by ID
router.get('/product/:id', GetProductById);
// Create a new product
router.post('/create', CreateProduct);
// Update a product
router.put('/update/:id', UpdateProduct);
// Delete a product
router.delete('/delete/:id', DeleteProduct);
// Search product by name
router.get('/search', SearchProduct);
// Get all products
router.get('/filter/by/price', GetDatasByPrice);
// Get max and min price
router.get('/filter/max/min', getMaxAndMinPrice);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create/pro', upload.array('images', 3), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // console.log(req.files, req.body);

    try {
        // ImgBB API-ga yuborish uchun rasm URL-larni olish
        const imageUtls = [];
        for (const file of req.files) {
            const formData = new FormData();

            formData.append('image', file.buffer, file.originalname);

            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=38cfe6ae88e80c4d114ee8fc8de923cc`,
                formData, {
                headers: {
                    ...formData.getHeaders(),
                }
            }
            );

            console.log("server>>", response);
            imageUtls.push(response.data.data.url)
        }

        // Maxsulot yaratish
        const newProduct = new Product({
            ...req.body,
            images: imageUtls
        })
        await newProduct.save();
        res.json({ message: 'Product created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating product', error });
    }
});


module.exports = router;
