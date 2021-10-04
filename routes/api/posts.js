const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

router.get("/", (req, res, next) => {

    Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({"createdAt": -1})
    .then(async results => {
        results = await User.populate(results, {path : "retweetData.postedBy"});
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400)
    })

})

router.post("/", async (req, res, next) => {

    if(!req.body.content) {
        console.log("Content param not sent with request");
        return res.sendStatus(400);
    }

    let postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    Post.create(postData)
    .then(async newPost => {
        newPost = await User.populate(newPost, { path: "postedBy"})
        res.status(201).send(newPost);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    
})

router.put("/:id/like", async (req, res, next) => {
    
    let postId = req.params.id;
    let userId = req.session.user._id;

    // isLiked checked with both conditions as using only second was giving error when user had not liked even one post
    let isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    let option = isLiked ? "$pull" : "$addToSet"

    // Insert or Delete user likes
    
    // {new: true} gives new updated user object and assigning it to req.session.user caches it so that unliking features work properly
    
    req.session.user = await User.findByIdAndUpdate(userId, { [option] : {likes: postId} }, {new: true})
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })


    // Insert or Delete post likes

    let post = await Post.findByIdAndUpdate(postId, { [option] : {likes: userId} }, {new: true})
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })



    res.status(200).send(post)
})

router.post("/:id/retweet", async (req, res, next) => {
    
    let postId = req.params.id;
    let userId = req.session.user._id;

    // Try and delete request 
    let deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })

    let option = deletedPost != null ? "$pull" : "$addToSet"

    let repost = deletedPost;

    if(repost === null) {
        repost = await Post.create({postedBy: userId, retweetData: postId})
        .catch(error=> {
            console.log(error);
            res.sendStatus(400);
        })
    }

    // Insert or Delete user retweet

    req.session.user = await User.findByIdAndUpdate(userId, { [option] : { retweeets: repost._id } }, {new: true})
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })


    // Insert or Delete post retweet

    let post = await Post.findByIdAndUpdate(postId, { [option] : {retweetUsers: userId} }, {new: true})
    .catch(error=> {
        console.log(error);
        res.sendStatus(400);
    })



    res.status(200).send(post)
})


module.exports = router;