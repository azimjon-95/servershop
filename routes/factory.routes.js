const express = require('express');
const authenticateToken = require('../middleware/auth');
const validateFactory = require('../middleware/validateFactory');
const FactoryService = require('../services/factory.service');

const router = express.Router();

router.post('/', authenticateToken, validateFactory, async (req, res) => {
    try {
        const factory = await FactoryService.createFactory(req.body, req.files?.images);
        res.status(201).json(factory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const factories = await FactoryService.getFactories();
        res.json(factories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const factory = await FactoryService.getFactoryById(req.params.id);
        res.json(factory);
    } catch (err) {
        if (err.message === 'Factory not found') {
            res.status(404).json({ error: 'Factory not found' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

module.exports = router;

