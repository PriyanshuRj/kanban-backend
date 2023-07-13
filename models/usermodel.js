const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    mobileno:{
        type: Number,
        required: true,
    },
    verified:{
        type:Boolean,
        default: false,
    },
    profilePicture:{
        type:String,
        required : false,
        default: null
    },
    username: {
        type:String,
        required:false,
        default:''
    },
    projects :{
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        default:[],
        ref: "Project"
    }
})

const User = mongoose.model('User',userSchema);
module.exports = User;