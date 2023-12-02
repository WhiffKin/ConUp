const express = require("express");
const router = express.Router();

const { Event, Group, Venue, EventImage, Attendance, User } = require('../../db/models');
const { ValidationError, where } = require('sequelize');
const { requireAuth } = require("../../utils/auth");
const { query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateQuery = [
    query('page')
        .default(1)
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage('Page must be greater than or equal to 1'),
    query('size')
        .default(1)
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage('Size must be greater than or equal to 1'),
    query('name')
        .optional({nullable: true, checkFalsy: true})
        .exists({ checkFalsy: true })
        .customSanitizer(value => value[0] === '"' ? value.split('"')[1] : value)
        .isString()
        .withMessage('Name must be a string'),
    query('type')
        .optional({nullable: true, checkFalsy: true})
        .exists({ checkFalsy: true })
        .customSanitizer(value => value[0] === '"' ? value.split('"')[1] : value)
        .isIn(["Online", "In person"])
        .withMessage("Type must be 'Online' or 'In person'"),
    query('startDate')
        .optional({nullable: true, checkFalsy: true})
        .customSanitizer(value => value[0] === '"' ? value.split('"')[1] : value)
        .isISO8601()
        .withMessage('Start date must be a valid datetime'),
    handleValidationErrors
];

router.delete("/:eventId/attendance",
    requireAuth,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId)
        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }
        
        const group = await Group.findByPk(event.groupId);
        const { userId } = req.body;

        if (req.user.id != group.organizerId && req.user.id !== userId) {
            const err = new Error("Only the User or organizer may delete an Attendance");
            err.status = 403;
            return next(err);
        }

        const user = await Attendance.unscoped().findOne({
            where: {
                userId
            }
        });
        if (!user) {
            const err = new Error("Attendance does not exist for this user");
            err.status = 404;
            return next(err);
        }

        user.destroy();

        res.status(200);
        res.json({
            message: "Successfully deleted attendance from event"
        });
    }
)

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

        const userExists = await User.findByPk(req.user.id);
        if (!userExists) {
            const err = new Error("User couldn't be found");
            err.status = 404;
            return next(err);
        }
        
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
            eventId: req.params.eventId,
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
                    status: ["co-host"]
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
                    status: ["co-host"]
                }
            }
        })
        members = members.map(member => member.toJSON().id)
        let attendee = await Attendance.findOne({
            where: {
                eventId: req.params.eventId,
                userId: req.user.id,
                status: "attending"
            }
        })
        
        if (req.user.id != group.organizerId && !members.includes(req.user.id) && !attendee) {
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
                    status: ["co-host"]
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
                    status: ["co-host"]
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

        const payload = event.toJSON();

        delete payload.updatedAt;

        res.status(200);
        res.json(payload);
    }
)

router.get("/:eventId", 
    async (req, res, next) => {
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

        if (!event) {
            const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
        }

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
    validateQuery,
    async (req, res, next) => {
        let { page, size, name, type, startDate } = req.query;

        const options = {
            include: [
                {
                    model: Group.scope("limited")
                },
                {
                    model: Venue.scope("defaultScope", "limited")
                }
            ],
            where: {

            }
        };

        page = Math.min(Math.max(page ? page : 1, 1), 10);
        size = Math.min(Math.max(size ? size : 20, 1), 20);
        options.offset = (page - 1) * size;
        options.limit = size;
        if (name) options.where.name = name;
        if (type) options.where.type = type;
        if (startDate) options.where.startDate = startDate;

        const events = await Event.scope("defaultScope", "groupSearch").findAll(options);

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
            
            // Get first previewImage
            const eventImagePreview = await EventImage.findOne({
                where: {
                    eventId: event.id,
                    preview: true
                }
            })
            event.previewImage = eventImagePreview ? eventImagePreview.url : "No preview image found"; 

            events[i] = event;
        }

        res.status(200);
        res.json(events);
    }
)

module.exports = router;