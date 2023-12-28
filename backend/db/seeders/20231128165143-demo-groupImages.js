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
        url: "https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg",
        preview: true
      },
      {
        groupId: 3,
        url: "https://business-consultancy.com/wp-content/uploads/2015/12/e297f5cd-d2fe-4ab2-836a-7275e65a5cd6.png",
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
