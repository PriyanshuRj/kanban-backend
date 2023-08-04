const Project = require("../models/project");
const User = require("../models/usermodel");
const Section = require('../models/section');
const Task = require("../models/task");
const mongoose = require('mongoose');
const deleteImageFromGridFS = require("../helpers/deleteImages")

const createProject = async (req, res) => {
    try {

        const { title, description } = req.body;
        if (title) {

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
            populate: {
                path: "tasks",
                populate: [
                    {path: "assignies",
                    select: {
                        name: 1,
                        _id:1,
                        email:1
                    }
                },
                    {
                    
                        path : "comments",
                        select : {
                            comment :1,
                            commenter: 1,
                        },
                        populate : {
                            path : "commenter",
                            select :{
                                name: 1
                            }
                        }
                    }
                ],
             
            }
        }
        ).populate({
            path : "members",
            select: {
                name: 1,
                _id:1,
                email:1
            }
        });
        if(project)
        return res.status(200).json({ message: "Found the project", project: project });
        else res.status(205).json({message : "Project not found"});

    }
    catch (e) {
        res.status(500).json({ message: "Error in creating project" });
        console.log("error", e)
    }
}
const update = async (req, res) => {
    try {
        const { projectId } = req.query;
        const { title, description } = req.body;
        const project = await Project.findOne({ _id: projectId });
        if (project) {
            if (title) project.title = title;
            if (description) project.description = description;
            project.save();
            res.status(200).json({ message: "Project Updated", project: project })
        }
        else {
            res.status(404).json({ message: "Projet not found" })
        }
    }
    catch (e) {
        res.status(500).json({ message: "Error in creating project" });
        console.log("error", e)
    }
}
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.query;
        console.log({projectId})
        // Start a MongoDB session to ensure atomicity of operations

        var ImageArray = [];
        const session = await mongoose.startSession();
        session.startTransaction();

        // Delete user and related posts and comments
        await Project.findByIdAndDelete(projectId, { session }); 

        const projectSections = await Section.find({ project: projectId }, { _id: 1 }).session(session);
        const sectionIds = projectSections.map((section) => section._id);

        const tasks = await Task.find({ post: { $in: sectionIds } }, { _id: 1,  taskImages : 1}).session(session);

        await Section.deleteMany({ project: projectId }, { session }); 
        await Task.deleteMany({ post: { $in: sectionIds } }, { session }); 

        // Delete images related to the comments
        await tasks.map(async (task)=> {
            if(task.taskImages && task.taskImages.length > 0){
                ImageArray = [...ImageArray, ...task.taskImages];
            }
        })
        deleteImageFromGridFS(ImageArray);
        // Commit the transaction and close the session
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({message:"Project Deleted Succesfully"});
    }
    catch (e) {
        res.status(500).json({ message: "Error in creating project" });
        console.log("error", e)
    }
}
module.exports = {
    createProject,
    getAllProjects,
    getSingleProjectData,
    update,
    deleteProject
}