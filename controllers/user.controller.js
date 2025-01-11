import { validationResult } from 'express-validator';
import * as User from '../servies/user.service.js'
import usermodel from '../models/user.model.js'
import mongoose from 'mongoose';


export const createusercontroller = async (req, res) => {
    const { username, email, password, mobileNumber } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    if (!profilePicture) {
        return res.status(400).json({ message: "Profile picture is required" });
    }

    try {
    
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

    
        const hashedPassword = await usermodel.hashpassword(password);

    
        const newUser = await usermodel.create({
            username,
            email,
            password: hashedPassword,
            profilePicture,
            mobileNumber,
        });

        
        const token = await newUser.gernatejwt(); 

        
        res.status(201).json({ message: "User created successfully", user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};
 


export const getAllUsers = async (req, res) => {
    try {
      const users = await usermodel.find();
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  };
  

  export const getUserById = async (req, res) => {
    let { userId } = req.params;


    if (userId.startsWith(':')) {
        userId = userId.slice(1); 
    }

    try {
        const user = await usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};



     

export const updateUserDetails = async (req, res) => {
    const { userId } = req.params;
    const { username, password, mobileNumber } = req.body;

    try {
       
        const objectId = new mongoose.Types.ObjectId(userId);

       
        const user = await usermodel.findById(objectId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.email && req.body.email !== user.email) {
            return res.status(400).json({ message: 'Email cannot be modified' });
        }

       
        if (username) user.username = username;
        if (password) user.password = await usermodel.hashpassword(password); // Hash the new password
        if (mobileNumber) user.mobileNumber = mobileNumber;

        const updatedUser = await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {

        const objectId = new mongoose.Types.ObjectId(userId);

        
        const deletedUser = await usermodel.findByIdAndDelete(objectId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            user: deletedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message,
        });
    }
};