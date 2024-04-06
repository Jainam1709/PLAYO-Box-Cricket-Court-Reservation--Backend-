import express from "express";
import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'
//import nodemailer from "nodemailer";
//const nodemailer = require('nodemailer');
// import dotenv from 'dotenv'
// dotenv.config()
// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_FROM,
//     pass: process.env.EMAIL_PASSWORD, // Provide your email password here
//   },
//   authMethod: 'PLAIN',
// });

class UserController{
    static userRegistrtation = async (req,res)=>{
    const {name, contactno, email, password, password_confirmation, tc} = req.body

    // Validate email
    if (!validateEmail(email)) {
      return res.send({"status": "failed", "message": "Invalid email format"});
    }

    // Validate phone number
    if (!validatePhoneNumber(contactno)) {
      return res.send({"status": "failed", "message": "Invalid phone number format"});
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.send({"status": "failed", "message": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"});
    }

    const user = await UserModel.findOne({email:email})
    if(user){
        res.send({"status":"failed","message":"Email already exists"})
    }else{
        if(name && contactno && email && password && password_confirmation && tc){
            if (password === password_confirmation){
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const doc = new UserModel({
                      name: name,
                      contactno: contactno,
                      email: email,
                      password: hashPassword,
                      tc: tc
                })
                await doc.save()
                const saved_user = await UserModel.findOne({email:email})
                
                //Generate JWT Token
                const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn : '2d'})

                res.status(201).send({"status":"success","message":"Registration Successfull" , "token": token})
                } catch (error) {
                    console.log(error)
                    res.send({"status":"failed","message":"unable to register"})
                }

            }else{
                res.send({"status":"failed","message":"password and confirm password dosen't match"})
            }

        }else{
            res.send({"status":"failed","message":"All fields are required"})
        }

    }
    }

    static userLogin = async (req, res)=>{
        try {
            const{email,contactno, password} = req.body
            if(email && password && contactno){
                const user = await UserModel.findOne({email:email, contactno: contactno})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && (user.contactno === contactno) && isMatch){
                        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn : '2d'})
                        res.send({"status":"success","message":"Login Successfull" , "token": token})
                    }else{
                        res.send({"status":"failed","message": "Invalid credentials. Please check your email, contact number, and password."})
                    }
                }else{
                    res.send({"status":"failed","message":"User not found. Please register first."})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to Login"})
        }
    }

    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {
          if (password !== password_confirmation) {
            res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
          } else {
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
            res.send({ "status": "success", "message": "Password changed succesfully" })
          }
        } else {
          res.send({ "status": "failed", "message": "All Fields are Required" })
        }
      }

      static loggedUser = async(req,res)=>{
        res.send({"User":req.user})
      } 

      static sendUserPasswordResetEmail = async (req, res) => {
        try {
            const { email } = req.body
    
            if (email) {
                const user = await UserModel.findOne({ email: email });
    
                if (user) {
                    const secret = user._id + process.env.JWT_SECRET_KEY;
                    const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' });
                    const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
                    console.log(link);
                    //Send Email
                    // let info = await transporter.sendMail({
                    //   from: process.env.EMAIL_FROM,
                    //   to: user.email,
                    //   subject: "Playo Box cricket - Password Reset Link",
                    //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
                    // });
                    res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email"})
                } else {
                    res.send({ "status": "failed", "message": "Email doesn't exist" });
                }
            } else {
                res.send({ "status": "failed", "message": "Email field is required" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ "status": "failed", "message": "Internal Server Error. Unable to send password reset email." });
        }
    }

    static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
          jwt.verify(token, new_secret)
          if (password && password_confirmation) {
            if (password !== password_confirmation) {
              res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
            } else {
              const salt = await bcrypt.genSalt(10)
              const newHashPassword = await bcrypt.hash(password, salt)
              await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
              res.send({ "status": "success", "message": "Password Reset Successfully" })
            }
          } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
          }
        } catch (error) {
          console.log(error)
          res.send({ "status": "failed", "message": "Invalid Token" })
        }
    }

    static userLogout = async (req, res) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
  
        // Add the token to the blacklist
        await UserModel.findByIdAndUpdate(req.user._id, { $set:{ blacklistedTokens: token } })
  
        res.send({ status: 'success', message: 'Logout successful' });
      } catch (error) {
        console.error(error);
        res.status(401).json({ status: 'failed', message: 'Invalid Token. Logout failed.' });
      }
    }
    

}

// Email validation function
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Phone number validation function
function validatePhoneNumber(phoneNumber) {
  return phoneNumber.match(/^\d{10}$/) !== null;
}

// Password validation function
function validatePassword(password) {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
}

export default UserController