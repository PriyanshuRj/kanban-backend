const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: "User"
    },
    reciepent: {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref  :"User"
    }, 
    text:{
        type:String,
        required:true,
    }    
}, 
{ timestamps: true })

const Message = mongoose.model('Message',messageSchema);
module.exports = Message;