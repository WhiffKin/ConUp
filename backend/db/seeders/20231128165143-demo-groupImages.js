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
        url: "https://cdn.discordapp.com/attachments/1163593560734568488/1189790624174575717/ar751.png",
        preview: true
      },
      {
        groupId: 1,
        url: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/hisl1yzkpxjdgtgcyncy.png",
        preview: false
      },
      {
        groupId: 2,
        url: "https://cdn.discordapp.com/attachments/1163593560734568488/1189790624174575717/ar751.png",
        preview: true
      },
      {
        groupId: 2,
        url: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/hisl1yzkpxjdgtgcyncy.png",
        preview: false
      },
      {
        groupId: 3,
        url: "https://cdn.discordapp.com/attachments/1163593560734568488/1189790624174575717/ar751.png",
        preview: true
      },
      {
        groupId: 3,
        url: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/hisl1yzkpxjdgtgcyncy.png",
        preview: false
      },
      {
        groupId: 4,
        url: "https://cdn.discordapp.com/attachments/1163593560734568488/1189790624174575717/ar751.png",
        preview: true
      },
      {
        groupId: 4,
        url: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/hisl1yzkpxjdgtgcyncy.png",
        preview: false
      },
      {
        groupId: 5,
        url: "https://cdn.discordapp.com/attachments/1163593560734568488/1189790624174575717/ar751.png",
        preview: true
      },
      {
        groupId: 5,
        url: "https://images.igdb.com/igdb/image/upload/t_screenshot_big/hisl1yzkpxjdgtgcyncy.png",
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
