const Story = require('../model/story')
const User = require('../model/user_model')
const Product = require('../model/product_model')
const Balance = require('../model/balance')


// Get users

const GetStory = async (req, res) => {
    try {
        const data = await Story.find()
        res.json({
            data,
            success: true,
            message: 'All story data'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving users'
        })
    }
}

// Get Balance

const GetBalance = async (req, res) => {
    try {
        const data = await Balance.find()
        res.json({
            data,
            success: true,
            message: 'All Balance data'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving users'
        })
    }
}

// Purchare

const Purchase = async (req, res) => {
    try {
        const { userId, items, totalPrice } = req.body


        const existingUser = await User.findOne({ _id: userId })

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const productIds = items.map(item => item.productId)
        const products = await Product.find({ _id: { $in: productIds } })

        if (products.length !== items.length) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        const insufficientStock = items.some(item => {
            const product = products.find(product => product._id.toString() === item.productId);
            return product.quantity < item.quantity;
        });

        if (insufficientStock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        const bulkOperations = items.map(item => ({
            updateOne: {
                filter: { _id: item.productId },
                update: { $inc: { quantity: -item.quantity } }
            }
        }));

        await Product.bulkWrite(bulkOperations);

        const newUserStory = {
            userId,
            fullName: existingUser.fullName,
            items,
            totalPrice,
            purchaseDate: new Date()
        };

        const newStory = await Story.create(newUserStory);
        await newStory.save();

        const userBalance = await Balance.findOne({ userId });

        if (userBalance) {
            userBalance.balance += totalPrice;
            await userBalance.save();
        } else {
            const newBalance = new Balance({
                userId,
                balance: totalPrice
            });
            await newBalance.save();
        }

        res.json({
            success: true,
            message: "Story created successfully",
            data: newStory
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error processing purchase'
        })
    }
}

module.exports = {
    GetStory,
    GetBalance,
    Purchase,
}  