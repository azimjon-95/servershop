const express = require('express');
const router = express.Router();
const { 
    GetFromFavourite,
    addToFavourite,
    deleteFavouriteItem,
} = require('../controller/favourite_control');

router.get('/:userId', GetFromFavourite);
router.post('/add', addToFavourite);
router.delete('/delete/:userId/:productId', deleteFavouriteItem);



module.exports = router;

