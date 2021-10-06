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


router.get("/:username", async (req, res, next) => {

    let payload = await getPayload(req.params.username, req.session.user);

    res.status(200).render("profilePage", payload);
  
})


async function getPayload(username, userLoggedIn) {
    let user = await User.findOne({username : username});   // find user in DB

    // if username param in url is not in DB
    if(user === null) {
        return {
            pageTitle: "User not found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
        }
    }

    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}


module.exports = router;