import db from '../models/index.js';

export const createEntry = async (req, res, next) => {
  try {
    const { title, content, mood, tags, date } = req.body;
    const user_id = req.user.id;

    const entry = await db.Entry.create({
      title,
      content,
      mood,
      tags: tags || [],
      date: date || new Date(),
      user_id
    });

    res.status(201).json({
      message: 'Entry created successfully',
      entry
    });
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, mood, startDate, endDate } = req.query;
    const user_id = req.user.id;

    // Build where clause
    const where = { user_id };
    if (mood) {
      where.mood = mood;
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[db.Sequelize.Op.gte] = new Date(startDate);
      if (endDate) where.date[db.Sequelize.Op.lte] = new Date(endDate);
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get entries with pagination
    const { count, rows: entries } = await db.Entry.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']],
      attributes: { exclude: ['user_id'] }
    });

    res.json({
      message: 'Entries retrieved successfully',
      entries,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const entry = await db.Entry.findOne({
      where: { id, user_id },
      attributes: { exclude: ['user_id'] }
    });

    if (!entry) {
      return res.status(404).json({
        error: {
          message: 'Entry not found',
          status: 404
        }
      });
    }

    res.json({
      message: 'Entry retrieved successfully',
      entry
    });
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const { title, content, mood, tags, date } = req.body;
    const entry = req.entry; // Attached by isOwner middleware

    await entry.update({
      title: title || entry.title,
      content: content || entry.content,
      mood: mood || entry.mood,
      tags: tags || entry.tags,
      date: date || entry.date
    });

    res.json({
      message: 'Entry updated successfully',
      entry
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const entry = req.entry; // Attached by isOwner middleware
    await entry.destroy();

    res.json({
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const user_id = req.user.id;

    // Build where clause
    const where = { user_id };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[db.Sequelize.Op.gte] = new Date(startDate);
      if (endDate) where.date[db.Sequelize.Op.lte] = new Date(endDate);
    }

    // Get mood counts
    const moodStats = await db.Entry.findAll({
      where,
      attributes: [
        'mood',
        [db.sequelize.fn('COUNT', db.sequelize.col('mood')), 'count']
      ],
      group: ['mood']
    });

    res.json({
      message: 'Mood statistics retrieved successfully',
      stats: moodStats
    });
  } catch (error) {
    next(error);
  }
};
