// const newUserStory = {
//     userId,
//     fullName: existingUser.fullName,
//     items,
//     totalPrice,
//     purchaseDate: new Date()
// };
const { Schema, model } = require('mongoose');

const StorySchema = new Schema({
    userId: {
        type: String
    },
    items: [
        {
            productId: Schema.Types.ObjectId,
            quantity: Number
        }
    ],
    totalPrice: {
        type: Number
    },
    purchaseDate: {
        type: Date
    }

})

const Story = model('story', StorySchema);
module.exports = Story;