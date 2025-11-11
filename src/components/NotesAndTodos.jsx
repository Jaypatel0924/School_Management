import React, { useState, useEffect } from 'react';
import {
  Book,
  CheckSquare,
  Clock,
  Edit,
  Flag,
  MoreVertical,
  Plus,
  Tag,
  Trash2,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NotesAndTodos = () => {
  const [notes, setNotes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'todos'
  const [loading, setLoading] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    type: 'note',
    priority: 'medium',
    dueDate: '',
    tags: [],
    reminderDate: ''
  });
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [activeTab]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/notes?type=${activeTab === 'notes' ? 'note' : 'todo'}`);
      setNotes(response.data.data.notes);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingNote) {
        await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, noteForm);
        toast.success('Note updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/notes', noteForm);
        toast.success('Note created successfully');
      }
      setShowAddModal(false);
      setEditingNote(null);
      resetForm();
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      toast.success('Deleted successfully');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      type: note.type,
      priority: note.priority || 'medium',
      dueDate: note.dueDate ? new Date(note.dueDate).toISOString().split('T')[0] : '',
      tags: note.tags || [],
      reminderDate: note.reminderDate ? new Date(note.reminderDate).toISOString().split('T')[0] : ''
    });
    setShowAddModal(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/notes/${id}/status`, {
        status: newStatus
      });
      toast.success('Status updated');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setNoteForm({
      title: '',
      content: '',
      type: activeTab === 'notes' ? 'note' : 'todo',
      priority: 'medium',
      dueDate: '',
      tags: [],
      reminderDate: ''
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Book className="h-5 w-5 inline-block mr-2" />
            Notes
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'todos'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CheckSquare className="h-5 w-5 inline-block mr-2" />
            To-Do List
          </button>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setEditingNote(null);
            resetForm();
          }}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New
        </button>
      </div>

      {/* Notes/Todos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800">
                {note.title}
              </h3>
              <div className="flex items-center space-x-2">
                <Flag className={`h-4 w-4 ${getPriorityColor(note.priority)}`} />
                <button
                  onClick={() => handleEdit(note)}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 whitespace-pre-line">
              {note.content}
            </p>

            {note.type === 'todo' && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Status:</span>
                <select
                  value={note.status}
                  onChange={(e) => handleStatusChange(note._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}

            {note.dueDate && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                Due: {new Date(note.dueDate).toLocaleDateString()}
              </div>
            )}

            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {editingNote ? 'Edit' : 'Add New'} {activeTab === 'notes' ? 'Note' : 'Todo'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={noteForm.priority}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={noteForm.dueDate}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={noteForm.tags.join(', ')}
                  onChange={(e) =>
                    setNoteForm({
                      ...noteForm,
                      tags: e.target.value.split(',').map((tag) => tag.trim())
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., important, study, project"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesAndTodos;