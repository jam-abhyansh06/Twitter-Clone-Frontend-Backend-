const express = require("express")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

const path = require("path");

const app = express()
const router = express.Router()

app.use(bodyParser.urlencoded({extended: true}))


router.get("/images/:path", (req, res, next) => {
    res.sendFile(path.join(__dirname, `../uploads/images/${req.params.path}`))
})


module.exports = router;