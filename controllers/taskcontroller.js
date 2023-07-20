const Section = require('../models/section');
const Coment = require("../models/comment");
const Task = require("../models/task");
const User = require("../models/usermodel");
const mongoose = require('mongoose');
const deleteImageFromGridFS = require("../helpers/deleteImages")
const create = async (req, res) =>{
    try {
        const { sectionId } = req.query;
        const {title, content, position, priority,deadline } = req.body;
        const filenames = req.files.map(obj => obj.filename);
        if(title && sectionId ){
            const task = await Task.create({
                title:title,
                content:content,
                section : sectionId,
                position: position ? position : 0,
                priority : priority ? priority : "Low",
                taskImages : filenames,
                deadline: deadline
            });
            const section = await Section.findOne({_id:sectionId});
            section.tasks.push(task._id);
            section.save();
            res.status(201).json({message:"Task created succesfully", task : task})
        }
        else {
            res.status(400).json({message:"Please provide basic details"})
        }
    }
    catch (e) {
        // console.log(e)
        res.status(500).json({message:"Internal Server error"})
    }
}

const update = async (req,res) =>{
    try{
        const { taskId } = req.query;
        const {title, content, position, priority, deadline,destinationSectionId } = req.body;
        const filenames = req.files.map(obj => obj.filename);
        const task = await Task.findOne({_id : taskId});
        if(destinationSectionId.toString() != task.section.toString()){
            const section = await Section.findOne({_id:destinationSectionId});
            section.tasks.push(taskId);
            section.save();
            const sourceSection = await Section.findOne({_id:task.section.toString()});
            var sectionTasks = [...sourceSection.tasks];
            sectionTasks = sectionTasks.filter((task)=> task.toString() != taskId.toString());
            sourceSection.tasks = sectionTasks;
            sourceSection.save();
        }
        if(title) task.title = title;
        if(content) task.content = content;
        if(position) task.position = position;
        if(priority) task.priority = priority;
        if(deadline) task.deadline = deadline;
        if(destinationSectionId) task.section = destinationSectionId;
        if(filenames && filenames.length) task.taskImages = [ ...task.taskImages, ...filenames];
        task.save();
        res.status(200).json({message:"Task updated succesfully", task:task})
    }
    catch (e) {
        console.log({e})
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

            if (task.taskImages.length) deleteImageFromGridFS(task.taskImages);
        }
        res.status(200).json({message:"Asignees updated succesfully", task:task})
    }
    catch (e) {
        res.status(500).json({message:"Internal Server error"})
    }
}
const updatePosition  = async (req,res) =>{
    try{
        const {
            resourceList,
            destinationList,
            resourceSectionId,
            destinationSectionId
          } = req.body;
          var destinationTasks = [];
          var resourseTasks = [];
          const resourceListReverse = resourceList.reverse()
          const destinationListReverse = destinationList.reverse()
          if ( resourceSectionId !== destinationSectionId ) {
            for (const key in resourceListReverse) {
              await Task.findByIdAndUpdate(
                resourceListReverse[key]._id,
                { $set: { section: resourceSectionId,
                  position: key 
                }}
              )
              resourseTasks.push(resourceListReverse[key]._id);
            }
            const resorceSection = await Section.findOne({_id:resourceSectionId});
            resorceSection.tasks= resourseTasks;
            resorceSection.save();
          }
          
          for ( const key in destinationListReverse) {
            await Task.findByIdAndUpdate(
              destinationListReverse[key]._id,
              { $set: { section: destinationSectionId,
                position: key 
              }}
            )
            destinationTasks.push(destinationListReverse[key]._id);
          }
          const destinationSection = await Section.findOne({_id:destinationSectionId});
          destinationSection.tasks= destinationTasks;
          destinationSection.save();
          
        return res.status(200).json({message:"Swap successfull"});
    }
    catch (e) {

        return res.status(500).json({message:"Internal Server error"})
    }
}
module.exports = {
    create,
    update,
    asignUser,
    deleteTask,
    updatePosition
}