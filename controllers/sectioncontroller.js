const Section = require('../models/section');
const Project = require("../models/project");
const Task = require("../models/task");
const mongoose = require('mongoose');
const deleteImageFromGridFS = require("../helpers/deleteImages")

const create = async (req, res) =>{
    try{
        const { projectId } = req.query;
        const {title, color} = req.body;
        if(projectId){
            const project = await Project.findOne({_id:projectId});
            const section = await Section.create({
                title:title ? title : '',
                project : projectId,
                color : color
            })
            project.sections.push(section._id);
            project.save();
            res.status(201).json({message:"Section Created Succesfully", section:section})
        }
        else {
            res.status(404).json({message:"Please provide projectid"})
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({message:"Internal server error"})
    }
}
const update = async(req, res) =>{
    try {
        const { sectionId } = req.query;
        const {title} = req.body;
        const section = await Section.findOne({id:sectionId});
        section.title = title;
        section.save();
        res.status(200).json({message:"Section updated", section:section})
    }
    catch (e) {
        res.status(500).json({message:"Internal server error"})
    }
}
const deleteSection = async (req, res) =>{
    try{
        const { sectionId } = req.query;
        const section = await Section.findOne({_id : sectionId});
        if(section){
            var ImageArray = [];
            const project = await Project.findOne({_id:section.project});
            await project.sections.remove(sectionId);
            project.save();
            const tasks = await Task.find({section: sectionId});
            await tasks.map(async (task)=> {
                if(task.taskImages && task.taskImages.length > 0){
                    ImageArray = [...ImageArray, ...task.taskImages];
                }
            })
            await Task.deleteMany({ section: sectionId });
            await Section.deleteOne({_id:sectionId});
            deleteImageFromGridFS(ImageArray);
        }

        res.status(200).json({message:"Section deleted"})
    }
    catch (e) {
        console.log({e})
        res.status(500).json({message:"Internal server error"})
    }
}
module.exports = {
    create,
    update,
    deleteSection
}