const Invite   = require("../models/invite");
const Project =  require("../models/project");
const transporter = require('../config/transoprter')
const {getInviteTemplate} = require("../helpers/inviteTemplate");
const User = require("../models/usermodel");
async function create (req,res){
    try {

        const { email, projectId,username="Priyanshu Rajput" } = req.body;
        if (email && projectId ) {
            const project = await Project.findOne({_id: projectId})
            if(project){
                const invite = await Invite.create({
                    email, 
                    project:project._id,
                    projectName: project.title,
                    senderName: username
                });
                const mailOptions = {
                    from: process.env.EMAIL_USEREMAIL, // Sender address
                    to: email, // List of recipients
                    subject: `Invite to join ${project.title}`, // Subject line
                  
                    html: getInviteTemplate(process.env.FRONTEND_URL, `http://localhost:3000/invite/${invite._id}`, username, project.title )
                };
            
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Mail Send");
                    }
                });
            }
            
            else {
                res.status(404).json({message:"Project not found"})
            }
           
            
            res.status(201).json({ message: "Invite Sent" });
        }
        else {
            res.status(404).json({ message: "Please send complete details" })
        }
    }
    catch (e) {
        res.status(500).json({ message: "Error in sending invite" });
        console.log("error", e)
    }
}

async function getInvite(req, res){
    try {
        const { inviteId } = req.query;
        const invite = await Invite.findOne({_id: inviteId});
        if(invite){
            if(invite.email== req.user.email){

                return res.status(200).json({message:"Successfully fetched Invite Details", invite})
            }
            else return res.status(205).json({message:"Invite Not Ment for You"});
        }
        else {
            return res.status(300).json({message:"Invite not Found"})
        }
    }
    catch (e) {
        res.status(500).json({ message: "Error in sending invite" });
        console.log("error", e)
    }
}
async function replyInvite(req, res){
    try {
        console.log("Here")
        const { inviteId } = req.query;
        const { acepted } = req.body;
        const invite = await Invite.findOne({_id: inviteId});
        if(invite){
            if(acepted){
                const project = await Project.findOne({_id: invite.project });
                const acceptingUser = await User.findOne({email:invite.email });
                project.members.push(acceptingUser._id);
                acceptingUser.projects.push(project._id);
                project.save();
                acceptingUser.save();
            }
            await Invite.deleteOne({_id: inviteId});
            return res.status(200).json({message:"Invite Resolved"})
        }
        else {

            return res.status(300).json({message:"Invite not Found"})
        }
    }
    catch (e) {
        res.status(500).json({ message: "Error in sending invite" });
        console.log("error", e)
    }
}
module.exports = {
create,
getInvite,
replyInvite
};