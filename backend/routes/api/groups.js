const express = require("express");
const router = express.Router();

const { Group, Membership, GroupImage, User, Venue } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Op, ValidationError } = require('sequelize');
const event = require("../../db/models/event");

// Get all groups current user organized or is a member of
router.get("/current",
    requireAuth,
    async (req, res) => {
        const organizerId = req.user.id;
        
        // Get all groups where the current user is a member or organized
        const groups = await Group.findAll({
            include: {
                model: User,
                attributes: [],
                through: {
                    where: {
                        userId: organizerId,
                        status: "member",
                    }
                }
            },
            where: {
                [Op.or]: {
                    organizerId,
                    "$Users.id$": organizerId,
                }
            }
        });

        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            group = group.toJSON()

            // Count Members
            const memberList = await Membership.findAll({
                where: {
                    groupId: group.id
                }
            });
            group.numMembers = memberList ? memberList.length : 0;

            // Get first previewImage
            const groupImagePreview = await GroupImage.findOne({
                where: {
                    groupId: group.id,
                    preview: true
                }
            })
            if (groupImagePreview) group.previewImage = groupImagePreview.url; 

            groups[i] = group;
        }

        res.status(200);
        res.json(groups);
    }
);

// Get members of a group by groupId
router.get("/:groupId/members",
    async (req, res, next) => {
        const id = req.params.groupId;
        
        const group = await Group.findByPk(id);

        if (!group) {
            const err = new Error(`No group found with id: ${id}`);
            err.status = 404;
            return next(err);
        }

        const options = {
            through: {
                where: {
                    status: ["member", "co-host"]
                },
            },
            attributes: {
                exclude: ["username"]
            }
        };

        // Authorization: is current user owner or co-host
        // if so, also show pending members
        const coHosts = await group.getMembers({
            through: {
                where: {
                    userId: req.user.id,
                    status: "co-host",
                },
            },
        });
        if (req.user.id === group.organizerId || coHosts.length !== 0) 
            options.through.where.status.push("pending");
        
        const members = {
            Members: await group.getMembers(options)
        };

        res.status(200);
        res.json(members);
    }
)

// Create event for a group by groupId
router.post("/:groupId/events", 
    requireAuth,
    async (req, res, next) => {
        const id = req.params.groupId;
        
        const group = await Group.findByPk(id);

        if (!group) {
            const err = new Error(`No group found with id: ${id}`);
            err.status = 404;
            return next(err);
        }

        // Authorization: is current user owner or co-host
        const coHosts = await group.getUsers({
            through: {
                where: {
                    userId: req.user.id,
                    status: "co-host",
                }
            }
        });
        if (req.user.id !== group.organizerId && coHosts.length === 0) {
            const err = new Error(`Forbidden`);
            err.status = 403;
            return next(err);
        }

        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
        let event;

        try {
            event = await group.createEvent({ venueId, name, type, capacity, price, description, startDate, endDate });
        } catch(e) {
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
        res.json(event);
    }
)

// Get events for a group by groupId
router.get("/:groupId/events",
    requireAuth,
    async (req, res, next) => {
        const id = req.params.groupId;
        
        const group = await Group.findByPk(id);

        if (!group) {
            const err = new Error(`No group found with id: ${id}`);
            err.status = 404;
            return next(err);
        }

        const events = await group.getEvents({
            scope: ["defaultScope", "groupSearch"],
            include: [
                {
                    model: Group,
                    attributes: ["id", "name", "city", "state"],
                },
                {
                    model: Venue,
                    attributes: ["id", "city", "state"],
                },
            ]
        });

        for(let i = 0; i < events.length; i++) {
            let event = events[i].toJSON();

            // Add previewImage if one exists
            const images = await events[i].getEventImages({
                where: {
                    preview: true
                }
            });
            if (images.length) event.previewImage = images[0].url;

            // Count numAttending
            const attending = await events[i].getUsers({
                through: {
                    where: {
                        status: "attending"
                    }
                }
            })
            event.numAttending = attending ? attending.length : 0;

            events[i] = event;
        }

        res.status(200);
        res.json(events);
    }
)

// Create a venue for a group
router.post("/:groupId/venues",
    requireAuth,
    async (req, res, next) => {
        const id = req.params.groupId;
        
        const group = await Group.findByPk(id);

        if (!group) {
            const err = new Error(`No group found with id: ${id}`);
            err.status = 404;
            return next(err);
        }

        // Authorization: is current user owner or co-host
        const coHosts = await group.getUsers({
            through: {
                where: {
                    userId: req.user.id,
                    status: "co-host",
                }
            }
        });
        if (req.user.id !== group.organizerId && coHosts.length === 0) {
            const err = new Error(`Forbidden`);
            err.status = 403;
            return next(err);
        }

        const { address, city, state, lat, lng } = req.body;
        let venue;

        try {
            venue = await group.createVenue({ address, city, state, lat, lng });
        } catch(e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            console.log(e);
            err.errors = e.errors;
            return next(err)
        }

        res.status(200);
        res.json(venue);
    }
);

// Get all venues of a group by groupId
router.get("/:groupId/venues", 
    requireAuth,
    async (req, res, next) => {
        const id = req.params.groupId;
        
        const group = await Group.findByPk(id);

        if (!group) {
            const err = new Error(`No group found with id: ${id}`);
            err.status = 404;
            return next(err);
        }

        // Authorization: is current user owner or co-host
        const coHosts = await group.getUsers({
            through: {
                where: {
                    userId: req.user.id,
                    status: "co-host",
                }
            }
        });
        if (req.user.id !== group.organizerId && coHosts.length === 0) {
            const err = new Error(`Forbidden`);
            err.status = 403;
            return next(err);
        }

        const venues = await group.getVenues();

        res.status(200);
        res.json(venues);
    }
)

// Get all images of a group by groupId 
router.post("/:groupId/images", 
    requireAuth,
    async (req, res, next) => {
        const id = req.params.groupId;
        
        const group = await Group.findByPk(id);

        if (!group) {
            const err = new Error(`No group found with id: ${id}`);
            err.status = 404;
            return next(err);
        }

        // Authorization
        if (req.user.id !== group.organizerId) {
            const err = new Error(`Forbidden`);
            err.status = 403;
            return next(err);
        }

        const { url, preview } = req.body;

        try {
            image = await group.createGroupImage({ url, preview });
        } catch(e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            console.log(e);
            err.errors = e.errors;
            return next(err)
        }

        res.status(200);
        res.json(image);
    }
)

// Delete a group by id
router.delete("/:groupId",
    requireAuth,
    async (req, res, next) => {
        const id = req.params.groupId;
        
        const group = await Group.findByPk(id);

        // Authorization
        if (req.user.id !== group.organizerId) {
            const err = new Error(`Forbidden`);
            err.status = 403;
            return next(err);
        }

        if (!group) {
            const err = new Error(`No group found with id: ${groupId}`);
            err.status = 404;
            return next(err);
        }

        group.destroy();

        res.status(200);
        res.json({ message: "Successfully deleted" });
    }
) 

// Edit a group by id
router.put("/:groupId", 
    requireAuth,
    async (req, res, next) => {
        const id = req.params.groupId;
        const { name, about, type, private, city, state } = req.body;

        const group = await Group.findByPk(id);
        
        // Authorization
        if (req.user.id !== group.organizerId) {
            const err = new Error(`Forbidden`);
            err.status = 403;
            return next(err);
        }
        
        if (!group) {
            const err = new Error(`No group found with id: ${groupId}`);
            err.status = 404;
            return next(err);
        }
                
        group.name = name || group.name;
        group.about = about || group.about;
        group.type = type || group.type;
        group.private = private || group.private;
        group.city = city || group.city;
        group.state = state || group.state;
        
        // Verification
        try {
            await group.validate();
            group.save();
        } catch (e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            err.errors = e.errors;
            return next(err)
        }

        res.status(200);
        res.json(group)
    }
)

// Get group by id with numMembers, GroupImages, and Organizer
router.get('/:groupId',
    async (req, res, next) => {
        const { groupId } = req.params;

        let group = await Group.findByPk(groupId);

        if (!group) {
            const err = new Error(`No group found with id: ${groupId}`);
            err.status = 404;
            return next(err);
        }

        group = group.toJSON();
        
        // Count Members
        const memberList = await Membership.findAll({
            where: {
                groupId: group.id
            }
        });
        group.numMembers = memberList ? memberList.length : 0;

        // Get Images
        const groupImages = await GroupImage.findAll({
            where: {
                groupId: group.id
            }
        })
        if (groupImages) group.GroupImages = groupImages; 

        // Get Organizer
        const organizer = await User.scope("defaultScope", "nameAndId").findByPk(group.organizerId);
        group.Organizer = organizer;

        res.status(200);
        res.json(group);
    }
);

// Get all groups with numMembers and previewImage
router.get('/', 
    async (_req, res) => {
        const groups = await Group.findAll();

        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            group = group.toJSON()

            // Count Members
            const memberList = await Membership.findAll({
                where: {
                    groupId: group.id
                }
            });
            group.numMembers = memberList ? memberList.length : 0;

            // Get first previewImage
            const groupImagePreview = await GroupImage.findOne({
                where: {
                    groupId: group.id,
                    preview: true
                }
            })
            if (groupImagePreview) group.previewImage = groupImagePreview.url; 

            groups[i] = group;
        }

        res.status(200);
        res.json(groups);
    }
);

// Create Group using current user
router.post("/", 
    requireAuth,
    async (req, res, next) => {
        const { name, about, type, private, city, state } = req.body;

        const newGroup = await Group.build({ 
            name, about, type, private, city, state,
            organizerId: req.user.id,
        });

        // Verification
        try {
            await newGroup.validate();
            newGroup.save();
        } catch (e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            err.errors = e.errors;
            return next(err)
        }

        res.status(201);
        res.json(newGroup);
    }
);

module.exports = router;