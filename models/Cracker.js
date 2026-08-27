// // const mongoose = require('mongoose');

// // const CrackerSchema = new mongoose.Schema({
// //   englishName: { type: String, required: true },
// //   tamilName: { type: String, required: true },
// //   originalRate: { type: Number, required: true },
// //   discountRate: { type: Number, required: true },
// //    brand: { type: String, required: true },
// //   imageUrl: { type: String },
// //   imagePublicId: { type: String },
// //   category: { type: String, required: true },
// //   status: { type: Boolean, default: true }   // ✅ add this
// // }, { timestamps: true });

// // module.exports = mongoose.model('Cracker', CrackerSchema);

// const mongoose = require('mongoose');

// const CrackerSchema = new mongoose.Schema(
//   {
//     englishName: {
//       type: String,
//       required: true,
//     },

//     tamilName: {
//       type: String,
//       required: true,
//     },

//     originalRate: {
//       type: Number,
//       required: true,
//     },

//     discountRate: {
//       type: Number,
//       required: true,
//     },

//     brand: {
//       type: String,
//       required: true,
//     },

//     imageUrl: {
//       type: String,
//       default: 'https://placehold.co/600x600/png?text=Cracker+Image',
//     },

//     category: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model('Cracker', CrackerSchema);

const mongoose = require('mongoose');

const CrackerSchema = new mongoose.Schema(
  {
    englishName: {
      type: String,
      required: true,
      trim: true,
    },

    tamilName: {
      type: String,
      required: true,
      trim: true,
    },

    originalRate: {
      type: Number,
      required: true,
    },

    discountRate: {
      type: Number,
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    // Store actual image inside MongoDB
    image: {
      data: {
        type: Buffer,
      },
      contentType: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cracker', CrackerSchema);
