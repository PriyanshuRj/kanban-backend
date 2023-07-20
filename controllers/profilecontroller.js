const User = require('../models/usermodel');
const mongoose = require('mongoose')
const GridFSBucket = require("mongodb").GridFSBucket;
const conn = mongoose.createConnection(process.env.DB);;
const deleteImageFromGridFS = require("../helpers/deleteImages")

var bucket;
conn.once("open", function () {
    bucket = new GridFSBucket(conn, { bucketName: 'uploads' });
});

const updateProfilePicture = async (req,res)=>{
    try{
    
    const logedInuser = await User.findOne({_id : req.user._id});
    if(logedInuser){
        if(logedInuser.profilePicture) deleteImageFromGridFS([logedInuser.profilePicture]);
        logedInuser.profilePicture = req.file.filename;
        logedInuser.save();
        res.status(200).json({message : "Profile Picture Updated"});
    }
    
    else {
        res.status(404).json({message:"Please login first"})
    }
    }
    catch(e) {
        console.log(e);
        res.status(500).json({message:"Error in updating profile picture"});
    }
}

const updateProfile = async (req,res)=>{
    try{

        var { username, name, mobileno, email } = req.body;
        if(req.user.email !== email){
        const user = await User.findOne({email});
        if(user) {
            return res.status(205).json({message:"Another user with this email exists"});
        }
    }
    if(req.user.mobileno !== mobileno){
        const user = await User.findOne({mobileno});
        if(user) {
            return res.status(205).json({message:"Another user with this mobile number exists"});
        }
    }
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { username: username,
            name: name,
            mobileno:mobileno,
            email: email
        }}
        )
        return res.status(200).json({message: "User updated"});
    }
    catch(e){
        return res.status(500).json({message:"Internal server error"})
    }


}

const getProfile = async (req, res) =>{
    var logedInuser = await User.findOne({_id:req.user._id}).populate({path: 'projects',
    model: 'Project'});
    try {
        var image_message = "";
        if(logedInuser.profilePicture){
            let downloadStream = bucket.openDownloadStreamByName(logedInuser.profilePicture)
            let filedata = "data:image/png;base64,";
            await downloadStream.on("data", function (data) {
                filedata += data.toString('base64');
            });

            await downloadStream.on("error", function (err) {
                image_message="Cannot download the Image!"
                return res.status(404).json({ message: "Cannot download the Image!",user: logedInuser });
            });

            await downloadStream.on("end", () => {
                logedInuser.profilePicture = filedata;
                res.status(200).json({user: logedInuser});
            });
        }
        else {
            res.status(200).json({user: logedInuser});
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"Error in updating profile picture"});
    }
}
module.exports = {
    updateProfile,
    updateProfilePicture,
    getProfile
}