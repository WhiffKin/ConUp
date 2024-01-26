'use strict';
const {
  Model
} = require('sequelize');


const isAfterTime = (start, end) => {
  const startStr = startDate
    .split("")
    .filter(el => +el == el)
    .join("");
  const endStr = endDate
    .split("")
    .filter(el => +el == el)
    .join("");
  
  const startDate = +startStr.slice(0, 8);
  const startTime = +startStr.slice(-4);
  const endDate = +endStr.slice(0, 8);
  const endTime = +endStr.slice(-4);

  return startDate > endDate && startTime < endTime;
}

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId",
      })

      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      })

      Event.belongsTo(models.Group, {
        foreignKey: "groupId",
      })

      Event.belongsTo(models.Venue, {
        foreignKey: "groupId",
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Venues",
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        isLen5(value) {
          if (value.length < 5) 
            throw new Error("Name must be at least 5 characters")
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        isLen5(value) {
          if (!value.length) 
            throw new Error("Description is required")
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isExpected(value) {
          if (value != "In person" && value != "Online")
            throw new Error("Type must be 'Online' or 'In person'");
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Capacity must be an integer"
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        min: 0,
        twoDecimal(value) {
          this.price = (Math.round(value * 100) / 100).toFixed(2);
        }
      }
    },
    startDate: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isAfter: {
          args: [sequelize.NOW],
          msg: "Start date must be in the future"
        }
      }
    },
    endDate: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isAfter: {
          args: [this.startDate],
          msg: "End date is less than start date"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
    scopes: {
      groupSearch: {
        attributes: {
          exclude: ["capacity", "price"]
        }
      }
    }
  });
  return Event;
};