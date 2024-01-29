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
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage.webp",
        preview: true
      },
      {
        eventId: 1,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage3.webp",
        preview: false
      },
      {
        eventId: 2,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage2.webp",
        preview: true
      },
      {
        eventId: 3,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage4.jpg",
        preview: true
      },
      {
        eventId: 4,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_meet.jpg",
        preview: true
      },
      {
        eventId: 5,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_old-comp.jpg",
        preview: true
      },
      {
        eventId: 6,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_overwatch.jpg",
        preview: true
      },
      {
        eventId: 6,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage3.webp",
        preview: false
      },
      {
        eventId: 6,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage2.webp",
        preview: false
      },
      {
        eventId: 7,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage3.webp",
        preview: true
      },
      {
        eventId: 7,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage.webp",
        preview: false
      },
      {
        eventId: 7,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage2.webp",
        preview: false
      },
      {
        eventId: 8,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage5.avif",
        preview: true
      },
      {
        eventId: 8,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage3.webp",
        preview: false
      },
      {
        eventId: 8,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage2.webp",
        preview: false
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
    }, {});
  }
};