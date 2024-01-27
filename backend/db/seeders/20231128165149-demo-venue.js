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
        address: "650 S Griffin St",
        city: "Dallas",
        state: "Texas",
        lat: 32.774652,
        lng: -96.800644
      },
      {
        groupId: 2,
        address: "1855 Main St",
        city: "Santa Monica",
        state: "California",
        lat: 34.0090318,
        lng: -118.489330
      },
      {
        groupId: 3,
        address: "1 Sabin St",
        city: "Providence",
        state: "Rhode Island",
        lat: 41.823839, 
        lng: -71.417453
      },
      {
        groupId: 4,
        address: "9575 State St",
        city: "Sandy",
        state: "Utah",
        lat: 40.578712,  
        lng: -111.888211
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
