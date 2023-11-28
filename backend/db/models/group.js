'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        through: "Memberships",
        foreignKey: "groupId",
        otherKey: "eventId",
      })
      Group.hasOne(model.User)
      Group.hasMany(model.Event, {
        foreignKey: "groupId",
      })
      Group.hasMany(model.Venue, {
        foreignKey: "groupId",
      })
      Group.hasMany(model.GroupImage, {
        foreignKey: "groupId",
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: DataTypes.STRING,
    about: DataTypes.TEXT,
    type: DataTypes.ENUM,
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};