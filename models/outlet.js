const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const outletSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  timings:{
    open:{
      type: Number,
      required: true,
    },
    close:{
      type: Number,
      required: true,
    }
  },
  products: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 0
      },
      name: {
        type: String,
        default: ""
      },
      imageUrl: {
        type: String,
        default: ""
      },
      price: {
        type: Number,
        default: 0
      },
      category: {
        type: String,
        default: ""
      },
      status: {
        type: String,
        required: true,
        default: 'available'
      }
    }]
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  areaManager: {
    type: Schema.Types.ObjectId,
    ref: 'AreaManager',
    required: true
  }
});
module.exports = mongoose.model('Outlatestoremodel', outletSchema);


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const outletSchema = new Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   state: {
//     type: String,
//     required: true,
//   },
//   area: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['active', 'inactive'],
//     default: 'active',
//   },
//   timing: {
//     type: String,
//     required: true,
//   },
//   products: {
//     items: [{
//       productId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         default: 0
//       }
//     }]
//   },
//   manager: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   areaManager: {
//     type: Schema.Types.ObjectId,
//     ref: 'AreaManager',
//     required: true
//   }
// });
// module.exports = mongoose.model('Outlatestoremodel', outletSchema);