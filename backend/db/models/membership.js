'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Membership.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isExpected(value) {
          if (value != "co-host" && value != "member" && value != "pending")
            throw new Error("Type must be 'co-host' or 'member' or 'pending'");
        }
      },
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: {
        exclude: ["id", "userId", "groupId", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      moreDetails: {
        attributes: {
          include: ["id", "userId", "groupId"]
        }
      },
    }
  });
  return Membership;
};