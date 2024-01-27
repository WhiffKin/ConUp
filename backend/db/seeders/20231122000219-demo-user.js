'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: "Demo",
        lastName: "Lition",
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Jeremy",
        lastName: "Ottem",
        email: 'ethicalHacker@gmail.com',
        username: 'JWhiteHat',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Kyle",
        lastName: "McQuire",
        email: 'fireHeadedKyle@yahoo.com',
        username: 'LinkMain',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "West",
        lastName: "Chester",
        email: '3nja8E9s@gmail.com',
        username: 'Agent0',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Gregory",
        lastName: "Varner",
        email: 'kingGV@aol.com',
        username: 'KingGreg23',
        hashedPassword: bcrypt.hashSync('password')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'KingGreg23', 'JWhiteHat', 'LinkMain', 'Agent0', ''] }
    }, {});
  }
};