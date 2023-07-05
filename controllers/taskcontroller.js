const Section = require('../models/section');
const Coment = require("../models/comment");
const Task = require("../models/task");
const User = require("../models/usermodel");
const mongoose = require('mongoose');

const create = async (req, res) =>{
    try {
        const { sectionId } = req.query;
        const {title, content, position, priority } = req.body;
        console.log("These are the files", req.files);
        const filenames = req.files.map(obj => obj.filename);
        if(title && sectionId && content){
            const task = await Task.create({
                title:title,
                content:content,
                section : sectionId,
                position: position ? position : 0,
                priority : priority ? priority : "Low",
                taskImages : filenames
            });
            const section = await Section.findOne({id:sectionId});
            section.tasks.push(task.id);
            section.save();
            res.status(201).json({message:"Task created succesfully", task : task})
        }
        else {
            res.status(400).json({message:"Please provide basic details"})
        }
    }
    catch (e) {
        res.status(500).json({message:"Internal Server error"})
    }
}

const update = async (req,res) =>{
    try{
        const { taskId } = req.query;
        const {title, content, position, priority } = req.body;
        const task = await Task.findOne({_id : taskId});
        if(title) task.title = title;
        if(content) task.content = content;
        if(position) task.position = position;
        if(priority) task.priority = priority;
        task.save();
        res.status(200).json({message:"Task updated succesfully", task:task})
    }
    catch (e) {
        res.status(500).json({message:"Internal Server error"})
    }
}
const asignUser = async (req,res) =>{
    try{
        const { taskId } = req.query;
        const { asignee } = req.body;
        
        const task = await Task.findOne({_id : taskId});
        if(task && asignee){

            const newAsignee = await User.findOne({email : asignee});
            if(newAsignee){

                task.assignies.push(newAsignee._id);
                task.save();
                res.status(200).json({message:"Asignees updated succesfully", task:task})
            }
            else {
                res.status(400).json({message: "Please provide valid email for existing user"})
            }
        }
        else {
            res.status(400).json({message:"Please provide all the credentials"})
        }
    }
    catch (e) {
        console.log("error",e)
        res.status(500).json({message:"Internal Server error"})
    }
}
const deleteTask = async (req,res) =>{
    try{
        const { taskId } = req.query;
        const task = await Task.findOne({_id : taskId});
        if(task){
            const section = await Section.findOne({_id:task.section});
            await section.tasks.remove(taskId);
            section.save();
            await Coment.deleteMany({ task: taskId });
            await Task.deleteOne({_id:taskId});
        }
        res.status(200).json({message:"Asignees updated succesfully", task:task})
    }
    catch (e) {
        res.status(500).json({message:"Internal Server error"})
    }
}
module.exports = {
    create,
    update,
    asignUser,
    deleteTask
}