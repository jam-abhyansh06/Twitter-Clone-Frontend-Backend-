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

    let option = isFollowing ? "$pull" : "$addToSet"
 

    // Insert or Delete user followers
    // {new: true} gives new updated user object and assigning it to req.session.user caches it so that unliking features work properly
    
    // update following of the user following
    await User.findByIdAndUpdate(req.session.user._id, { [option] : {following: userId} }, {new: true})
    .then(result => req.session.user=result)
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })
    // update follower of the user being followed
    User.findByIdAndUpdate(userId, { [option] : {followers: req.session.user._id} })
    .then()
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert or Delete post likes

    // let post = await Post.findByIdAndUpdate(postId, { [option] : {likes: userId} }, {new: true})
    // .catch(error=> {
    //     console.log(error);
    //     res.sendStatus(400);
    // })
    res.status(200).send(req.session.user)
})


module.exports = router;