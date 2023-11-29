const express = require("express");
const router = express.Router();

const { Group, Membership, GroupImage, User } = require("../../db/models");

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

router.get('/', 
    async (_req, res) => {
        const groups = await Group.findAll();

        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            group = group.toJSON()
            const memberList = await Membership.findAll({
                where: {
                    groupId: group.id
                }
            });
            group.numMembers = memberList ? memberList.length : 0;

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

module.exports = router;