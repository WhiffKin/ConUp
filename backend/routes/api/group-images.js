const express = require("express");
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { GroupImage, Group } = require('../../db/models');

router.delete("/:imageId",
    requireAuth,
    async (req, res, next) => {
        const image = await GroupImage.unscoped().findByPk(req.params.imageId);
        if (!image) {
            const err = new Error("Event Image couldn't be found");
            err.status = 403;
            return next(err);
        }
        
        const group = await Group.findByPk(image.groupId);
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

        image.destroy();

        res.status = 200;
        res.json({
            message: "Successfully deleted"
        })
    }
)

module.exports = router;