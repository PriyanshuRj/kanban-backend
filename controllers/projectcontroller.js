const Project = require("../models/project");
const User = require("../models/usermodel");

const createProject = async (req,res) =>{
    try {

        const {title,description} = req.body;
        if(title && description){
            
            const project  = await Project.create({
                owner: req.user._id,
                title:title,
                description: description,
                members : [req.user._id]
            });
            const logedInUser = await User.findOne({id:req.user._id});
            logedInUser.projects.push(project._id);
            logedInUser.save();
            res.status(200).json({message:"Project created", project: project});
        }
    }
    catch (e){
        res.status(500).json({message:"Error in creating project"});
        console.log("error", e)
    }

}

const getAllProjects = async (req,res) =>{
    const projects = await Project.find({});
    res.status(200).json({messgae:"Here are all the projects", projects:projects})
}

module.exports = {
    createProject,
    getAllProjects
}