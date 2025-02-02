import { Sequelize } from 'sequelize';
import UserModel from '../models/user.model.js';
import EntryModel from '../models/entry.model.js';

const sequelize = new Sequelize('postgresql://journal_app_db_c496_user:CGBh2pZUfWIZuku5abLeiI18tVDrTxeO@dpg-cu4rmq5ds78s73ds0nm0-a.oregon-postgres.render.com/journal_app_db_c496', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    underscored: true,
    timestamps: true
  }
});

const User = UserModel(sequelize);
const Entry = EntryModel(sequelize);
await sequelize.sync();

const db = {
  sequelize,
  User,
  Entry
};

const mockEntries = [
  {
    mood: 'excited',
    title: 'Started My New Project!',
    content: 'Finally kicked off the project I\'ve been planning for months. The initial setup went smoothly, and I\'m really excited about the potential impact. The team seems enthusiastic, and we\'ve already made significant progress on the architecture.',
    tags: ['work', 'coding', 'achievement'],
    date: '2025-02-01'
  },
  {
    mood: 'peaceful',
    title: 'Weekend Meditation Retreat',
    content: 'Spent the morning at a local meditation center. The silence and stillness were exactly what I needed. Feeling centered and ready for the week ahead. The guided sessions really helped me understand mindfulness better.',
    tags: ['meditation', 'wellness', 'self-care'],
    date: '2025-01-28'
  },
  {
    mood: 'anxious',
    title: 'Big Presentation Tomorrow',
    content: 'Can\'t stop thinking about tomorrow\'s presentation to the board. I\'ve prepared thoroughly, but there\'s still this nagging feeling. Going through my slides one more time. Need to remember to breathe and stay focused.',
    tags: ['work', 'stress', 'presentation'],
    date: '2025-01-25'
  },
  {
    mood: 'happy',
    title: 'Family Game Night',
    content: 'Had an amazing evening with family playing board games. Mom\'s lasagna was incredible as always, and we couldn\'t stop laughing at Dad\'s attempts at charades. These moments are precious.',
    tags: ['family', 'fun', 'memories'],
    date: '2025-01-22'
  },
  {
    mood: 'sad',
    title: 'Missing Old Friends',
    content: 'Saw some old photos from college today. Really missing the daily hangouts and spontaneous adventures with friends. Everyone\'s so busy with their lives now. Should organize a virtual meetup soon.',
    tags: ['friends', 'nostalgia', 'reflection'],
    date: '2025-01-19'
  },
  {
    mood: 'angry',
    title: 'Traffic and Late Meeting',
    content: 'Terrible commute today due to unexpected road work. Then the client meeting ran an hour over schedule. Feeling frustrated about the wasted time and poor planning. Need to find better ways to handle these situations.',
    tags: ['work', 'stress', 'traffic'],
    date: '2025-01-16'
  },
  {
    mood: 'neutral',
    title: 'Regular Tuesday',
    content: 'Nothing particularly special today. Caught up on some emails, had lunch at the usual spot. Sometimes these ordinary days are nice too. Managed to finish that book I\'ve been reading.',
    tags: ['routine', 'daily-life'],
    date: '2025-01-13'
  },
  {
    mood: 'excited',
    title: 'Booked My Dream Vacation!',
    content: 'Finally pulled the trigger and booked that trip to Japan! Been saving up for this for so long. Can\'t wait to explore the temples, try authentic ramen, and experience the cherry blossom season.',
    tags: ['travel', 'adventure', 'dreams'],
    date: '2025-01-10'
  },
  {
    mood: 'peaceful',
    title: 'Early Morning Walk',
    content: 'Woke up early for a walk in the park. The morning air was crisp, and the sunrise was beautiful. Spotted some birds and enjoyed the solitude. Perfect way to start the day.',
    tags: ['nature', 'exercise', 'morning'],
    date: '2025-01-07'
  },
  {
    mood: 'happy',
    title: 'Surprise Visit from Sister',
    content: 'My sister dropped by unexpectedly with her new puppy! Spent the afternoon catching up and playing with the little furball. She always knows how to brighten my day.',
    tags: ['family', 'surprise', 'pets'],
    date: '2025-01-04'
  }
];

const createMockEntries = async () => {
  try {
    // Find test user
    const user = await db.User.findOne({
      where: {
        email: 'testuser789@example.com'
      }
    });

    if (!user) {
      console.error('Test user not found. Please run create-test-user.js first.');
      process.exit(1);
    }

    console.log('Creating mock entries for user:', user.username);

    // Create entries
    const createdEntries = await Promise.all(
      mockEntries.map(entry =>
        db.Entry.create({
          ...entry,
          user_id: user.id
        })
      )
    );

    console.log('Successfully created mock entries:', createdEntries.length);
    console.log('Sample entry:', createdEntries[0].toJSON());

    // Close database connection
    await db.sequelize.close();
  } catch (error) {
    console.error('Error creating mock entries:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

createMockEntries();
