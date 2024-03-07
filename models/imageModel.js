const mongoose = require('mongoose');

const imageModel = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }
    },
    { 
        timestamps: true 
    }
)

module.exports = mongoose.model("Images", imageModel);