const Cart = require('../model/cart_model');
const Product = require('../model/product_model')


const GetFromCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartData = await Cart.findOne({ userId }).populate('items.productId');

        if (!cartData) {
            return res.json({
                success: false,
                message: "Cart not found for this user",
            });
        }

        const allProducts = await Product.find();
        const filteredItems = cartData.items.filter(cartItem =>
            allProducts.some(product => product._id.equals(cartItem.productId._id))
        );

        // Yangi ma'lumotlar formatini yaratish
        const formattedData = filteredItems.map(cartItem => {
            const product = allProducts.find(p => p._id.equals(cartItem.productId._id));
            return {

                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image,
                Itemquantity: product.quantity
            };
        });

        res.json({
            success: true,
            message: "Filtered cart data",
            data: formattedData
        });
    } catch (err) {
        res.json({
            success: false,
            message: "Error",
            data: err
        })
    }
}

// Add to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cartData = await Cart.findOne({ userId })

        if (cartData) {
            const itemIndex = cartData.items.findIndex(item => item.productId.equals(productId))
            if (itemIndex > -1) {
                cartData.items[itemIndex].quantity += quantity
            }
            else {
                cartData.items.push({ productId, quantity })
            }
            await cartData.save()
            return res.json({ messege: "Product added succesfully" })
        } else {
            const newData = {
                userId,
                items: [
                    {
                        productId,
                        quantity
                    }
                ]
            }
            const cart = new Cart(newData)
            await cart.save()
            res.json({ messege: "Product added succesfully" })
        }
    }
    catch (error) {
        console.log(error)
    }
}

const updateQuantity = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, increment } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += increment ? 1 : -1;

            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        } else {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        await cart.save();
        res.json({
            success: true,
            message: 'Quantity updated successfully',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// delete all items from cart
const deleteAllItems = async (req, res) => {
    try {
        const { userId } = req.params;

        // Cart modelidan barcha mahsulotlarni o'chirish
        const result = await Cart.deleteMany({ userId });

        if (result.deletedCount > 0) {
            res.json({
                success: true,
                message: 'All items deleted from cart successfully'
            });
        } else {
            res.json({
                success: false,
                message: 'No items found to delete'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


//  delete item by id+
const deleteItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        console.log(userId, productId);

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Mahsulotni qidirish
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            // Mahsulotni o‘chirish
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.json({ success: true, message: 'Item deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = {
    GetFromCart,
    addToCart,
    updateQuantity,
    deleteAllItems,
    GetFromCart: GetFromCart,
    deleteItem
};



















































// // const Cart = require('../model/product_model');

// // // Get items from the cart
// // const GetFromCart = async (req, res) => {
// //     try {
// //         const { userId } = req.params;
// //         const data = await Cart.findOne({ userId }).populate('items.productId');

// //         res.json({
// //             success: true,
// //             message: "My data",
// //             data
// //         });
// //     } catch (err) {
// //         res.json({
// //             success: false,
// //             message: "Error",
// //             data: err
// //         });
// //     }
// // };


// // // Add to cart
// // const addToCart = async (req, res) => {
// //     try {
// //         const { userId, productId, quantity } = req.body;

// //         const cart = await Cart.findOne({ userId });

// //         if (!cart) {
// //             return res.status(404).json({ message: 'Cart not found' });
// //         }

// //         const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

// //         if (itemIndex > -1) {
// //             cart.items[itemIndex].quantity += quantity;
// //         } else {
// //             cart.items.push({ productId, quantity });
// //         }

// //         await cart.save();
// //         res.json({ message: 'Product added to cart successfully' });
// //     } catch (error) {
// //         console.log(error);
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // };



// // const updateQuantity = async (req, res) => {
// //     try {
// //         const { userId } = req.params;
// //         const { productId, increment } = req.body;

// //         const cart = await Cart.findOne({ userId });

// //         if (cart) {
// //             const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

// //             if (itemIndex > -1) {
// //                 cart.items[itemIndex].quantity += increment ? 1 : -1;

// //                 if (cart.items[itemIndex].quantity <= 0) {
// //                     cart.items.splice(itemIndex, 1);
// //                 }
// //             }

// //             await cart.save();
// //             res.json({ message: 'Quantity updated successfully' });
// //         } else {
// //             res.status(404).json({ message: 'Cart not found' });
// //         }
// //     } catch (error) {
// //         console.log(error);
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // };



// // module.exports = {
// //     GetFromCart,
// //     addToCart,
// //     updateQuantity
// // };

