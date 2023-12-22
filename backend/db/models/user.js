'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(models.Event, {
        through: models.Attendance,
        foreignKey: "userId",
        otherKey: "eventId",
      })
      User.belongsToMany(models.Group, {
        as: "Orgs",
        through: models.Membership,
        foreignKey: "userId",
        otherKey: "groupId",
      })
      User.hasMany(models.Group, {
        foreignKey: "organizerId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  };
  
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:{
        args: true,
        msg: "Username must be unique."
      },
      validate: {
        len: [4,30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:{
        args: true,
        msg: "Email must be unique."
      },
      validate: {
        len: [3,256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60,60],
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "updatedAt", "email", "createdAt"]
      }
    },
    scopes: {
      nameAndId: {
        attributes: {
          exclude: ["username"]
        }
      }
    }
  });
  return User;
};