const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

router.get("/", (req, res, next) => {

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

module.exports = router;