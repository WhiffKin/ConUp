const express = require("express");
const router = express.Router();

const { Event, Group, Venue, EventImage, Attendance } = require('../../db/models');
const { ValidationError } = require('sequelize');
const { requireAuth } = require("../../utils/auth");

router.put("/:eventId/attendance", 
    requireAuth,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId)
        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }
        const eventObj = event.toJSON();
        
        const group = await Group.findByPk(eventObj.groupId);
        let members = await group.getMembers({
            through: {
                where: {
                    status: ["co-host"]
                },
            }
        })
        members = members.map(member => member.toJSON().id);

        if (req.user.id != group.organizerId && !members.includes(req.user.id)) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        const { userId, status } = req.body;

        if (status === "pending") {
            const err = new Error("Cannot change an attendance status to pending");
            err.status = 400;
            return next(err);
        }

        const user = await Attendance.unscoped().findOne({
            where: {
                userId
            }
        });
        if (!user) {
            const err = new Error("Attendance between the user and the event does not exist");
            err.status = 404;
            return next(err);
        }

        user.status = status || user.status;

        try {
            await user.save();
        } catch (e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            err.errors = e.errors;
            return next(err)
        }

        const payload = user.toJSON();

        delete payload.createdAt;
        delete payload.updatedAt;

        res.status(200);
        res.json(payload);
    }
)

router.post("/:eventId/attendance",
    requireAuth,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId)
        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }
        const eventObj = event.toJSON();
        
        const group = await Group.findByPk(eventObj.groupId);
        let members = await group.getMembers({
            through: {
                where: {
                    status: ["co-host", "member"]
                },
            }
        })
        members = members.map(member => member.toJSON().id);

        if (req.user.id != group.organizerId && !members.includes(req.user.id)) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        const attendance = await event.getUsers({
            through: {
                where: {
                    userId: req.user.id
                }
            }
        })
        if (attendance.length) {
            const err = new Error(attendance[0].toJSON().status === "pending" ? 
                                "Attendance has already been requested" : 
                                "User is already an attendee of the event");
            err.status = 400;
            return next(err);
        }

        let member;
        
        try {
            member = await event.addUser(req.user, {
                through: {
                    status: "pending",
                },
             });
        } catch (e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            err.errors = e.errors;
            return next(err)
        }

        member = member[0].toJSON();

        member = {
            userId: member.userId,
            status: member.status,
        }

        res.status(200);
        res.json(member);
    }
)

router.get("/:eventId/attendees",
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId)
        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }
        const eventObj = event.toJSON();
        
        const options = {
            through: {
                where: {
                    status: ["attending", "wait-list"]
                },
            }
        }
        
        const group = await Group.findByPk(eventObj.groupId);
        let members = await group.getMembers({
            through: {
                where: {
                    status: ["co-host", "member"]
                },
            }
        })
        members = members.map(member => member.toJSON().id);

        if (req.user.id === group.organizerId || members.includes(req.user.id)) {
            options.through.where.status.push("pending");
        }

        const attendance = await event.getUsers(options)

        res.status(200);
        res.json(attendance);
    }
)

router.post("/:eventId/images",
    requireAuth,
    async (req, res, next) => {
        const event = await Event.findByPk(req.params.eventId)
        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }
        const eventObj = event.toJSON();
        
        const group = await Group.findByPk(eventObj.groupId);
        let members = await group.getMembers({
            through: {
                where: {
                    status: ["co-host", "member"]
                }
            }
        })
        members = members.map(member => member.toJSON().id)
        
        if (req.user.id != group.organizerId && !members.includes(req.user.id)) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        const { url, preview } = req.body;
        let image;

        try {
            image = await event.createEventImage({ url, preview });
        } catch (e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            err.errors = e.errors;
            return next(err)
        }

        image = image.toJSON();

        delete image.eventId;
        delete image.createdAt;
        delete image.updatedAt;

        res.status(200);
        res.json(image);
    }
)

router.delete("/:eventId",
    requireAuth,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId)
        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }
        const eventObj = event.toJSON();

        const group = await Group.findByPk(eventObj.groupId);
        let members = await group.getMembers({
            through: {
                where: {
                    status: ["co-host", "member"]
                }
            }
        })
        members = members.map(member => member.toJSON().id);
        
        if (req.user.id != group.organizerId && !members.includes(req.user.id)) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        event.destroy();

        res.status(200);
        res.json({
            message: "Successfully deleted"
        })
    }
)

router.put("/:eventId",
    requireAuth,
    async (req, res, next) => {
        const event = await Event.findByPk(req.params.eventId);
        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }
        const eventObj = event.toJSON();
        
        const group = await Group.findByPk(eventObj.groupId);
        let members = await group.getMembers({
            through: {
                where: {
                    status: ["co-host", "member"]
                }
            }
        })
        members = members.map(member => member.toJSON().id);
        
        if (req.user.id != group.organizerId && !members.includes(req.user.id)) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

        const venue = await Venue.findByPk(venueId);
        if (!venue) {
            const err = new Error("Venue couldn't be found");
            err.status = 404;
            return next(err);
        }
                
        event.venueId = venueId || event.venueId;
        event.name = name || event.name;
        event.type = type || event.type;
        event.capacity = capacity || event.capacity;
        event.price = price || event.price;
        event.description = description || event.description;
        event.startDate = startDate || event.startDate;
        event.endDate = endDate || event.endDate;
        
        // Verification
        try {
            await event.validate();
            await event.save();
        } catch (e) {
            if (e.errors) {
                const err = new ValidationError("Bad Request");
                err.status = 400;
                err.errors = e.errors;
                return next(err)
            } else {
                const err = new Error("Venue does not exist");
                err.status = 404;
                return next(err)
            }
        }

        res.status(200);
        res.json(event)
    }
)

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