const Comment = require("../models/comment");
const Task = require("../models/task");
async function create(req, res) {
    try {
        const { taskId } = req.query;
        const {comment} = req.body;
        const task = await Task.findOne({_id : taskId});
        if(task){

            const commentCreated = await Comment.create({
                task : taskId,
                commenter : req.user._id,
                comment
            });
            task.comments.push(commentCreated._id);
            task.save();
            
            commentCreated.commenter = req.user;
            res.status(201).json({message:"Comment Added to Task", comment:commentCreated})
        }
        else {
            res.status(200).json({message : "Task not found!"});
        }
    } catch (e){
        console.log(e);
        res.status(500).json({message:"Error in adding comment"});
    }
}

async function get(req, res) {
    try {
        const { commenId } = req.query;
 
        const comment = await Comment.findOne({_id : commenId}).populate("commenter");
        if(comment){
            res.status(201).json({message:"Comment Added to Task", comment})
        }
        else {
            res.status(205).json({message : "Comment not found!"});
        }
        
    } catch (e){
        console.log(e);
        res.status(500).json({message:"Error in updating profile picture"});
    }
}
module.exports = {create, get};