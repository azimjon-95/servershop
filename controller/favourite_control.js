const Favourite = require('../model/favourite');
const Product = require('../model/product_model')


const GetFromFavourite = async (req, res) => {
    try {
        const { userId } = req.params;
        const favouriteData = await Favourite.findOne({ userId }).populate('items.productId');

        if (!favouriteData) {
            return res.json({
                success: false,
                message: "Favourite not found for this user",
            });
        }

        const allProducts = await Product.find();
        const filteredItems = favouriteData.items.filter(favouriteItem =>
            allProducts.some(product => product._id.equals(favouriteItem.productId._id))
        );

        // Yangi ma'lumotlar formatini yaratish
        const formattedData = filteredItems.map(favouriteItem => {
            const product = allProducts.find(p => p._id.equals(favouriteItem.productId._id));
            return {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: favouriteItem.quantity,
                image: product.image,
                description: product.description
            };
        });

        res.json({
            success: true,
            message: "Filtered favourite data",
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
const addToFavourite = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let favouriteData = await Favourite.findOne({ userId });

        if (favouriteData) {
            const itemIndex = favouriteData.items.findIndex(item => item.productId.equals(productId));
            
            if (itemIndex > -1) {
                return res.json({ message: "Product already in favourites" });
            }

            // Mahsulotni qo'shish
            favouriteData.items.push({ productId });
            await favouriteData.save();

            return res.json({ message: "Product added successfully" });
        } else {
            // Yangi foydalanuvchi uchun yangi hujjat yaratish
            const newFavourite = new Favourite({
                userId,
                items: [{ productId }]
            });
            await newFavourite.save();

            return res.json({ message: "Product added successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



//  delete item by id
const deleteFavouriteItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        console.log(userId, productId);

        const favourite = await Favourite.findOne({ userId });

        if (!favourite) {
            return res.status(404).json({ success: false, message: 'favourite not found' });
        }

        const itemIndex = favourite.items.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            favourite.items.splice(itemIndex, 1);
            await favourite.save();
            return res.json({ success: true, message: 'Item deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Product not found in favourite' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};





module.exports = {
    GetFromFavourite,
    addToFavourite,
    deleteFavouriteItem,
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

