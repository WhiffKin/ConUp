'use strict';

const { Membership } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate([
      // Group 1 : Deadly Precise Shots
      {
        userId: 5,
        groupId: 1,
        status: "co-host"
      },
      {
        userId: 3,
        groupId: 1,
        status: "member"
      },
      {
        userId: 2,
        groupId: 1,
        status: "pending"
      },
      // Group 2 : Anything For Kills
      {
        userId: 3,
        groupId: 2,
        status: "co-host"
      },
      {
        userId: 1,
        groupId: 2,
        status: "pending"
      },
      {
        userId: 4,
        groupId: 2,
        status: "member"
      },
      // Group 3 : No Picking Cheese
      {
        userId: 4,
        groupId: 3,
        status: "member"
      },
      {
        userId: 5,
        groupId: 3,
        status: "member"
      },
      {
        userId: 2,
        groupId: 3,
        status: "pending"
      },
      // Group 4 : Competitve Players Union
      {
        userId: 2,
        groupId: 4,
        status: "member"
      },
      {
        userId: 5,
        groupId: 4,
        status: "member"
      },
      // Group 5 : Friendly Fighters
      {
        userId: 1,
        groupId: 5,
        status: "member"
      },
      {
        userId: 2,
        groupId: 5,
        status: "member"
      },
      {
        userId: 3,
        groupId: 5,
        status: "member"
      },
      {
        userId: 4,
        groupId: 5,
        status: "member"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
