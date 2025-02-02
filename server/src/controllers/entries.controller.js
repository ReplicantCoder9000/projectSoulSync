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
    console.log('Entries Controller: Starting getEntries request');
    console.log('Entries Controller: User:', {
      id: req.user.id,
      email: req.user.email
    });
    console.log('Entries Controller: Headers:', {
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      contentType: req.headers['content-type']
    });
    console.log('Entries Controller: Query params:', req.query);

    const { page = 1, limit = 10, mood, startDate, endDate } = req.query;
    const user_id = req.user.id;

    // Validate pagination params
    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.min(100, Math.max(1, parseInt(limit)));

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

    console.log('Entries Controller: Query parameters:', {
      where,
      page: validatedPage,
      limit: validatedLimit,
      offset: (validatedPage - 1) * validatedLimit
    });

    // Get entries with pagination
    const { count, rows: entries } = await db.Entry.findAndCountAll({
      where,
      limit: validatedLimit,
      offset: (validatedPage - 1) * validatedLimit,
      order: [['date', 'DESC']],
      attributes: { exclude: ['user_id'] }
    });

    console.log('Entries Controller: Database query result:', {
      totalCount: count,
      retrievedCount: entries.length,
      firstEntryId: entries[0]?.id,
      lastEntryId: entries[entries.length - 1]?.id
    });

    // Validate entries array
    if (!Array.isArray(entries)) {
      console.error('Entries Controller: Invalid entries format:', entries);
      throw new Error('Database returned invalid entries format');
    }

    const response = {
      message: 'Entries retrieved successfully',
      entries: entries.map(entry => entry.toJSON()),
      pagination: {
        total: count,
        page: validatedPage,
        pages: Math.ceil(count / validatedLimit),
        limit: validatedLimit
      }
    };

    console.log('Entries Controller: Sending response:', {
      entriesCount: response.entries.length,
      pagination: response.pagination,
      firstEntry: response.entries[0]?.id
    });

    res.json(response);
  } catch (error) {
    console.error('Entries Controller: Error in getEntries:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
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
