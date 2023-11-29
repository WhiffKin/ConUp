'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(models.Event, {
        through: "Attendances",
        foreignKey: "userId",
        otherKey: "eventId",
      })
      User.belongsToMany(models.Group, {
        through: "Memberships",
        foreignKey: "userId",
        otherKey: "groupId",
      })
      User.hasMany(models.Group, {
        foreignKey: "organizerId"
      });
    }
  };
  
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
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
      unique:true,
      validate: {
        len: [3,256],
        isEmail: true,
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