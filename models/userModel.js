const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add the user name"],
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: [true, "Email address already taken!"],
            required: [true,'Email address is required'],
            validate: [validator.isEmail, 'Please fill a valid email address']
        },
        // password: {
        //     type: String,
        //     required: [true, "Please add the user password"],
        // },
        profilePhoto: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema);