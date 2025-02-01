const mongoose = require('mongoose');
require('dotenv').config()

// Connect to MongoDB
const Database = () => {
    mongoose.connect(process.env.MONGOOS_API)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => {
            console.error("error connect to mongoDB", err);
        })
}

Database()


// git init
// git add README.md
// git commit - m "first commit"
// git branch - M main
// git remote add origin https://github.com/azimjon-95/servershop.git
// git push - u origin main