const { Schema, model } = require('mongoose');

const BalanceSchema = new Schema({
    balance: {type: 'string',},
    userId: {type: 'string',}
}, { timestamps: true })

const Balance = model('balance', BalanceSchema);
module.exports = Balance;