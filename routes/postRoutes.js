const express = require("express")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({extended: true}))



router.get("/:id", (req, res, next) => {

    let payload ={
        pageTitle:"View post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }

    res.status(200).render("postPage", payload);
  
})


module.exports = router;