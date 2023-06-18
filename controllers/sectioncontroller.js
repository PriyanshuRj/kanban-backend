const Section = require('../models/section');
const Project = require("../models/project");
const Task = require("../models/task");
const mongoose = require('mongoose');
const create = async (req, res) =>{
    try{
        const { projectId } = req.query;
        const {title} = req.body;
        if(projectId){
            const project = await Project.findOne({id:projectId});
            const section = await Section.create({
                title:title ? title : '',
                project : projectId
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
    try{
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

            const project = await Project.findOne({_id:section.project});
            await project.sections.remove(sectionId);
            project.save();
            await Task.deleteMany({ section: sectionId });
            await Section.deleteOne({_id:sectionId});
        }

        res.status(200).json({message:"Section deleted"})
    }
    catch (e) {
        res.status(500).json({message:"Internal server error"})
    }
}
module.exports = {
    create,
    update,
    deleteSection
}