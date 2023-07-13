const Project = require("../models/project");
const User = require("../models/usermodel");

const createProject = async (req, res) => {
    try {

        const { title, description } = req.body;
        console.log(req.body)
        if (title ) {

            const project = await Project.create({
                owner: req.user._id,
                title: title,
                description: description,
                members: [req.user._id]
            });
            const logedInUser = await User.findOne({ _id: req.user._id });
            logedInUser.projects.push(project._id);
            logedInUser.save();
            res.status(201).json({ message: "Project created", project: project });
        }
        else {
            res.status(404).json({ message: "Please send complete details" })
        }
    }
    catch (e) {
        res.status(500).json({ message: "Error in creating project" });
        console.log("error", e)
    }

}

const getAllProjects = async (req, res) => {
    const projects = await Project.find({});
    res.status(200).json({ messgae: "Here are all the projects", projects: projects })
}

const getSingleProjectData = async (req, res) => {
    try {

        const { projectId } = req.query;
        const project = await Project.findOne({ _id: projectId }).populate({
            path: "sections",
            populate : {
                path:"tasks",
                populate : {
                    path:"assignies"
                }
            }
        }
        ).populate("members");
     
        res.status(200).json({ message: "Found the project", project: project })

    }
    catch (e) {
        res.status(500).json({ message: "Error in creating project" });
        console.log("error", e)
    }
}
const update = async (req, res) =>{
    try {
        const projectId = req.query;
        const { title, description } = req.body;
        const project = await Project.findOne({id : projectId});
        if(project){
            if(title) project.title = title;
            if(description) project.description = description;
            project.save();
            res.status(200).json({message:"Project Updated", project : project})
        }
        else {
            res.status(404).json({message:"Projet not found"})
        }
    }
    catch (e) {
        res.status(500).json({ message: "Error in creating project" });
        console.log("error", e)
    }
}
const deleteProject = async (req, res) => {

}
module.exports = {
    createProject,
    getAllProjects,
    getSingleProjectData,
    update,
    deleteProject
}