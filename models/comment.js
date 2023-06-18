const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    task:{
        type: [mongoose.Schema.ObjectId],
        required: false,
        ref: "Task"
    },
    comment:{
        type:String,
        required:true,
    }    
})

const Coment = mongoose.model('Coment',commentSchema);
module.exports = Coment;