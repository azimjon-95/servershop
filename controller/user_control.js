const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../model/user_model');

// get data

const GetUser = async (req, res,) => {
    const data = await User.find()
    try {
        res.json({
            data,
            succes: true,
            message: 'Data fetched successfully'
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// sign up
// const response = await fetch('http://localhost:5000/api/users/signup', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         username,
//         password,
//         fullName: fullname,
//         phone,
//         addres: address,
//         googleData: [
//             {
//                 id: GoogleUser?.uid,
//                 displayName: GoogleUser?.displayName,
//                 email: GoogleUser?.email,
//                 photoUrl: GoogleUser?.photoURL,
//                 apiKey: GoogleUser?.apiKey,
//             }
//         ],
//     }),
// });

const SignUp = async (req, res) => {
    try {
        const { username, password, fullName, phone, addres, GoogleUser } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const checkUser = await User.findOne({ username })
        if (checkUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        console.log(GoogleUser);

        const newUser = new User({
            username,
            password: hashedPassword,
            fullName,
            phone,
            addres,
            GoogleUser: [
                {
                    id: GoogleUser?.uid,
                    displayName: GoogleUser?.displayName,
                    email: GoogleUser?.email,
                    photoUrl: GoogleUser?.photoURL,
                    apiKey: GoogleUser?.apiKey,
                }
            ],
        });

        await newUser.save();
        res.json({ message: "User created succesfully!" })
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// login
const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(username, password);
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Parolni tekshirish
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // JWT token yaratish
        const token = jwt.sign({ userId: user._id }, "67556756757", { expiresIn: '1d' });

        // tokendi cookiega saqlash
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: 'Strict', // yoki 'Lax' bo'lishi mumkin, bu sizning talablaringizga qarab
        });


        res.json({
            success: true,
            message: 'User logged in successfully',
            token: token,
            user
        });
    } catch (error) {
        console.log(error);
    }
}

//  logout

const Logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'User logged out succesfully!' });
}

//  delete

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, fullName, phone, addres } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(id, { username, password, fullName, phone, addres }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            success: true,
            message: 'User updated successfully', user
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// get by id

const GetById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User fetched successfully', user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const GetByGoogleId = async (req, res) => {
    try {
        const { googleId } = req.params;
        const user = await User.findOne({ 'GoogleUser.id': googleId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = jwt.sign({ userId: user._id }, "67556756757", { expiresIn: '1d' });

        res.json({
            message: 'User fetched successfully',
            user,
            success: true,
            username: user.username,  // Username beriladi
            password: user.password,  // Parol beriladi
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    GetUser,
    SignUp,
    Login,
    Logout,
    deleteUser,
    Update,
    GetById,
    GetByGoogleId,
}