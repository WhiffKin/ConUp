const express = require("express");
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { GroupImage } = require('../../db/models');

router.delete("/:imageId",
    requireAuth,
    async (req, res, next) => {
        const image = await GroupImage.findByPk(req.params.imageId);

        if (!image) {
            const err = new Error("Group Image couldn't be found");
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