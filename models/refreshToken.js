const mongoose = require('mongoose');
const Schema = mongoose.Schema

const refreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expirationTime: {
        type: Date,
        required: true
    },
});


module.exports = mongoose.model('RefreshToken', refreshTokenSchema);