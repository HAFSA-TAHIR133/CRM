import { fetchNotesService, createNoteWithAttachmentService } from '../services/note.service.js';

export const getNotes = async (req, res) => {
  try {
    const { leadId, taskId } = req.query;

    const notes = await fetchNotesService({ leadId, taskId });

    return res.status(200).json({ 
      success: true, 
      data: notes 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      message: "Server error fetching notes", 
      error: error.message 
    });
  }
};

export const createNote = async (req, res) => {
  try {
    const { content, leadId, taskId } = req.body;
    const userId = req.user.id; // Populated by your auth middleware

    if (!content && !req.file) {
      return res.status(400).json({ 
        success: false,
        message: "Note content or a file attachment is required." 
      });
    }

    const { note, attachment } = await createNoteWithAttachmentService({
      content,
      leadId,
      taskId,
      userId,
      file: req.file
    });

    return res.status(201).json({ 
      success: true, 
      message: "Note added successfully", 
      data: { note, attachment } 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: "Server error creating note", 
      error: error.message 
    });
  }
};