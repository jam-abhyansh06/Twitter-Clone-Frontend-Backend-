require("dotenv").config()
const mongoose = require("mongoose")

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://admin-twitter-clone:"+process.env.dbPassword+"@twitterclonecluster.ovy4q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        .then(() => {
        console.log("Connection to database successful");
        })
        .catch((err) => {
        console.log("Connection to database failed due to error :"+err);
        })
    }
}

module.exports = new Database()