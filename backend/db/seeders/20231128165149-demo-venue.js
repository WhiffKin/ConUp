'use strict';

const { Venue } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: "666 Bonebreaker Blvd",
        city: "Bonebreaker Valley",
        state: "New Mexico",
        lat: 33.570388,
        lng: -106.793535
      },
      {
        groupId: 2,
        address: "770 Broadway",
        city: "New York",
        state: "New York",
        lat: 40.701450,
        lng: -73.427860
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2] }
    }, {});
  }
};
