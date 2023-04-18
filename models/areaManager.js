const mongoose = require('mongoose');
const Schema = mongoose.Schema

const areaManagerSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    outletIds: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        validate: {
            validator: function (outletIds) {
                return outletIds.length <= 15;
            },
            message: 'An area manager can only be assigned to a maximum of 15 outlets, add new Area manager'
        },
        default: []
    }
});

module.exports = mongoose.model('AreaManager', areaManagerSchema);