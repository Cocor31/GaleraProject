const mongoose = require("mongoose");
const validator = require('validator');


const Contact = mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        },
        isAsync: false
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
});



module.exports = mongoose.model(`${process.env.MONGODB_COLLECTION_NAME}`, Contact);