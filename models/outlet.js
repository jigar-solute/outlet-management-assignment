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
      products: {
        items: [
          {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 0
            }
        }
      ]
    },      
       manager: 
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
  });
module.exports = mongoose.model('Outlatestoremodel', outletSchema);