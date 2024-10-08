const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const taskSchema = new Schema({
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  title: {
    type: String,
    default: 'New Task',
  },
  content: {
    type: String,
    default:'New Task to be done'
  },
  position: {
    type: Number,
  },
  priority: {
    type:"String",
    required: false,
    default:"Low"
  },
  assignies:{
    type: [mongoose.Schema.ObjectId],
    required: false,
    ref: "User"
  },
  comments:{
    type: [mongoose.Schema.ObjectId],
    required: false,
    ref: "Coment"
  },
  taskImages: {
    type:[String],
    required:false,
    default:[]
  },
  deadline: {
    type: "String",
    required: false
  }
}, schemaOptions)

module.exports = mongoose.model('Task', taskSchema)