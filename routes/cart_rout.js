const express = require('express');
const router = express.Router();
const { GetFromCart, addToCart, updateQuantity, deleteAllItems, deleteItem } = require('../controller/cart.control');

router.get('/:userId', GetFromCart);
router.post('/add', addToCart);
router.patch('/update/:userId', updateQuantity);
router.delete('/delete/:userId/:productId', deleteItem);
router.delete('/delete-all/:userId/:productId', deleteAllItems);



module.exports = router;

