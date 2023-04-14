const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outletSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
      },
      timing: {
        type: String,
        required: true,
      },
      products: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          default: []
        }
      ]
  });
module.exports = mongoose.model('Outlatestoremodel', outletSchema);