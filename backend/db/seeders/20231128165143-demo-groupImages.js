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
        url: "fakeUrl.com/images/Wreckfest1",
        preview: true
      },
      {
        groupId: 1,
        url: "fakeUrl.com/images/Wreckfest2",
        preview: false
      },
      {
        groupId: 2,
        url: "fakeUrl.com/images/TestImage",
        preview: false
      },
      {
        groupId: 3,
        url: "fakeUrl.com/images/FreeMoney$$$",
        preview: false
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
