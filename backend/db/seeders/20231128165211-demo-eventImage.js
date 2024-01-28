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
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
      {
        eventId: 3,
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
      {
        eventId: 4,
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
      {
        eventId: 5,
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
      {
        eventId: 6,
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
      {
        eventId: 7,
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
      {
        eventId: 8,
        url: "https://static.wikia.nocookie.net/wreckfest/images/0/07/Drytown_desert_circuit.png",
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }, {});
  }
};