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
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
      {
        eventId: 2,
        url: "https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg",
        preview: true
      },
      {
        eventId: 3,
        url: "https://images.pexels.com/photos/5732441/pexels-photo-5732441.jpeg",
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [true, false] }
    }, {});
  }
};