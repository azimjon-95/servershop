const { Schema, model } = require('mongoose');

const favouriteSchema = new Schema({
    userId: {
        type: String
    },
    items: [
        {
            productId: Schema.Types.ObjectId
        }
    ]
}, { timestamps: true })
const Favourite = model('favourite', favouriteSchema);
module.exports = Favourite;