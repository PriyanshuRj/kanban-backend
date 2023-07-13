const User = require('../models/usermodel');
const mongoose = require('mongoose')
const GridFSBucket = require("mongodb").GridFSBucket;
const conn = mongoose.createConnection(process.env.DB);;

var bucket;
conn.once("open", function () {
    bucket = new GridFSBucket(conn, { bucketName: 'uploads' });
    console.log('connected api')
});

const updateProfilePicture = async (req,res)=>{
    try{

    
    const logedInuser = await User.findOne({id : req.user._id});
    if(logedInuser){
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
    const {username} = req.body;


}

const getProfile = async (req, res) =>{
    var logedInuser = await User.findOne({_id:req.user._id}).populate({path: 'projects',
    model: 'Project'});
    console.log(logedInuser)
    try {
        var image_message = "";
        if(logedInuser.profilePicture){
            let downloadStream = bucket.openDownloadStreamByName(logedInuser.profilePicture)
            let filedata = "data:image/png;base64,";
            await downloadStream.on("data", function (data) {
                console.log("called")
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