const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    GoogleUser: [
        {
            id: String,
            displayName: String,
            email: String,
            photoUrl: String,
            apiKey: String,
        }

    ],
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [4, "Kamida 4 ta belgi"],
        maxlength: [25, "uzog'i bilan 25 ta belgi"],
        match: /^[a-zA-Z0-9]+$/
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Kamida 3 ta belgi"],
        maxlength: [50, "uzog'i bilan 50 ta belgi"],
        match: /^[a-zA-Z\s]+$/
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    addres: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, "Kamida 10 ta belgi"],
        maxlength: [100, "uzog'i bilan 100 ta belgi"],
        match: /^[a-zA-Z0-9\s.,-]+$/
    },
    tokens: [{
        token: {
            type: String,
            required: true,

        }
    }]
})

const User = model('user', userSchema);

module.exports = User;