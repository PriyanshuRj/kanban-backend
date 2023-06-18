const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const sectionSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    default: 'New Project',
  },
  tasks : {
    type: [mongoose.Schema.ObjectId],
    required: false,
    ref: "Task",
    default : []
  }
}, schemaOptions)

module.exports = mongoose.model('Section', sectionSchema)