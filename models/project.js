const mongoose = require('mongoose');
const projectScheme = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type: String,
        required: false,
    },
    members : {
        type: [mongoose.Schema.ObjectId],
        required: false,
        ref: "User"
    },
    sections : {
        type: [mongoose.Schema.ObjectId],
        required: false,
        ref: "Section",
        default: []
    }
    
})

const Project = mongoose.model('Project',projectScheme);
module.exports = Project;