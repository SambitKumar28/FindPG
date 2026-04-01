import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../middlewares/asyncHandler.js';


//regiser user
export const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password, role} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(400);
        throw new Error('User already exists');

    }
    const hashedPassword =  await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    res.status(201).json({
        sucess: true,
        message: 'User registered successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });

});

//login user
export const loginUser = asyncHandler(async(req, res)=> {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user){
        res.status(400);
        throw new Error('Invalid email or password');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        res.status(401);
         throw new Error('Invalid email or password');

    }
    res.status(200).json({
        sucess: true,
        message: 'Login Successful',
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });

});

export const getCurrentUser = asyncHandler(async(req, res)=>{
    res.status(200).json({
        sucess: true,
        user: req.user,
    });
});

export const logoutUser = asyncHandler(async(req, res)=>{
    res.status(200).json({
        sucess: true,
        messgae: 'Logout Successful',
    });
});

