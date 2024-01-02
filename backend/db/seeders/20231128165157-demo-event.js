'use strict';

const { Event } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: "Wreckfest at Bonebreaker",
        description: "A demolition derby being held at Bonebreaker Valley.",
        type: "In person",
        capacity: 64,
        price: 30,
        startDate: "11-28-2023",
        endDate: "11-30-2023",
      },
      {
        venueId: 2,
        groupId: 2,
        name: "DefaultEvent",
        description: "Insert text here",
        type: "In person",
        capacity: 64,
        price: 80,
        startDate: "11-28-2024",
        endDate: "11-30-2024",
      },
      {
        venueId: null,
        groupId: 3,
        name: "Free Money Hack",
        description: "Join for free money 6000230 monies",
        type: "Online",
        capacity: 0,
        price: 3000,
        startDate: "11-28-2080",
        endDate: "11-30-2080",
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
