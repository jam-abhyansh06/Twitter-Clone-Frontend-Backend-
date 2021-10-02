import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema();
const mongoose = require("mongoose");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.png"
    }
});


let User = model("User", userSchema);

export default User;