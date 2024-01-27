const express = require("express");
const router = express.Router();

const { Venue, Membership } = require('../../db/models');
const { ValidationError } = require('sequelize');
const { requireAuth } = require("../../utils/auth");

router.put("/:venueId",
    requireAuth,
    async (req, res, next) => {
        const id = req.params.venueId;

        const venue = await Venue.findByPk(id);
        if (!venue) {
            const err = new Error("Venue couldn't be found");
            err.status = 404;
            return next(err);
        }

        let group = await venue.getGroup();
        group = group.toJSON();
        const coHosts = await Membership.findAll({
            where: {
                userId: req.user.id,
                groupId: group.id,
                status: "co-host"
            }
        })

        if (req.user.id != group.organizerId && coHosts.length === 0) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        const { address, city, state, lat, lng } = req.body;

        venue.address = address || venue.address;
        venue.city = city || venue.city;
        venue.state = state || venue.state;
        venue.lat = lat || venue.lat;
        venue.lng = lng || venue.lng;
        
        // Verification
        try {
            await venue.validate();
            await venue.save();
        } catch (e) {
            const err = new ValidationError("Bad Request");
            err.status = 400;
            err.errors = e.errors;
            return next(err)
        }

        const payload = venue.toJSON();

        delete payload.updatedAt;

        res.status(200);
        res.json(payload);
    }
)

module.exports = router;