const User = require('../models/usermodel');
const Otp = require('../models/otp');
const nodemailer = require('nodemailer');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require('../config/transoprter')

const signup = async function (req, res) {
    const { username, password, mobileno, email, sendMobileOTP, sendEmailOTP } = req.body;
    if (username && password && mobileno && email) {

        const foundUsers = await User.find({ email: email });
        if (foundUsers.length > 0) {
          res.status(200).json({ message: "User with this email exists" });
        }

        else {
            const saltRounds = bcrypt.genSaltSync(10);
            const encryptedPassword = await bcrypt.hash(password, saltRounds);
            await User.create({ email: email, name: username, password: encryptedPassword, mobileno: mobileno, verified: false });
            
            var otp = Math.floor(100000 + Math.random() * 900000);;
            otp = parseInt(otp);
            
            Otp.deleteMany({ email: email }, function (err, foundotp) {
                if (err) {
                    res.status(301).josn({ message: "err" });
                }
                else {
                    Otp.create({ email: email,mobileno:mobileno, otp: otp });
                }
            })
            
            
            if(sendEmailOTP){

                const mailOptions = {
                    from: process.env.EMAIL_USEREMAIL, // Sender address
                    to: email, // List of recipients
                    subject: 'Verification Code', // Subject line
                    text: `Dear User,\nYour OTP for registering to our authentication service is ${otp}`, // Plain text body
                    html: `<div>Dear User, <br>Your OTP for registering to our authentication service is <b>${otp}</b></div>`
                };
            
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Mail Send");
                    }
                });
            }
            if(sendMobileOTP){
                try{

                    client.messages
                    .create({
                        body:  `Dear User, Your OTP for registering to our authentication service is ${otp}`, // Plain text body,
                        from: process.env.TWILIO_MOBILE_NUMBER,
                        to: '+91'+mobileno
                    })
                    .then(message => console.log(message.sid));
                }
                catch(e){
                    console.log("Error :", e)
                }
            }

            res.status(201).json({ message: "User created !!" });
        }
       
    }
    else {
        res.status(200).json({ message: "Please fill all the fields", state: 0 });
    }
}
const requestotp = function (req, res) {
    const email = req.body.email;
    if (email) {

        var otp = Math.random();
        otp = otp * 1000000;
        otp = parseInt(otp);
        Otp.deleteMany({ email: email }, function (err, foundotp) {
            if (err) {
                res.status(402).josn({ message: "err" });
            }
            else {
                console.log('deleted older otps')
            }
        })
        Otp.create({ email: email,mobileno:"", otp: otp });
        const mailOptions = {
            from: 'priyanshurajput0071109@gmail.com', // Sender address
            to: email, // List of recipients
            subject: 'Verification Code', // Subject line
            text: `Dear User,\nYour OTP for registering to our authentication service is ${otp}`, // Plain text body
            html: `<div>Dear User, <br>Your OTP for registering to our authentication service is <b>${otp}</b></div>`
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("Mail Send");
            }
        })
        res.status(200).json({ message: "OTP send successfully !!" });
    }
    else {
        res.status(404).json({ message: "Please fill all the fields" });
    }
}
const requestMobileOTP = function (req, res){
    const {mobileno} = req.body;
    if(mobileno){
        var otp = Math.random();
        otp = otp * 1000000;
        otp = parseInt(otp);
        Otp.deleteMany({ mobileno: mobileno }, function (err, foundotp) {
            if (err) {
                res.status(402).josn({ message: "err" });
            }
            else {
                console.log('deleted older otps')
            }
        })
        Otp.create({ email: "",mobileno:mobileno, otp: otp });
         try{

            client.messages
            .create({
                body:  `Dear User, Your OTP for registering to our authentication service is ${otp}`, // Plain text body,
                from: process.env.TWILIO_MOBILE_NUMBER,
                to: '+91'+mobileno
            })
            .then(message => console.log(message.sid));
        }
        catch(e){
            console.log("Error :", e);
            req.status(404).json({message: "Mobile number not found"});
        }
        res.status(200).json({ message: "OTP resend to the mobile number" });
    }
}
const login = async function (req, res) {
    const { email, password, mobileNo } = req.body;
    if (email && password) {

        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
          res.status(404).json({ message: "User not found in the data base" });
        } 
        
          
        else {
            if (foundUser.verified) {
                const passwordMatch = await bcrypt.compare(password, foundUser.password);
                if (passwordMatch) {
                    const jwtToken = jwt.sign(
                      { id: foundUser.id, email: foundUser.email, name: foundUser.name },
                      process.env.JWT_SECRET
                    );
                  
                    res.status(200).json({ message: "Successfully loged in", token: jwtToken });
                } 
                else res.status(404).json({ message: "User not found in the data base" });
            }
            else {
                res.status(205).json({ message: "User Not verified, verify first", state: 2 });
            }
        }
               
    }
    else if (mobileNo && password) {

        const foundUser = await User.findOne({ mobileno: mobileNo });
        if (!foundUser) {
          res.status(404).json({ message: "User not found in the data base" });
        } 
        
          
        else {
            if (foundUser.verified) {
                const passwordMatch = await bcrypt.compare(password, foundUser.password);
                if (passwordMatch) {
                    const jwtToken = jwt.sign(
                      { id: foundUser.id, email: foundUser.email },
                      process.env.JWT_SECRET
                    );
                  
                    res.status(200).json({ message: "Successfully loged in", token: jwtToken });
                } 
                else res.status(404).json({ message: "User not found in the data base" });
            }
            else {
                res.status(205).json({ message: "User Not verified, verify first", state: 2 });
            }
        }
               
    }
    else {
        res.status(404).json({ message: "Please fill all the fields" });
    }
}
const otpverify = function (req, res) {
    const { email, otp } = req.body;
    if (email && otp) {
        Otp.findOne({ email: email }, function (err, foundotp) {
            if (err) {
                res.status(300).json({ message: "Error occured" });
            }
            if (!foundotp) return res.status(200).json({ message: "Wrong otp" });
            if (otp === foundotp.otp) {
                User.findOne({ email: email }, function (err, founduser) {
                    if (err) {
                        res.status(300).json({ message: "Error occured" });
                    }
                    if(founduser){

                        founduser.verified = true;
                        founduser.save();
                        return res.status(201).json({ message: "OTP is correct !!" });
                    }
                    else {
                        return res.status(404).json({message: "User not found"})
                    }

                })
            }
            else {
                return res.status(200).json({ message: "OTP just entered is wrong" })
            }
        })
    }
    else {
        return res.status(404).json({ message: "Please fill all the fields" });
    }
}
const mobileotpverify = function (req, res) {
    const { mobileno, otp } = req.body;
    if (mobileno && otp) {
        Otp.findOne({ mobileno: mobileno }, function (err, foundotp) {
            if (err) {
                res.status(300).json({ message: "Error occured" });
            }
            if (!foundotp) res.status(200).json({ message: "Wrong otp" });
            if (otp === foundotp.otp) {
                User.findOne({ mobileno: mobileno }, function (err, founduser) {
                    if (err) {
                        res.status(300).json({ message: "Error occured" });
                    }
                    if(founduser){

                        founduser.verified = true;
                        founduser.save();
                        res.status(200).json({ message: "OTP is correct !!" });
                    }
                    else {
                        res.status(404).json({message: "User not found"})
                    }

                })
            }
            else {
                res.status(200).json({ message: "OTP just entered is wrong" })
            }
        })
    }
    else {
        res.status(404).json({ message: "Please fill all the fields" });
    }
}

module.exports = {
    signup,
    login,
    otpverify,
    requestotp,
    requestMobileOTP,
    mobileotpverify
}