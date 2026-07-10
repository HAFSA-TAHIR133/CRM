import db from '../models/index.js';
const { Note, Attachment, User } = db;

/**
 * Service to fetch notes based on lead or task filters
 */
export const fetchNotesService = async ({ leadId, taskId }) => {
  const whereClause = {};
  
  if (leadId) whereClause.leadId = leadId;
  if (taskId) whereClause.taskId = taskId;

  return await Note.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Service to handle the creation of a note and an optional file attachment
 */
export const createNoteWithAttachmentService = async ({ content, leadId, taskId, userId, file }) => {
  // Use a Sequelize transaction to guarantee both operations succeed together
  const transaction = await db.sequelize.transaction();

  try {
    // 1. Create the Note entry
    const note = await Note.create({
      content: content || `Uploaded an attachment: ${file?.originalname}`,
      leadId: leadId || null,
      taskId: taskId || null,
      createdBy: userId
    }, { transaction });

    // 2. If a file exists, build the Attachment record
    let attachment = null;
    if (file) {
      attachment = await Attachment.create({
        fileUrl: `/uploads/${file.filename}`,
        fileName: file.originalname,
        leadId: leadId || null,
        taskId: taskId || null
      }, { transaction });
    }

    // Commit changes
    await transaction.commit();
    return { note, attachment };

  } catch (error) {
    // Rollback changes if anything breaks
    await transaction.rollback();
    throw error;
  }
};