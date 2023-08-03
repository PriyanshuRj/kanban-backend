const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    task:{
        type: [mongoose.Schema.ObjectId],
        required: false,
        ref: "Task"
    },
    commenter: {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref  :"User"
    }, 
    comment:{
        type:String,
        required:true,
    }    
})

const Coment = mongoose.model('Coment',commentSchema);
module.exports = Coment;