import dotenv from 'dotenv';
dotenv.config();
import usermodel from '../models/user.model.js';


export const createUser = async ({ username, email, password, profilePicture, mobileNumber }) => {
  if (!username || !email || !password || !profilePicture || !mobileNumber) {
    throw new Error("All fields (username, email, password, profile picture, mobile number) are required.");
  }


  const existingUser = await usermodel.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  
  const hashedPassword = await usermodel.hashPassword(password);


  const newUser = await usermodel.create({
    username,
    email,
    password: hashedPassword,
    profilePicture, 
    mobileNumber,
  });

  return newUser;
};


