const mongoose = require('mongoose');
const inviteSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },

    project:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    }
})

const Invite = mongoose.model('Invite',inviteSchema);
module.exports = Invite;