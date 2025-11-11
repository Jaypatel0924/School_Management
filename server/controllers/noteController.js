import Note from '../models/Note.js';
import asyncHandler from 'express-async-handler';

// Get all notes for a user
export const getNotes = asyncHandler(async (req, res) => {
  const { type, status } = req.query;
  const query = {
    userId: req.user._id,
    userType: req.user.role
  };

  if (type) query.type = type;
  if (status) query.status = status;

  const notes = await Note.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Notes fetched successfully',
    data: {
      notes
    }
  });
});

// Create a new note
export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
    userType: req.user.role
  });

  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: {
      note
    }
  });
});

// Update a note
export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
      userType: req.user.role
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    data: {
      note
    }
  });
});

// Delete a note
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
    userType: req.user.role
  });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully'
  });
});

// Get note by ID
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user._id,
    userType: req.user.role
  });

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  res.status(200).json({
    success: true,
    message: 'Note fetched successfully',
    data: {
      note
    }
  });
});

// Update todo status
export const updateTodoStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const note = await Note.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
      userType: req.user.role,
      type: 'todo'
    },
    { status },
    { new: true }
  );

  if (!note) {
    res.status(404);
    throw new Error('Todo not found');
  }

  res.status(200).json({
    success: true,
    message: 'Todo status updated successfully',
    data: {
      note
    }
  });
});