'use strict';

const { Event } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: "CS2 Major",
        description: "Watch these pros go head to head in this 32 team bracket. All of these matches are leading up to the final day where the final 4 matches will be played on the main stage.",
        type: "In person",
        capacity: 6400,
        price: 29.99,
        startDate: "06-28-2023T09:00:00.000s",
        endDate: "07-01-2023T18:00:00.000s",
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Dallas Open Tournament",
        description: "Come join us for a fierce competition featuring the best of what Dallas has to offer! Games include: Overwatch, CoD, Valorant, and Halo. Any team is welcome, to compete in a sudden death bracket where the top 8 in each game will compete to win up to $1,000!",
        type: "In person",
        capacity: 6400,
        price: 19.99,
        startDate: "03-20-2014T09:00:00.000s",
        endDate: "03-24-2014T20:00:00.000.000s",
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Annual Skybox Tourney",
        description: "Do you have what it takes to break Halo? Can you find your way into the craziest spot for the wildest elim? If you think you've got what it takes, come join us! Best elim gets $200, and winner takes $400.",
        type: "In person",
        capacity: 3000,
        price: 9.99,
        startDate: "12-09-2023T09:00:00.000s",
        endDate: "12-10-2023T18:00:00.000s",
      },
      {
        venueId: 3,
        groupId: 3,
        name: "SSBM NoPickCheese Tournament NO ICE CLIMBERS",
        description: "DO NOT PICK ICE CLIMBERS. Legal maps: FD, FoD, PS (NO STAGE HAZARDS). Legal characters: Falco, Fox, Marth, Ice Climbers. DONT JOIN if you arent going to play by the RULES it wont be fun if you dont play by my RULES. DO NOT PICK ICE CLIMBERS.",
        type: "In person",
        capacity: 200,
        price: 59.99,
        startDate: "02-24-2024T09:00:00.000s",
        endDate: "02-24-2024T22:00:00.000s",
      },
      {
        venueId: 4,
        groupId: 4,
        name: "PRO Invitational",
        description: "Come watch our pros play against each other in the TRUEST test of skill. A best of 32 8 team bracket, to prove UNDENIABLY who the BEST of the BEST is at Mary-Kate and Ashley: Crush Course.",
        type: "In person",
        capacity: 10000,
        price: 300,
        startDate: "09-07-2024T09:00:00.000s",
        endDate: "09-15-2024T22:00:00.000s",
      },
      {
        groupId: 5,
        name: "Random Selection Overwatch 2 Tourney",
        description: "Come enjoy some great games with some great people, all you need to do is join discord at the start time and the mods will randomize the groups and the tournament can begin! This event is going to be Overwatch 2, so get ready for some team play with some people you've never met before! Go make friends gamers!",
        type: "Online",
        capacity: 200,
        price: 0,
        startDate: "07-13-2024T09:00:00.000s",
        endDate: "07-14-2024T18:00:00.000s",
      },
      {
        groupId: 5,
        name: "Random Selection CS2 Tourney",
        description: "Come enjoy some great games with some great people, all you need to do is join discord at the start time and the mods will randomize the groups and the tournament can begin! This event is going to be CS2, so get ready for some team play with some people you've never met before! Go make friends gamers!",
        type: "Online",
        capacity: 200,
        price: 0,
        startDate: "07-20-2024T09:00:00.000s",
        endDate: "07-21-2024T18:00:00.000s",
      },
      {
        groupId: 5,
        name: "Random Selection Rocket League Tourney",
        description: "Come enjoy some great games with some great people, all you need to do is join discord at the start time and the mods will randomize the groups and the tournament can begin! This event is going to be Rocket League, so get ready for some 3v3 team play with some people you've never met before! Go make friends gamers!",
        type: "Online",
        capacity: 198,
        price: 0,
        startDate: "07-27-2024T09:00:00.000s",
        endDate: "07-28-2024T18:00:00.000s",
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
