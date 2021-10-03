const mongoose = require("mongoose");

const Schema = mongoose.Schema

const postSchema = new Schema({
    content: {                                         // required is not set to let the retweet functionality
        type: String,
        trim: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    pinned: Boolean
}, { timestamps: true });


let Post = mongoose.model("Post", userSchema);

module.exports =  Post;