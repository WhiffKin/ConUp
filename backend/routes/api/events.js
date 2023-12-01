const express = require("express");
const router = express.Router();

const { Event, Group, Venue, EventImage } = require('../../db/models');
const { ValidationError } = require('sequelize');
const { requireAuth } = require("../../utils/auth");

router.get("/:eventId", 
    async (req, res) => {
        let event = await Event.findByPk(req.params.eventId, {
            include: [
                {
                    model: Group.scope("limitedPrivate")
                },
                {
                    model: Venue.scope("defaultScope", "limited")
                },
                {
                    model: EventImage
                }
            ]
        });

        // Count numAttending
        const attending = await event.getUsers({
            through: {
                where: {
                    status: "attending"
                }
            }
        })
        event = event.toJSON();
        event.numAttending = attending ? attending.length : 0;

        res.status(200);
        res.json(event);
    }
)

router.get("/",
    async (_req, res) => {
        const events = await Event.findAll({
            include: [
                {
                    model: Group.scope("limited")
                },
                {
                    model: Venue.scope("defaultScope")
                }
            ]
        });

        for (let i = 0; i < events.length; i++) {
            let event = events[i];

            // Count numAttending
            const attending = await event.getUsers({
                through: {
                    where: {
                        status: "attending"
                    }
                }
            })
            event = event.toJSON();
            event.numAttending = attending ? attending.length : 0;

            events[i] = event;
        }

        res.status(200);
        res.json(events);
    }
)

module.exports = router;