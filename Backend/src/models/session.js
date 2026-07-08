export default (sequelize,DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deviceInfo: {           // e.g., "Chrome on Windows"
      type: DataTypes.STRING,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'Sessions'
  });

  Session.associate = (models) => {
    Session.belongsTo(models.User, { 
      foreignKey: 'userId', 
      as: 'user' 
    });
  };

  return Session;
};