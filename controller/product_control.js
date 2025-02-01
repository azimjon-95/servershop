const Product = require('../model/product_model')
const Multer = require('multer')
const FormData = require('form-data')
const axios = require('axios')


// get user

const GetProduct = async (req, res) => {
    const data = await Product.find()
    try {
        res.json({
            data,
            success: true,
            message: 'Products retrieved successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve products'
        })
    }
}

const CreateProduct = async (req, res) => {
    try {
        const { name, price, quantity, category, description, image, size, gender, colors, rate, company, comment } = req.body



        const newProduct = new Product({
            name,
            price,
            quantity,
            category,
            description,
            image,
            size,
            gender,
            colors,
            rate,
            company,
            comment
        })
        await newProduct.save()
        res.status(201).json({
            success: true,
            message: 'Product created successfully'
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, quantity, category, description, image, size, gender, colors, rate, company, comment } = req.body

        const product = await Product.findByIdAndUpdate(id, { name, price, quantity, category, description, image, size, gender, colors, rate, company, comment }, { new: true })
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        })
    }
}

const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Mahsulotni o'chirish
        const product = await Product.findByIdAndDelete(id);

        // Agar mahsulot topilmasa
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Muvaffaqiyatli o'chirildi
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            deletedProduct: product, // Ixtiyoriy, o'chirilgan mahsulotni qaytarish
        });
    } catch (error) {
        // Xatolik yuz bergan holda
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    }
};

// search query

const SearchProduct = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Name query parameter is required' });
    }

    try {
        const products = await Product.find({
            name: { $regex: name, $options: 'i' }, // `i` - katta-kichik harfni e'tiborsiz qidiradi
        });

        res.json({
            success: true,
            data: products,
            message: "Search results",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to search products',
            error: error.message,
        });
    }
};




module.exports = DeleteProduct;


// get by id

const GetProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        res.json({
            success: true,
            data: product
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve product',
            error: error.message
        })
    }
}

// get max and min prices
const getMaxAndMinPrice = async (req, res) => {
    try {
        const prices = await Product.find();

        const priceValues = prices.map(p => p.price);

        const minPrice = Math.min(...priceValues);
        const maxPrice = Math.max(...priceValues);

        res.json({ minPrice, maxPrice });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching min and max prices');
    }
};
// const getMaxAndMinPrice = async (req, res) => {
//     try {
//         const prices = await Product.find();
//         const priceValues = prices.map((p) => p.newPrice);
//         const minPrice = Math.min(...priceValues);
//         const maxPrice = Math.max(...priceValues);
//         res.json({ minPrice, maxPrice });
//         console.log(minPrice, maxPrice);
//     } catch (err) {
//         console.log(err);
//     }
// };

// get by price
const GetDatasByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.body
    console.log(minPrice, maxPrice, 'salom');


    // filtred 
    const filter = {}

    if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
        filter.price = { $gte: minPrice };
    } else if (maxPrice) {
        filter.price = { $lte: maxPrice };
    }

    // filtrlash va natijalarni olish
    const product = await Product.find(filter)

    res.status(200).json({
        success: true,
        data: product,
        messege: 'All data'
    })
}


module.exports = {
    GetProduct,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetProductById,
    SearchProduct,
    GetDatasByPrice,
    getMaxAndMinPrice,
}