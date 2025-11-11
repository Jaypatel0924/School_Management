import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    userType: {
      type: String,
      required: true,
      // align with the values used in the User model (lowercase)
      enum: ['student', 'teacher', 'admin']
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['note', 'todo']
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    dueDate: {
      type: Date
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    tags: [{
      type: String,
      trim: true
    }],
    reminderDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
noteSchema.index({ userId: 1, type: 1 });
noteSchema.index({ dueDate: 1 }, { sparse: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;