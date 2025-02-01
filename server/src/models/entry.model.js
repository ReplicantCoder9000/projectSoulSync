import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Entry = sequelize.define('Entry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    mood: {
      type: DataTypes.ENUM,
      values: ['happy', 'sad', 'angry', 'anxious', 'neutral', 'excited', 'peaceful'],
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'entries',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['user_id', 'date']
      },
      {
        fields: ['mood']
      }
    ]
  });

  Entry.associate = (models) => {
    Entry.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
  };

  return Entry;
};
