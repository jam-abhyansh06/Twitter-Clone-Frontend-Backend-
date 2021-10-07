const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

router.put("/:userId/follow", async (req, res, next) => {

    let userId =req.params.userId;

    let user = await User.findById(userId);

    if(user === null) return res.sendStatus(404);
    
    let isFollowing = user.followers && user.followers.includes(req.session.user._id);

    res.status(200).send(isFollowing)
})


module.exports = router;