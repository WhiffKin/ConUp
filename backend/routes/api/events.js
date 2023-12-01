const express = require("express");
const router = express.Router();

const { Event, Group, Venue } = require('../../db/models');
const { ValidationError } = require('sequelize');
const { requireAuth } = require("../../utils/auth");

router.get("/",
    async (_req, res) => {
        const events = await Event.findAll({
            include: [
                {
                    model: Group.scope("limited")
                },
                {
                    model: Venue.scope("defaultScope", "limited")
                }
            ]
        });

        res.status(200);
        res.json(events);
    }
)

module.exports = router;