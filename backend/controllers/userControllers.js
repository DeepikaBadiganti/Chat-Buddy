const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const bcrypt = require('bcryptjs');

const registerUser = asyncHandler(async (req,res) => {
    const {name, email, password, profilePic} = req.body;
    if(!name || !email || !password){
        res.status(400);
        res.json({message : 'Please fill all the fields'});
        throw new Error('Please fill all the fields');
    }

    const userExits =  await User.findOne({email});
    if(userExits){
        res.status(400);
        res.json({message : 'User already exists'});
        throw new Error('User already exists');
    } 

    const user = await User.create({
        name,
        email,
        password,
        profilePic
    })
    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            profilePic : user.profilePic,
            token : generateToken(user._id)
        })
    }
    else{
        res.status(400);
        throw new Error('Invalid User Data');
    }

});

const authUser = asyncHandler( async (req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            profilePic : user.profilePic,
            token : generateToken(user._id)
        })
    }
    else{
        res.status(401);
        res.json({message : 'Invalid email or password'});
        throw new Error('Invalid email or password');
    }
})


// /api/users?search=
const allUsers = asyncHandler(async(req,res) =>{
    const keyword = req.query.search ?{
        $or : [
            {name : {$regex : req.query.search, $options : 'i'}},
            {email : {$regex : req.query.search, $options : 'i'}}
        ]  
    } : {};

    const users = await User.find(keyword).find({_id : {$ne : req.user._id}});
    res.json(users);   
})

module.exports = {registerUser, authUser,allUsers};