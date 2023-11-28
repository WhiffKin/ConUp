'use strict';

const { EventImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "testUrl.com/Image1",
        preview: true
      },
      {
        eventId: 2,
        url: "testUrl.com/Image2",
        preview: true
      },
      {
        eventId: 3,
        url: "testUrl.com/Image3",
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['testUrl.com/Image1', 'testUrl.com/Image2', 'testUrl.com/Image3'] }
    }, {});
  }
};