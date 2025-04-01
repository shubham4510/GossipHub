import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge / 1000 }); // Convert to seconds
};

export const getUserInfo = async (req,res) => {
  try {
    const user = await User.findById(req.userId)
    
    
    if (!user) {
      return res.status(400).json({success:false,  message: "User with the given id not found!" });
    }

    res.status(200)
      .json({
        success:true,
        user:{
        message: "User logged in successfully",
        id: user._id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
        profileSetup: user.profileSetup ?? false,
        color: user.color,
      }});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error while logging in", error: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email }).select("+password"); // Ensure password is fetched

    if (!user) {
      return res.status(400).json({ message: "User is not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password is incorrect!" });
    }

    const token = createToken(email, user._id);

    res.status(200)
      .cookie("token", token, { maxAge, httpOnly: true })
      .json({
        success:true,
        user:{
        message: "User logged in successfully",
        id: user._id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
        profileSetup: user.profileSetup ?? false,
        color: user.color,
      }});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error while logging in", error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const isUserAlreadyRegistered = await User.findOne({ email });

    if (isUserAlreadyRegistered) {
      return res.status(400).json({ message: "User is already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashPassword });

    const token = createToken(email, newUser._id);

    const userObject = newUser.toObject();
    delete userObject.password; // Remove password from response


    return res.status(201).cookie(token,token,{maxAge}).json({ success: true, message: "User created successfully", user: userObject });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error while signing up", error: error.message });
  }
};
