const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: true,
    },
    firstname: { type: String },
    lastname: { type: String },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String }
});
const UserData = new mongoose.model("UserData", userSchema);

module.exports = UserData;