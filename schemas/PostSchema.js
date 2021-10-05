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
    pinned: Boolean,
    likes: [{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    retweetUsers: [{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    retweetData: {
        type: Schema.Types.ObjectId,
        ref:'Post'
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref:'Post'
    },
}, { timestamps: true });


let Post = mongoose.model("Post", postSchema);

module.exports =  Post;