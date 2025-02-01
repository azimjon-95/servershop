const { Router } = require('express');

const {
    GetStory,
    GetBalance,
    Purchase,
} = require('../controller/story_product');

const router = Router();

// Get all products
router.get('/:userId', GetStory);
router.get('/balance/:userId', GetBalance);
router.post('/purchase', Purchase);
 
module.exports = router;
