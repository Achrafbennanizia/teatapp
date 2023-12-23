const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();

    if (!notes.length) {
        return res.status(404).json({ message: 'No notes found' });
    }

    res.json(notes);
});

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    if (!user || !title) {
        return res.status(400).json({ message: 'User and title are required fields' });
    }

    const duplicate = await Note.findOne({ title }).lean();

    if (duplicate) {
        return res.status(409).json({ message: 'A note with the same title already exists' });
    }

    const newNote = await Note.create({ user, title, text });

    res.status(201).json({ message: `New note "${title}" has been created` });
});

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    if (!id || !user || !title) {
        return res.status(400).json({ message: 'Note ID, user, and title are required fields' });
    }

    const note = await Note.findById(id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    const duplicate = await Note.findOne({ title, _id: { $ne: id } });

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    note.user = user;
    note.title = title;
    note.text = text || ''; // Set text to an empty string if not provided
    note.completed = completed || false; // Set completed to false if not provided

    await note.save();

    res.json({ message: `${title} updated` });
});

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Note ID required' });
    }

    const note = await Note.findById(id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    const { title } = note;
    const result = await note.deleteOne();

    if (result.deletedCount === 1) {
        res.json({ message: `Note "${title}" deleted` });
    } else {
        res.status(500).json({ message: 'Error deleting note' });
    }
});

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
};
