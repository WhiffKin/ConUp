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
        otherKey: "userId",
      })
      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
      })
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
      })
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        isLessThan60(value) {
          if (value.length > 60)
            throw new Error("Name must be 60 charactes or less");
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
      validate: {
        isMoreThan50(value) {
          if (value.length < 50) 
            throw new Error("About must be 50 characters or more");
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isExpected(value) {
          if (value != "In Person" && value != "Online")
            throw new Error("Type must be 'Online' or 'In Person'");
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      validate: {
        isBool(value) {
          if (typeof value != "boolean") 
            throw new Error("Private must be a boolean");
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        isNotEmpty(value) {
          if (value == "")
            throw new Error("City is required");
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        isNotEmpty(value) {
          if (value == "")
            throw new Error("State is required");
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};