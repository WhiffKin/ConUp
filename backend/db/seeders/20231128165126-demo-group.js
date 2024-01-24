'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Wreckfest",
        about: "We love a good old fashioned derby, watching cars slam into other cars and parts go flying!",
        type: "In person",
        private: false,
        city: "Bonebreaker Valley",
        state: "New Mexico",
      },
      {
        organizerId: 2,
        name: "DefaultName",
        about: "Insert text here.",
        type: "In person",
        private: false,
        city: "New York",
        state: "New York",
      },
      {
        organizerId: 3,
        name: "Fake Event",
        about: "Free 100000 dollar for join",
        type: "Online",
        private: true,
        city: "Ashburn",
        state: "Virginia",
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
