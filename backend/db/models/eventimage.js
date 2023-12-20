'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, {
        foreignKey: "eventId",
      })
    }
  }
  EventImage.init({
    eventId: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          arg: [true],
          msg: "URL needs to be a valid URL"
        }
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isBool(value) {
          if (typeof value != "boolean")
            throw new Error("Preview must be a boolean")
        },
      }
    }
  }, {
    sequelize,
    modelName: 'EventImage',
    defaultScope: {
      attributes: {
        exclude: ["eventId", "createdAt", "updatedAt"]
      }
    }
  });
  return EventImage;
};