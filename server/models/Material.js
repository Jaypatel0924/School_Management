// import mongoose from 'mongoose';

// const materialSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Please provide material title'],
//     trim: true
//   },
//   description: {
//     type: String,
//     required: [true, 'Please provide material description']
//   },
//   subject: {
//     type: String,
//     required: [true, 'Please provide subject']
//   },
//   grade: {
//     type: String,
//     required: [true, 'Please provide grade'],
//     enum: ['Grade 8', 'Grade 9', 'Grade 10']
//   },
//   section: {
//     type: String,
//     required: [true, 'Please provide section'],
//     enum: ['Section A', 'Section B', 'Section C']
//   },
//   type: {
//     type: String,
//     required: [true, 'Please provide material type'],
//     enum: ['Notes', 'Presentation', 'Worksheet', 'Reference']
//   },
//   attachmentUrl: {
//     type: String,
//     required: [true, 'Please provide attachment URL']
//   },
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Material = mongoose.model('Material', materialSchema);
// export default Material;

import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide material title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide material description']
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject']
  },
  grade: {
    type: String,
    required: [true, 'Please provide grade'],
    enum: ['Grade 8', 'Grade 9', 'Grade 10']
  },
  section: {
    type: String,
    required: [true, 'Please provide section'],
    enum: ['Section A', 'Section B', 'Section C']
  },
  type: {
    type: String,
    required: [true, 'Please provide material type'],
    enum: ['Notes', 'Presentation', 'Worksheet', 'Reference']
  },
  attachmentUrl: {
    type: String,
    required: [true, 'Please provide attachment URL']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Material = mongoose.model('Material', materialSchema);
export default Material;