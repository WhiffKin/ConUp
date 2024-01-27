'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Deadly Precise Shots",
        about: "We host events for: CS2, Valorant, Overwatch, CoD, and Halo. Come join us and see your team win on the big stage!",
        type: "In person",
        private: false,
        city: "Dallas",
        state: "Texas",
      },
      {
        organizerId: 2,
        name: "Anything For Kills",
        about: "Everything goes in our events! Could you get onto the skybox? We hope your aim is good! Did you get stuck under the map? Make sure to bring a gun that can shoot through the floor! Did you enable god mode and start flying around the map at max speed? If you're not invincible, then we don't care! Anything for kills!",
        type: "In person",
        private: false,
        city: "Santa Monica",
        state: "California",
      },
      {
        organizerId: 3,
        name: "No Picking Cheese",
        about: "Ever found yourself breaking a controller because someone stunlocked you by spamming a button? Join our group, where events undergo a strict vetting process so that only the fun characters and abilities are allowed. No more cheese!",
        type: "In person",
        private: false,
        city: "Providence",
        state: "Rhode Island",
      },
      {
        organizerId: 4,
        name: "Competitve Players Union",
        about: "Only the best gamers can be found on stage at our events. Our players undergo a very strict training regiment, sleeping schedule, and diet. These specimens are pushed to their absolute limits to show whats possible in the world of eSports!",
        type: "In person",
        private: true,
        city: "Sandy",
        state: "Utah",
      },
      {
        organizerId: 5,
        name: "Friendly Fighters",
        about: "This group of Rag-Tag gamers can be found anywhere in the continental US. We meet online to share our love of gaming with anyone who has an internet connection!",
        type: "Online",
        private: false,
        city: "Rexburg",
        state: "Idaho",
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
