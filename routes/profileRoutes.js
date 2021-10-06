const express = require("express")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({extended: true}))



router.get("/", (req, res, next) => {

    let payload ={
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }

    res.status(200).render("profilePage", payload);
  
})


module.exports = router;