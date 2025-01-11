import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, 
    },
    profilePicture: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
  });


userSchema.statics.hashpassword = async function (password) {
    return await bcrypt.hash(password, 10);
};


userSchema.methods.comparepassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.gernatejwt = function () {
    return jwt.sign({ email: this.email }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

const user = mongoose.model('user', userSchema);
export default user;
