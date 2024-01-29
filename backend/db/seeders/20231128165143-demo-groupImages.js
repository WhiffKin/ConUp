'use strict';

const { GroupImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_robot.jpg",
        preview: true
      },
      {
        groupId: 1,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_halo.jpg",
        preview: false
      },
      {
        groupId: 1,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage.webp",
        preview: false
      },
      {
        groupId: 1,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage2.webp",
        preview: false
      },
      {
        groupId: 2,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage3.webp",
        preview: true
      },
      {
        groupId: 2,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_halo.jpg",
        preview: false
      },
      {
        groupId: 3,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_meet.jpg",
        preview: true
      },
      {
        groupId: 3,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_booths.jpeg",
        preview: false
      },
      {
        groupId: 4,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage4.jpg",
        preview: true
      },
      {
        groupId: 4,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_old-comp.jpg",
        preview: false
      },
      {
        groupId: 5,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_stage5.avif",
        preview: true
      },
      {
        groupId: 5,
        url: "https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/event_booths2.jpg",
        preview: false
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
