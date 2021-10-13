const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const multer = require("multer")
const upload = multer({dest: "uploads/"});
const path = require("path");
const fs = require("fs");               // file system module to move files around

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


router.get("/:userId/following", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("following")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.get("/:userId/followers", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("followers")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})


router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {

    if(!req.file) {
        console.log("No file uploaded with ajax request");
        return res.sendStatus(400);
    }

    let filePath = `/uploads/images/${req.file.filename}.png`;
    let tempPath = req.file.path;
    let targetPath = path.join(__dirname, `../../${filePath}`)

    // move file from old path(tempPath) to new path(targetPath)
    fs.rename(tempPath, targetPath, async error => {
        if(error !== null) {
            console.log(error);
            return res.sendStatus(400);
        }

        // update profilePic path in the DB
        await User.findByIdAndUpdate(req.session.user._id, { profilePic: filePath }, { new: true })
        .then(result => req.session.user = result)
        .catch(err => {
            console.log(err);
            return res.sendStatus(400);
        })

        res.sendStatus(204);

    })


})

module.exports = router;